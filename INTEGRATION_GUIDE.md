# Frontend-Backend Integration Guide

## ✅ Integration Status: COMPLETE

Your frontend and backend are now fully connected and working together!

---

## 📋 What Has Been Set Up

### 1. **Backend Configuration** (`backend/.env`)

```env
NODE_ENV=development
PORT=3000

# Development URLs
DEV_BACKEND_URL=http://localhost:3000
DEV_FRONTEND_URL=http://localhost:5173

# Production URLs (Update these before deploying)
PROD_BACKEND_URL=https://your-render-backend-url.onrender.com
PROD_FRONTEND_URL=https://your-netlify-frontend-url.netlify.app

# CORS Configuration (Dynamic based on NODE_ENV)
FRONTEND_URL=http://localhost:5173
```

### 2. **Frontend Configuration**

- **`.env.local`** (Development)

  ```env
  VITE_API_URL=http://localhost:3000
  VITE_ENV=development
  ```

- **`.env.production`** (Production)
  ```env
  VITE_API_URL=https://your-render-backend-url.onrender.com
  VITE_ENV=production
  ```

### 3. **API Service Layer** (`frontend/src/services/api.js`)

- Centralized API client with axios
- Automatic token injection in headers
- Error handling with auto-logout on 401
- Organized API modules:
  - `userAPI` - Login, Register, Profile
  - `serviceAPI` - Service CRUD
  - `appointmentAPI` - Appointments
  - `contactAPI` - Contact messages
  - `adminAPI` - Admin dashboard
  - `paymentAPI` - Payments

### 4. **Authentication Headers**

- **User requests**: `token` header (JWT)
- **Admin requests**: `atoken` header (JWT)

### 5. **Updated Components**

- `AppContext.jsx` - Now uses backend API
- `Login.jsx` - Backend authentication
- `AdminDashboard.jsx` - Fetches real data
- `AdminContacts.jsx` - Real contact management
- `AdminServices.jsx` - Real service management

---

## 🚀 Running Locally

### Terminal 1 - Backend (Port 3000)

```bash
cd backend
npm run dev
# Expected: "Server Started at : 3000"
```

### Terminal 2 - Frontend (Port 5173/5174)

```bash
cd frontend
npm run dev
# Expected: "Local: http://localhost:5173"
```

### Test the Connection

1. Open `http://localhost:5173`
2. Go to **Login** page
3. Click **Create Account** and signup with test data
4. Backend should receive the request and save to MongoDB

---

## 📝 Before Deploying to Production

### For Render (Backend)

1. **Create Render Account** at https://render.com
2. **Create New Web Service**
   - Connect your GitHub repository
   - Build command: `npm install`
   - Start command: `npm start`
   - Select Node.js environment

3. **Set Environment Variables** in Render dashboard:

   ```
   NODE_ENV=production
   PROD_FRONTEND_URL=https://your-netlify-url.netlify.app
   FRONTEND_URL=https://your-netlify-url.netlify.app

   (Also add all other vars from .env.production)
   MONGO_URI=...
   JWT_SECRET=...
   etc.
   ```

4. **Update Backend .env.production** with your Render URL:
   ```env
   PROD_BACKEND_URL=https://your-service-name.onrender.com
   ```

### For Netlify (Frontend)

1. **Create Netlify Account** at https://netlify.com
2. **Connect GitHub Repository**
3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variable**:
   - Go to Site Settings → Build & Deploy → Environment
   - Add: `VITE_API_URL=https://your-render-backend-url.onrender.com`

5. **Update Frontend .env.production**:
   ```env
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

---

## 🔄 CORS Configuration

### Development

- Accepts: `http://localhost:5173`, `http://localhost:3000`

### Production

- Automatically switches based on `NODE_ENV`
- Uses `PROD_FRONTEND_URL` from environment variables

### Server CORS Config (backend/server.js)

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.PROD_FRONTEND_URL,
      process.env.DEV_FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
```

---

## 🧪 Testing the Integration

### Using the Test Script

```bash
node frontend/src/utils/testIntegration.js
```

This tests:

1. ✅ API Health Check
2. ✅ User Registration
3. ✅ User Login
4. ✅ Get Services

### Manual Testing

1. **Signup**: Fill the signup form and submit
   - Should create user in MongoDB
   - Should return JWT token
   - Should redirect to profile

2. **Login**: Use the registered email/password
   - Should return JWT token
   - Should fetch user profile
   - Should redirect to dashboard

3. **Admin Dashboard**: Login with admin credentials
   - `email`: `admin@echosoul.com`
   - `password`: `admin123`

---

## 🔐 Security Checklist

Before Production Deployment:

- [ ] Update `JWT_SECRET` in production env (use strong random string)
- [ ] Update `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- [ ] Verify MongoDB connection is secure (IP whitelist on Atlas)
- [ ] Update SMTP credentials for email notifications
- [ ] Update Razorpay keys from test to live (if using payments)
- [ ] Enable HTTPS (Netlify/Render do this automatically)
- [ ] Remove console.logs from production code
- [ ] Test error handling and 404 pages

---

## 📱 API Endpoints

### User Routes

- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/get-profile` - Get user profile (requires token)
- `POST /api/user/update-profile` - Update profile (requires token)

### Service Routes

- `GET /api/service/list` - Get all services
- `POST /api/service/add` - Add service (admin)
- `DELETE /api/service/delete/:id` - Delete service (admin)

### Appointment Routes

- `POST /api/appointment/book` - Book appointment (requires token)
- `GET /api/appointment/list` - Get appointments (admin)
- `POST /api/appointment/cancel/:id` - Cancel appointment

### Contact Routes

- `POST /api/contact/send` - Send contact message
- `GET /api/contact/all` - Get all contacts (admin)
- `POST /api/contact/update-status` - Update status (admin)

### Admin Routes

- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard-stats` - Dashboard stats (requires atoken)

---

## 🐛 Troubleshooting

### "CORS error: Not allowed by CORS"

- Check `FRONTEND_URL` in backend `.env`
- Verify frontend URL in allowed origins
- Make sure credentials flag is set

### "401 Unauthorized"

- Token might be missing or expired
- Check localStorage for token key
- Verify JWT_SECRET matches between requests

### "MongoDB Connection Failed"

- Verify `MONGO_URI` is correct
- Check IP whitelist on MongoDB Atlas
- Ensure database credentials are right

### "API returns undefined"

- Check response structure in network tab
- Verify API endpoint path matches
- Check error message in browser console

---

## 📚 File Structure After Integration

```
frontend/
├── src/
│   ├── services/
│   │   └── api.js (NEW - Centralized API client)
│   ├── context/
│   │   └── AppContext.jsx (UPDATED - Uses API)
│   ├── pages/
│   │   ├── Login.jsx (UPDATED - Uses API)
│   │   ├── AdminDashboard.jsx (UPDATED - Uses API)
│   │   ├── AdminContacts.jsx (UPDATED - Uses API)
│   │   └── AdminServices.jsx (UPDATED - Uses API)
│   └── utils/
│       └── testIntegration.js (NEW - Test script)
├── .env.local (UPDATED - Dev config)
└── .env.production (NEW - Production config)

backend/
├── .env (UPDATED - Dev config with URLs)
├── .env.production (NEW - Production config)
├── server.js (UPDATED - Dynamic CORS)
├── controllers/
│   └── userController.js (UPDATED - Returns user data)
└── middlewares/
    └── auth.js (Uses token header)
```

---

## 🎉 Ready to Deploy!

Your application is now fully integrated. Follow the deployment steps above for Render and Netlify, and you'll be live!

For any issues, check the browser console and server logs for detailed error messages.
