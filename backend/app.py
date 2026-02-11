"""
InnStay Flask Backend API
Handles hotel data from third-party APIs (Amadeus)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from functools import lru_cache
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
AMADEUS_API_KEY = os.getenv('AMADEUS_API_KEY', 'YOUR_API_KEY')
AMADEUS_API_SECRET = os.getenv('AMADEUS_API_SECRET', 'YOUR_API_SECRET')
AMADEUS_BASE_URL = 'https://test.api.amadeus.com'

# Fallback hotels if API fails
FALLBACK_HOTELS = [
    {
        "id": 1,
        "title": "Charming Downtown Loft",
        "location": "Lower Manhattan, New York, NY",
        "price": 185,
        "rating": 4.86,
        "reviews": 218,
        "image": "https://images.unsplash.com/photo-1631049307038-da31e36f2d5c?w=500",
        "description": "Beautiful modern loft in the heart of Manhattan with stunning city views and high ceilings."
    },
    {
        "id": 2,
        "title": "Modern City Center Suite",
        "location": "Midtown Manhattan, New York, NY",
        "price": 215,
        "rating": 4.94,
        "reviews": 289,
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
        "description": "Contemporary suite with full amenities, perfect for business and leisure travelers."
    },
    {
        "id": 3,
        "title": "Cozy Studio with Rooftop",
        "location": "Upper West Side, New York, NY",
        "price": 145,
        "rating": 4.78,
        "reviews": 156,
        "image": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500",
        "description": "Compact and cozy studio featuring private access to rooftop with panoramic views."
    },
    {
        "id": 4,
        "title": "Luxury 3-Bedroom Brownstone",
        "location": "Brooklyn Heights, New York, NY",
        "price": 325,
        "rating": 4.95,
        "reviews": 342,
        "image": "https://images.unsplash.com/photo-1614008375896-cb53fc677b86?w=500",
        "description": "Spacious luxury brownstone with 3 bedrooms, perfect for families and groups."
    },
    {
        "id": 5,
        "title": "Trendy SoHo Loft",
        "location": "SoHo, New York, NY",
        "price": 275,
        "rating": 4.85,
        "reviews": 201,
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
        "description": "Hip and trendy loft in the artistic neighborhood of SoHo with local vibes."
    },
    {
        "id": 6,
        "title": "Stunning Manhattan Penthouse",
        "location": "Tribeca, New York, NY",
        "price": 450,
        "rating": 5.0,
        "reviews": 183,
        "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
        "description": "Exclusive penthouse with terrace, fitness center, and breathtaking skyline views."
    },
    {
        "id": 7,
        "title": "Charming Brooklyn Heights Cottage",
        "location": "Brooklyn, New York, NY",
        "price": 195,
        "rating": 4.82,
        "reviews": 167,
        "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        "description": "Charming cottage-style accommodation with period features and modern conveniences."
    },
    {
        "id": 8,
        "title": "Budget-Friendly East Village Studio",
        "location": "East Village, New York, NY",
        "price": 125,
        "rating": 4.60,
        "reviews": 145,
        "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500",
        "description": "Affordable studio in vibrant East Village neighborhood, great for backpackers."
    }
]

# Token cache
_access_token = None
_token_expiry = 0


def get_amadeus_token():
    """Get Amadeus API access token"""
    global _access_token, _token_expiry
    import time
    
    current_time = time.time()
    if _access_token and current_time < _token_expiry:
        return _access_token
    
    try:
        auth_url = f'{AMADEUS_BASE_URL}/v1/security/oauth2/token'
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        data = {
            'grant_type': 'client_credentials',
            'client_id': AMADEUS_API_KEY,
            'client_secret': AMADEUS_API_SECRET
        }
        
        response = requests.post(auth_url, headers=headers, data=data)
        response.raise_for_status()
        
        token_data = response.json()
        _access_token = token_data.get('access_token')
        _token_expiry = current_time + token_data.get('expires_in', 1800) - 60
        
        return _access_token
    except Exception as e:
        print(f"Token error: {e}")
        return None


@lru_cache(maxsize=100)
def search_amadeus_hotels(city_code, check_in_date, check_out_date=None, radius=10, language='en', max_results=10):
    """Search hotels using Amadeus API"""
    try:
        token = get_amadeus_token()
        if not token:
            print("Could not get access token, using fallback hotels")
            return None
        
        url = f'{AMADEUS_BASE_URL}/v2/shopping/hotel-offers'
        headers = {'Authorization': f'Bearer {token}', 'Language': language}
        params = {
            'cityCode': city_code,
            'checkInDate': check_in_date,
            'radius': radius,
            'radiusUnit': 'KM',
            'max': max_results
        }
        
        if check_out_date:
            params['checkOutDate'] = check_out_date
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        return response.json()
    except Exception as e:
        print(f"Amadeus API error: {e}")
        return None


def format_amadeus_hotel(hotel_data):
    """Convert Amadeus hotel data to InnStay format"""
    return {
        'id': hotel_data.get('id'),
        'title': hotel_data.get('name', 'Hotel'),
        'location': ', '.join(filter(None, [
            hotel_data.get('address', {}).get('cityName'),
            hotel_data.get('address', {}).get('countryCode')
        ])),
        'price': float(hotel_data.get('offers', [{}])[0].get('price', {}).get('total', 0)) if hotel_data.get('offers') else 100,
        'rating': 4.5,
        'reviews': 150,
        'image': 'https://images.unsplash.com/photo-1631049307038-da31e36f2d5c?w=500',
        'description': hotel_data.get('description', 'Hotel accommodation')
    }


# Routes

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'InnStay API is running'}), 200


@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    """Get all hotels or search hotels"""
    city = request.args.get('city', 'NYC')
    check_in = request.args.get('checkIn', '2026-02-15')
    check_out = request.args.get('checkOut', '2026-02-20')
    limit = int(request.args.get('limit', 10))
    
    try:
        # City code mapping
        city_codes = {
            'new york': 'NYC',
            'nyc': 'NYC',
            'new york city': 'NYC',
            'los angeles': 'LAX',
            'la': 'LAX',
            'los angeles county': 'LAX',
            'chicago': 'ORD',
            'las vegas': 'LAS',
            'miami': 'MIA',
            'san francisco': 'SFO',
            'boston': 'BOS',
            'seattle': 'SEA'
        }
        
        city_code = city_codes.get(city.lower(), 'NYC')
        
        # Try Amadeus API first
        amadeus_data = search_amadeus_hotels(city_code, check_in, check_out, max_results=limit)
        
        if amadeus_data and 'data' in amadeus_data and len(amadeus_data['data']) > 0:
            hotels = [format_amadeus_hotel(h) for h in amadeus_data['data'][:limit]]
            return jsonify({
                'status': 'success',
                'source': 'Amadeus API',
                'count': len(hotels),
                'hotels': hotels
            }), 200
        else:
            # Fallback to hardcoded hotels for the city
            fallback_filtered = [h for h in FALLBACK_HOTELS if city.lower() in h['location'].lower() or city_code == 'NYC']
            if not fallback_filtered:
                fallback_filtered = FALLBACK_HOTELS
            
            return jsonify({
                'status': 'success',
                'source': 'Fallback Hotels',
                'count': len(fallback_filtered),
                'hotels': fallback_filtered[:limit]
            }), 200
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'status': 'success',
            'source': 'Fallback Hotels',
            'count': len(FALLBACK_HOTELS),
            'hotels': FALLBACK_HOTELS[:limit]
        }), 200


@app.route('/api/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel_details(hotel_id):
    """Get details for a specific hotel"""
    hotel = next((h for h in FALLBACK_HOTELS if h['id'] == hotel_id), None)
    if hotel:
        return jsonify({'status': 'success', 'hotel': hotel}), 200
    return jsonify({'status': 'error', 'message': 'Hotel not found'}), 404


@app.route('/api/search', methods=['GET', 'POST'])
def search_hotels():
    """Search hotels with filters"""
    if request.method == 'POST':
        data = request.get_json()
        city = data.get('city', 'NYC')
        check_in = data.get('checkIn')
        check_out = data.get('checkOut')
        guests = data.get('guests', 1)
        max_price = data.get('maxPrice', 1000)
    else:
        city = request.args.get('city', 'NYC')
        check_in = request.args.get('checkIn')
        check_out = request.args.get('checkOut')
        guests = int(request.args.get('guests', 1))
        max_price = int(request.args.get('maxPrice', 1000))
    
    # Get hotels from API
    hotels_response = get_hotels()
    hotels_data = hotels_response[0].get_json()
    
    # Filter by price
    filtered_hotels = [h for h in hotels_data['hotels'] if h['price'] <= max_price]
    
    return jsonify({
        'status': 'success',
        'count': len(filtered_hotels),
        'filters': {
            'city': city,
            'checkIn': check_in,
            'checkOut': check_out,
            'guests': guests,
            'maxPrice': max_price
        },
        'hotels': filtered_hotels
    }), 200


@app.route('/api/cities', methods=['GET'])
def get_cities():
    """Get list of supported cities"""
    cities = [
        {'name': 'New York', 'code': 'NYC'},
        {'name': 'Los Angeles', 'code': 'LAX'},
        {'name': 'Chicago', 'code': 'ORD'},
        {'name': 'Las Vegas', 'code': 'LAS'},
        {'name': 'Miami', 'code': 'MIA'},
        {'name': 'San Francisco', 'code': 'SFO'},
        {'name': 'Boston', 'code': 'BOS'},
        {'name': 'Seattle', 'code': 'SEA'}
    ]
    return jsonify({'cities': cities}), 200


if __name__ == '__main__':
    print("Starting InnStay API Server...")
    print(f"API Key configured: {'Yes' if AMADEUS_API_KEY != 'YOUR_API_KEY' else 'No - Using fallback hotels'}")
    app.run(debug=True, port=5000, host='0.0.0.0')
