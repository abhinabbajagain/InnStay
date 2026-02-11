# InnStay - Hotel API Integration Guide

This guide explains how to set up and use the third-party Amadeus Hotel API with InnStay.

## Architecture Overview

The application uses a **Flask backend** that acts as a bridge between your frontend and the **Amadeus Hotel API**. This approach provides:

- **Hotel data caching** - Reduce API calls and improve performance
- **Fallback mechanism** - Automatically switches to local data if API is unavailable
- **CORS handling** - Enables secure frontend-backend communication
- **Error handling** - Graceful degradation if third-party API fails

## Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Requirements:**
- Flask 2.3.0
- Flask-CORS 4.0.0
- requests 2.31.0
- python-dotenv 1.0.0

### Step 2: Get Amadeus API Credentials (Free)

1. Visit: https://developers.amadeus.com/
2. Click "Register" (free account, no credit card required)
3. Create a new app in the dashboard
4. Copy your **Client ID** and **Client Secret**

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend/` folder (use `.env.example` as template):

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your Amadeus credentials
AMADEUS_API_KEY=your_client_id_here
AMADEUS_API_SECRET=your_client_secret_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### Step 4: Start the Backend API Server

```bash
cd backend
python app.py
```

Server will start at: `http://localhost:5000`

You should see:
```
Starting InnStay API Server...
API Key configured: Yes
 * Running on http://0.0.0.0:5000
```

### Step 5: Update Frontend Configuration

In `frontend/js/main.js`, the API is already configured:

```javascript
const InnStay = {
    config: {
        apiUrl: 'http://localhost:5000/api',
        useLocalData: false,  // Set to true to use fallback data
    },
    ...
}
```

- **useLocalData: false** - Fetch from API (recommended)
- **useLocalData: true** - Use hardcoded fallback hotels (no API needed)

### Step 6: Start Frontend

```bash
cd frontend
python -m http.server 8000
```

Access at: `http://localhost:8000`

## API Endpoints

The backend provides these endpoints:

### Get Hotels
```
GET /api/hotels?city=NYC&checkIn=2026-02-15&limit=10
```

**Parameters:**
- `city` (optional): City name (NYC, LAX, Chicago, etc.) - default: NYC
- `checkIn` (optional): Check-in date (YYYY-MM-DD)
- `checkOut` (optional): Check-out date (YYYY-MM-DD)
- `limit` (optional): Number of results (1-20) - default: 6

**Response:**
```json
{
  "status": "success",
  "source": "Amadeus API",
  "count": 6,
  "hotels": [
    {
      "id": "HOTEL123",
      "title": "Hotel Name",
      "location": "New York, NY",
      "price": 185,
      "rating": 4.86,
      "reviews": 218,
      "image": "https://..."
    }
  ]
}
```

### Get Specific Hotel
```
GET /api/hotels/1
```

### Search Hotels
```
POST /api/search
Content-Type: application/json

{
  "city": "NYC",
  "checkIn": "2026-02-15",
  "checkOut": "2026-02-20",
  "guests": 2,
  "maxPrice": 300
}
```

### Get Supported Cities
```
GET /api/cities
```

### Health Check
```
GET /api/health
```

## Fallback Mechanism

If the API is unavailable, the system automatically falls back to **8 hardcoded hotels** in New York:

1. Charming Downtown Loft - $185/night
2. Modern City Center Suite - $215/night
3. Cozy Studio with Rooftop - $145/night
4. Luxury 3-Bedroom Brownstone - $325/night
5. Trendy SoHo Loft - $275/night
6. Stunning Manhattan Penthouse - $450/night
7. Charming Brooklyn Heights Cottage - $195/night
8. Budget-Friendly East Village Studio - $125/night

This ensures the app works even without the API key!

## Troubleshooting

### Issue: "API error, falling back to local data"

**Causes:**
1. Backend server not running on `http://localhost:5000`
2. Invalid or missing Amadeus credentials
3. Network connectivity issue

**Solution:**
1. Check backend is running: `python app.py` in `backend/` folder
2. Verify `.env` file has correct credentials
3. Check console for error messages

### Issue: CORS Error

**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
- Make sure Flask-CORS is installed: `pip install flask-cors`
- Backend must be running on `http://localhost:5000`

### Issue: Amadeus Token Error

**Error:** "Could not get access token"

**Causes:**
1. Invalid Client ID/Secret in `.env`
2. Amadeus credentials haven't been activated (wait 5-10 minutes after creating)

**Solution:**
1. Verify credentials at: https://developers.amadeus.com/apps
2. Create new credentials if needed
3. Wait a few minutes and retry

## Using Without API Key

If you don't want to set up Amadeus:

1. Set `useLocalData: true` in `frontend/js/main.js`
2. No backend server needed
3. App uses 8 fallback hotels (fully functional)

## Production Deployment

For production use:

1. **Get paid API tier** from Amadeus (for higher rate limits)
2. **Deploy backend** to cloud service (Heroku, AWS, Azure, etc.)
3. **Update frontend** `apiUrl` to production backend URL
4. **Use environment variables** for sensitive credentials
5. **Add rate limiting** and caching in backend
6. **Monitor API usage** in Amadeus dashboard

## API Rate Limits

- **Free tier**: 10 requests/second
- **Amadeus test server**: No rate limits

Rate limiting is automatically handled by the token caching system in `app.py`.

## File Structure

```
InnStay/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Credentials template
│   └── .env                   # Your actual credentials (git-ignored)
├── frontend/
│   ├── js/
│   │   ├── main.js           # Updated with API integration
│   │   └── utils.js
│   ├── css/
│   │   └── index.css
│   ├── pages/
│   │   └── hotel-details.html
│   └── index.html
└── README.md
```

## Summary

✅ **Complete API Integration:**
- Frontend fetches hotels from backend API
- Backend calls Amadeus Hotel Search API
- Fallback to hardcoded data if API unavailable
- CORS-enabled for cross-origin requests
- Error handling and graceful degradation

✅ **What Works:**
- Hotel search by city
- Price filtering
- Date range selection  
- Rating and review display
- Responsive design

🚀 **Ready for Production:**
- Use paid Amadeus tier for higher limits
- Deploy backend to cloud
- Cache responses for better performance
- Monitor API usage

## Next Steps

1. Get Amadeus credentials (5 minutes)
2. Update `.env` file with your keys
3. Start backend: `python app.py`
4. Start frontend: `python -m http.server 8000`
5. Enjoy hotel search with real API data!

For questions: Check Amadeus docs at https://developers.amadeus.com/
