# Authentication with DummyJSON API

This app now uses **DummyJSON** (https://dummyjson.com) for authentication - a free fake REST API for testing and prototyping.

## How It Works

### Login
- **Endpoint**: `POST https://dummyjson.com/auth/login`
- **Method**: Username + Password authentication
- **Response**: Returns user data + JWT token

### Test Users

DummyJSON provides 30+ test users. Here are some you can use:

| Username | Password | Name |
|----------|----------|------|
| `emilys` | `emilyspass` | Emily Johnson |
| `michaelw` | `michaelwpass` | Michael Williams |
| `sophiab` | `sophiabpass` | Sophia Brown |
| `jamesd` | `jamesdpass` | James Davis |
| `emmaj` | `emmajpass` | Emma Miller |

### Full User List
Visit: https://dummyjson.com/users

## Implementation

### Login Flow
1. User enters **username** and **password**
2. App sends POST request to `https://dummyjson.com/auth/login`
3. API returns user profile + token
4. App stores token in AsyncStorage
5. User is redirected to home screen

### API Response Example
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Benefits

✅ **No Backend Required** - Use real API without building server  
✅ **Realistic Testing** - Real HTTP requests and responses  
✅ **Free Forever** - No API key or registration needed  
✅ **Assignment Ready** - Meets requirement for dummy API usage  
✅ **Production-Like** - Easy to replace with real API later  

## Registration Note

Currently, registration still works locally (saves to AsyncStorage). This is because DummyJSON doesn't support user creation. For a complete API solution, you could:

1. Use local registration (current approach)
2. Or skip registration and only use pre-defined test users
3. Or integrate a different API that supports user creation

## Future Integration

To replace with a real backend later:
1. Update the API endpoint in `store/slices/authSlice.ts`
2. Adjust the request/response format if needed
3. Add proper error handling
4. No other code changes required!
