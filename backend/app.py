"""
InnStay Flask Backend API
MySQL-backed hotel management with JWT auth
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import mysql.connector
import jwt
import os
import json
import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'innstay_db')
DB_PORT = int(os.getenv('DB_PORT', '3306'))
JWT_SECRET = os.getenv('JWT_SECRET', 'change_this_secret')
JWT_EXPIRY_HOURS = int(os.getenv('JWT_EXPIRY_HOURS', '24'))
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )


def fetch_all(query, params=()):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def fetch_one(query, params=()):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params)
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row


def execute(query, params=()):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    last_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return last_id


def parse_list(raw):
    if raw is None:
        return []
    if isinstance(raw, list):
        return raw
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return parsed
    except (TypeError, json.JSONDecodeError):
        pass
    return [item.strip() for item in str(raw).split(',') if item.strip()]


def format_time(value, fallback):
    if value is None:
        return fallback
    try:
        return value.strftime('%H:%M')
    except AttributeError:
        return str(value)


def parse_location(location):
    if not location:
        return '', '', ''
    parts = [part.strip() for part in location.split(',') if part.strip()]
    if len(parts) >= 3:
        return parts[0], parts[1], parts[2]
    if len(parts) == 2:
        return parts[0], '', parts[1]
    return parts[0], '', ''


def row_to_hotel(row):
    city = row.get('city') or ''
    state = row.get('state') or ''
    country = row.get('country') or ''
    location = ', '.join([part for part in [city, state, country] if part])
    image_url = row.get('image_url') or ''
    amenities = parse_list(row.get('amenities'))
    gallery = parse_list(row.get('image_gallery'))

    return {
        'id': row.get('hotel_id'),
        'title': row.get('name'),
        'name': row.get('name'),
        'location': location,
        'price': float(row.get('price_per_night') or 0),
        'rating': float(row.get('rating') or 4.5),
        'reviews': int(row.get('reviews') or 0),
        'image': image_url,
        'images': gallery if gallery else ([image_url] * 3 if image_url else []),
        'description': row.get('description') or '',
        'amenities': amenities,
        'bedrooms': int(row.get('bedrooms') or 1),
        'beds': int(row.get('beds') or 1),
        'bathrooms': int(row.get('bathrooms') or 1),
        'guests': int(row.get('guests') or 2),
        'status': row.get('status') or 'Active',
        'checkIn': format_time(row.get('check_in_time'), '14:00'),
        'checkOut': format_time(row.get('check_out_time'), '11:00')
    }


def row_to_user(row):
    return {
        'id': row.get('user_id'),
        'name': row.get('name'),
        'email': row.get('email'),
        'phone': row.get('phone'),
        'role': row.get('role'),
        'isActive': bool(row.get('is_active')),
        'createdAt': row.get('created_at').isoformat() if row.get('created_at') else None
    }


def create_token(user):
    payload = {
        'user_id': user['user_id'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRY_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def decode_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.PyJWTError:
        return None


def get_auth_user(required_role=None):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.replace('Bearer ', '').strip()
    payload = decode_token(token)
    if not payload:
        return None
    user = fetch_one('SELECT * FROM users WHERE user_id = %s', (payload['user_id'],))
    if not user:
        return None
    if required_role and user.get('role') != required_role:
        return None
    return user


def allowed_file(filename):
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXTENSIONS


@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'InnStay API is running'}), 200


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = fetch_one('SELECT * FROM users WHERE email = %s AND is_active = TRUE', (email,))
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

    token = create_token(user)
    return jsonify({'status': 'success', 'token': token, 'user': row_to_user(user)}), 200


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'status': 'error', 'message': 'Name, email and password are required'}), 400

    existing = fetch_one('SELECT user_id FROM users WHERE email = %s', (email,))
    if existing:
        return jsonify({'status': 'error', 'message': 'Email already exists'}), 400

    hashed = generate_password_hash(password)
    user_id = execute(
        'INSERT INTO users (name, email, password, phone, role, is_active) VALUES (%s, %s, %s, %s, %s, %s)',
        (name, email, hashed, phone, 'user', True)
    )
    user = fetch_one('SELECT * FROM users WHERE user_id = %s', (user_id,))
    token = create_token(user)
    return jsonify({'status': 'success', 'token': token, 'user': row_to_user(user)}), 201


@app.route('/api/auth/me', methods=['GET'])
def me():
    user = get_auth_user()
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    return jsonify({'status': 'success', 'user': row_to_user(user)}), 200


@app.route('/api/admin/uploads', methods=['POST'])
def upload_images():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    if 'images' not in request.files:
        return jsonify({'status': 'error', 'message': 'No files uploaded'}), 400

    files = request.files.getlist('images')
    urls = []

    for file in files:
        if not file or file.filename == '':
            continue
        if not allowed_file(file.filename):
            continue
        filename = secure_filename(file.filename)
        unique_name = f"{datetime.datetime.utcnow().timestamp()}_{filename}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_name)
        file.save(file_path)
        urls.append(f"/uploads/{unique_name}")

    return jsonify({'status': 'success', 'urls': urls}), 200


@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    limit = int(request.args.get('limit', 20))
    rows = fetch_all(
        'SELECT * FROM hotels WHERE is_active = TRUE ORDER BY hotel_id DESC LIMIT %s',
        (limit,)
    )
    hotels = [row_to_hotel(row) for row in rows]
    return jsonify({'status': 'success', 'count': len(hotels), 'hotels': hotels}), 200


@app.route('/api/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel_details(hotel_id):
    row = fetch_one('SELECT * FROM hotels WHERE hotel_id = %s', (hotel_id,))
    if not row:
        return jsonify({'status': 'error', 'message': 'Hotel not found'}), 404
    return jsonify({'status': 'success', 'hotel': row_to_hotel(row)}), 200


@app.route('/api/admin/hotels', methods=['GET'])
def admin_hotels_list():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    rows = fetch_all('SELECT * FROM hotels ORDER BY hotel_id DESC')
    hotels = [row_to_hotel(row) for row in rows]
    return jsonify({'status': 'success', 'count': len(hotels), 'hotels': hotels}), 200


@app.route('/api/admin/hotels', methods=['POST'])
def admin_hotels_create():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    data = request.get_json() or {}

    name = data.get('name') or data.get('title')
    location = data.get('location') or ''
    description = data.get('description') or ''
    image_url = data.get('image') or ''
    image_gallery = json.dumps(data.get('images') or [])
    amenities = json.dumps(data.get('amenities') or [])
    status = data.get('status') or 'Active'
    is_active = status != 'Suspended'

    city, state, country = parse_location(location)
    price = data.get('price') or 0
    rating = data.get('rating') or 4.5
    reviews = data.get('reviews') or 0

    bedrooms = data.get('bedrooms') or 1
    beds = data.get('beds') or 1
    bathrooms = data.get('bathrooms') or 1
    guests = data.get('guests') or 2

    if not name or not city:
        return jsonify({'status': 'error', 'message': 'Name and location are required'}), 400

    hotel_id = execute(
        """
        INSERT INTO hotels
            (name, description, address, city, state, country, price_per_night, rating, reviews,
             image_url, image_gallery, amenities, bedrooms, beds, bathrooms, guests, status, is_active)
        VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            name,
            description,
            location,
            city,
            state,
            country or 'USA',
            price,
            rating,
            reviews,
            image_url,
            image_gallery,
            amenities,
            bedrooms,
            beds,
            bathrooms,
            guests,
            status,
            is_active
        )
    )

    row = fetch_one('SELECT * FROM hotels WHERE hotel_id = %s', (hotel_id,))
    return jsonify({'status': 'success', 'hotel': row_to_hotel(row)}), 201


@app.route('/api/admin/hotels/<int:hotel_id>', methods=['PUT'])
def admin_hotels_update(hotel_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    data = request.get_json() or {}

    row = fetch_one('SELECT * FROM hotels WHERE hotel_id = %s', (hotel_id,))
    if not row:
        return jsonify({'status': 'error', 'message': 'Hotel not found'}), 404

    name = data.get('name') or data.get('title') or row.get('name')
    location = data.get('location') or row.get('address') or ''
    description = data.get('description') or row.get('description')
    image_url = data.get('image') or row.get('image_url')
    amenities = json.dumps(data.get('amenities') or parse_list(row.get('amenities')))
    image_gallery = json.dumps(data.get('images') or parse_list(row.get('image_gallery')))
    status = data.get('status') or row.get('status') or 'Active'
    is_active = status != 'Suspended'

    city, state, country = parse_location(location)
    price = data.get('price', row.get('price_per_night') or 0)
    rating = data.get('rating', row.get('rating') or 4.5)
    reviews = data.get('reviews', row.get('reviews') or 0)

    bedrooms = data.get('bedrooms', row.get('bedrooms') or 1)
    beds = data.get('beds', row.get('beds') or 1)
    bathrooms = data.get('bathrooms', row.get('bathrooms') or 1)
    guests = data.get('guests', row.get('guests') or 2)

    execute(
        """
        UPDATE hotels
        SET name=%s,
            description=%s,
            address=%s,
            city=%s,
            state=%s,
            country=%s,
            price_per_night=%s,
            rating=%s,
            reviews=%s,
            image_url=%s,
            image_gallery=%s,
            amenities=%s,
            bedrooms=%s,
            beds=%s,
            bathrooms=%s,
            guests=%s,
            status=%s,
            is_active=%s
        WHERE hotel_id=%s
        """,
        (
            name,
            description,
            location,
            city,
            state,
            country or 'USA',
            price,
            rating,
            reviews,
            image_url,
            image_gallery,
            amenities,
            bedrooms,
            beds,
            bathrooms,
            guests,
            status,
            is_active,
            hotel_id
        )
    )

    updated = fetch_one('SELECT * FROM hotels WHERE hotel_id = %s', (hotel_id,))
    return jsonify({'status': 'success', 'hotel': row_to_hotel(updated)}), 200


@app.route('/api/admin/hotels/<int:hotel_id>', methods=['DELETE'])
def admin_hotels_delete(hotel_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    execute('DELETE FROM hotels WHERE hotel_id = %s', (hotel_id,))
    return jsonify({'status': 'success', 'message': 'Hotel deleted'}), 200


@app.route('/api/admin/users', methods=['GET'])
def admin_users_list():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    rows = fetch_all('SELECT * FROM users ORDER BY created_at DESC')
    users = [row_to_user(row) for row in rows]
    return jsonify({'status': 'success', 'count': len(users), 'users': users}), 200


@app.route('/api/admin/users', methods=['POST'])
def admin_users_create():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    role = data.get('role', 'user')
    is_active = bool(data.get('isActive', True))
    password = data.get('password', '').strip() or 'ChangeMe123!'

    if not name or not email:
        return jsonify({'status': 'error', 'message': 'Name and email are required'}), 400

    existing = fetch_one('SELECT user_id FROM users WHERE email = %s', (email,))
    if existing:
        return jsonify({'status': 'error', 'message': 'Email already exists'}), 400

    hashed = generate_password_hash(password)
    user_id = execute(
        'INSERT INTO users (name, email, password, phone, role, is_active) VALUES (%s, %s, %s, %s, %s, %s)',
        (name, email, hashed, phone, role, is_active)
    )
    row = fetch_one('SELECT * FROM users WHERE user_id = %s', (user_id,))
    return jsonify({'status': 'success', 'user': row_to_user(row)}), 201


@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
def admin_users_update(user_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    data = request.get_json() or {}
    row = fetch_one('SELECT * FROM users WHERE user_id = %s', (user_id,))
    if not row:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    name = data.get('name', row.get('name'))
    email = data.get('email', row.get('email'))
    phone = data.get('phone', row.get('phone'))
    role = data.get('role', row.get('role'))
    is_active = bool(data.get('isActive', row.get('is_active')))

    execute(
        """
        UPDATE users
        SET name=%s,
            email=%s,
            phone=%s,
            role=%s,
            is_active=%s
        WHERE user_id=%s
        """,
        (name, email, phone, role, is_active, user_id)
    )

    updated = fetch_one('SELECT * FROM users WHERE user_id = %s', (user_id,))
    return jsonify({'status': 'success', 'user': row_to_user(updated)}), 200


@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def admin_users_delete(user_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    execute('DELETE FROM users WHERE user_id = %s', (user_id,))
    return jsonify({'status': 'success', 'message': 'User deleted'}), 200


@app.route('/api/admin/bookings', methods=['GET'])
def admin_bookings_list():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    rows = fetch_all(
        """
        SELECT b.*, u.name AS user_name, h.name AS hotel_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.user_id
        LEFT JOIN hotels h ON b.hotel_id = h.hotel_id
        ORDER BY b.created_at DESC
        """
    )
    for row in rows:
        row['user_name'] = row.get('user_name')
        row['hotel_name'] = row.get('hotel_name')
    return jsonify({'status': 'success', 'count': len(rows), 'bookings': rows}), 200


@app.route('/api/admin/bookings', methods=['POST'])
def admin_bookings_create():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    data = request.get_json() or {}
    user_id = data.get('user_id')
    hotel_id = data.get('hotel_id')
    room_id = data.get('room_id')
    check_in = data.get('check_in_date')
    check_out = data.get('check_out_date')
    guests = data.get('number_of_guests', 1)
    total_price = data.get('total_price', 0)
    status = data.get('status', 'pending')

    booking_id = execute(
        """
        INSERT INTO bookings
            (user_id, hotel_id, room_id, check_in_date, check_out_date, number_of_guests, total_price, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (user_id, hotel_id, room_id, check_in, check_out, guests, total_price, status)
    )

    row = fetch_one('SELECT * FROM bookings WHERE booking_id = %s', (booking_id,))
    return jsonify({'status': 'success', 'booking': row}), 201


@app.route('/api/admin/bookings/<int:booking_id>', methods=['PUT'])
def admin_bookings_update(booking_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    data = request.get_json() or {}
    row = fetch_one('SELECT * FROM bookings WHERE booking_id = %s', (booking_id,))
    if not row:
        return jsonify({'status': 'error', 'message': 'Booking not found'}), 404

    execute(
        """
        UPDATE bookings
        SET user_id=%s,
            hotel_id=%s,
            room_id=%s,
            check_in_date=%s,
            check_out_date=%s,
            number_of_guests=%s,
            total_price=%s,
            status=%s
        WHERE booking_id=%s
        """,
        (
            data.get('user_id', row.get('user_id')),
            data.get('hotel_id', row.get('hotel_id')),
            data.get('room_id', row.get('room_id')),
            data.get('check_in_date', row.get('check_in_date')),
            data.get('check_out_date', row.get('check_out_date')),
            data.get('number_of_guests', row.get('number_of_guests')),
            data.get('total_price', row.get('total_price')),
            data.get('status', row.get('status')),
            booking_id
        )
    )

    updated = fetch_one('SELECT * FROM bookings WHERE booking_id = %s', (booking_id,))
    return jsonify({'status': 'success', 'booking': updated}), 200


@app.route('/api/admin/bookings/<int:booking_id>', methods=['DELETE'])
def admin_bookings_delete(booking_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    execute('DELETE FROM bookings WHERE booking_id = %s', (booking_id,))
    return jsonify({'status': 'success', 'message': 'Booking deleted'}), 200


@app.route('/api/admin/reviews', methods=['GET'])
def admin_reviews_list():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    rows = fetch_all(
        """
        SELECT r.*, u.name AS user_name, h.name AS hotel_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.user_id
        LEFT JOIN hotels h ON r.hotel_id = h.hotel_id
        ORDER BY r.created_at DESC
        """
    )
    return jsonify({'status': 'success', 'count': len(rows), 'reviews': rows}), 200


@app.route('/api/admin/reviews', methods=['POST'])
def admin_reviews_create():
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    data = request.get_json() or {}
    review_id = execute(
        """
        INSERT INTO reviews
            (booking_id, hotel_id, user_id, rating, title, comment, cleanliness_rating, service_rating, value_rating, is_verified)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            data.get('booking_id'),
            data.get('hotel_id'),
            data.get('user_id'),
            data.get('rating'),
            data.get('title'),
            data.get('comment'),
            data.get('cleanliness_rating'),
            data.get('service_rating'),
            data.get('value_rating'),
            bool(data.get('is_verified', False))
        )
    )
    row = fetch_one('SELECT * FROM reviews WHERE review_id = %s', (review_id,))
    return jsonify({'status': 'success', 'review': row}), 201


@app.route('/api/admin/reviews/<int:review_id>', methods=['PUT'])
def admin_reviews_update(review_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    row = fetch_one('SELECT * FROM reviews WHERE review_id = %s', (review_id,))
    if not row:
        return jsonify({'status': 'error', 'message': 'Review not found'}), 404

    data = request.get_json() or {}

    execute(
        """
        UPDATE reviews
        SET booking_id=%s,
            hotel_id=%s,
            user_id=%s,
            rating=%s,
            title=%s,
            comment=%s,
            cleanliness_rating=%s,
            service_rating=%s,
            value_rating=%s,
            is_verified=%s
        WHERE review_id=%s
        """,
        (
            data.get('booking_id', row.get('booking_id')),
            data.get('hotel_id', row.get('hotel_id')),
            data.get('user_id', row.get('user_id')),
            data.get('rating', row.get('rating')),
            data.get('title', row.get('title')),
            data.get('comment', row.get('comment')),
            data.get('cleanliness_rating', row.get('cleanliness_rating')),
            data.get('service_rating', row.get('service_rating')),
            data.get('value_rating', row.get('value_rating')),
            bool(data.get('is_verified', row.get('is_verified'))),
            review_id
        )
    )

    updated = fetch_one('SELECT * FROM reviews WHERE review_id = %s', (review_id,))
    return jsonify({'status': 'success', 'review': updated}), 200


@app.route('/api/admin/reviews/<int:review_id>', methods=['DELETE'])
def admin_reviews_delete(review_id):
    user = get_auth_user('admin')
    if not user:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    execute('DELETE FROM reviews WHERE review_id = %s', (review_id,))
    return jsonify({'status': 'success', 'message': 'Review deleted'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv('API_PORT', '5000')))
