# Smart Rental Discovery Platform

## Project Overview

### Project Name

RentSphere (Temporary Name)

### Project Type

Full Stack MERN Application

### Domain

Real Estate / Rental Platform

---

# 1. Introduction

Smart Rental Discovery Platform is a location-based rental application where property owners can list flats, shops, and farmhouses for rent, while users can search nearby properties using location-based filtering and advanced property filters.

The platform focuses only on rental properties and does not include property buying functionality.

The application provides:

* Nearby property discovery
* Distance-based search
* Smart filtering
* Owner-user communication
* Google authentication
* Location-aware recommendations
* Property management system

The main objective of the project is to provide a modern and user-friendly rental discovery platform using the MERN stack.

---

# 2. Problem Statement

Finding rental properties is often difficult because:

* Many platforms show irrelevant properties
* Distance from the user is not accurate
* Filters are limited
* Fake listings are common
* Communication between owner and renter is inefficient
* Nearby property discovery is poor

This project solves these problems by providing:

* Location-based search
* Advanced filtering
* Direct owner communication
* Accurate distance calculation
* Property-specific filtering

---

# 3. Objectives

The main objectives of the project are:

* Build a scalable rental platform using MERN stack
* Implement location-based property discovery
* Provide advanced property filters
* Enable direct owner-to-user communication
* Implement Google authentication
* Display nearby properties using geospatial queries
* Build a responsive and user-friendly interface

---

# 4. Features

## 4.1 User Authentication

### Features

* Google Login
* JWT Authentication
* Profile completion flow
* Protected routes

### Workflow

1. User clicks "Continue with Google"
2. Google authentication popup appears
3. Backend verifies Google account
4. User enters phone number to complete profile
5. JWT token is generated
6. User gains access to application

---

## 4.2 Property Listings

Owners can:

* Add property
* Edit property
* Delete property
* Upload property images
* Mark property available/unavailable

Property Types:

* Flats
* Shops
* Farmhouses

---

## 4.3 Location-Based Search

The application uses:

* Browser Geolocation API
* Mapbox API
* MongoDB Geospatial Queries

### Functionality

* User location detection
* Nearby property discovery
* Distance calculation
* Radius-based filtering
* City-based filtering

Example:

* Property is 1.2 km away
* Show properties within 5 km radius

---

## 4.4 Advanced Filtering System

### Flat Filters

#### Basic Filters

* 1RK
* 1BHK
* 2BHK
* 3BHK
* Furnished
* Semi Furnished
* Unfurnished

#### Bathroom Filters

* Indian Toilet
* Western Toilet
* Attached Bathroom

#### Tenant Filters

* Bachelor Allowed
* Family Allowed
* Student Friendly
* Veg Only
* Non-Veg Allowed

#### Amenities

* Parking
* Lift
* Balcony
* WiFi
* AC
* CCTV
* Power Backup
* Water Supply

#### Nearby Location Filters

* Near College
* Near Metro
* Near Bus Stop
* Near Hospital
* Near Market

#### Pricing Filters

* Rent Range
* Deposit Range

---

### Shop Filters

* Road Touch
* Highway Touch
* Commercial Area
* Parking Available
* Washroom
* Storage Room
* Office Type
* Warehouse Type
* Market Area

---

### Farmhouse Filters

* Swimming Pool
* Party Allowed
* Garden
* Parking
* Mountain View
* Lake View
* Max Guests
* Daily Stay
* Weekly Stay

---

## 4.5 Messaging System

Users can:

* Contact owners directly
* Send property-related messages
* Ask questions regarding property

Current version:

* Normal messaging system
* No realtime chat

---

## 4.6 Notifications

In-app notifications for:

* New messages
* Property updates
* Favorite property updates
* New nearby properties

---

## 4.7 Favorites System

Users can:

* Save favorite properties
* View saved listings
* Remove saved properties

---

# 5. System Architecture

## Architecture Type

Client-Server Architecture

### Frontend

Handles:

* User Interface
* User interactions
* API requests
* State management

### Backend

Handles:

* APIs
* Authentication
* Database operations
* Business logic
* Geospatial queries

### Database

Stores:

* Users
* Properties
* Messages
* Favorites
* Notifications

---

# 6. Technology Stack

## Frontend Technologies

| Technology   | Purpose            |
| ------------ | ------------------ |
| React        | Frontend framework |
| Bootstrap    | UI Styling         |
| Context API  | State management   |
| Axios        | API requests       |
| React Router | Routing            |

---

## Backend Technologies

| Technology   | Purpose             |
| ------------ | ------------------- |
| Node.js      | Runtime environment |
| Express.js   | Backend framework   |
| JWT          | Authentication      |
| Multer       | File upload         |
| Google OAuth | Google login        |

---

## Database

| Technology | Purpose         |
| ---------- | --------------- |
| MongoDB    | Main database   |
| Mongoose   | ODM for MongoDB |

---

## Maps & Location

| Technology                 | Purpose               |
| -------------------------- | --------------------- |
| Mapbox                     | Maps and geocoding    |
| Geolocation API            | User location         |
| MongoDB Geospatial Queries | Distance calculations |

---

# 7. How Map System Works

## Step 1: Owner Adds Address

Owner enters:

* City
* Area
* Address

Example:
Kothrud Pune

---

## Step 2: Address Conversion

Mapbox Geocoding API converts address into:

* Latitude
* Longitude

Example:
18.5074, 73.8077

---

## Step 3: Coordinates Stored in Database

Coordinates are stored in MongoDB using GeoJSON format.

Example:

```js
location: {
  type: "Point",
  coordinates: [longitude, latitude]
}
```

---

## Step 4: User Location Detection

Browser Geolocation API detects user location.

---

## Step 5: Nearby Search

MongoDB geospatial queries compare:

* User coordinates
* Property coordinates

Then calculate:

* Nearby properties
* Distance in KM

---

## Step 6: Results Displayed

Example:

* 2BHK Flat
* 1.5 km away
* ₹15,000/month

---

# 8. Database Design

## 8.1 Users Collection

```js
{
  name,
  email,
  googleId,
  phoneNumber,
  role,
  city,
  profileCompleted,
  createdAt
}
```

---

## 8.2 Properties Collection

```js
{
  title,
  description,
  propertyType,
  rent,
  deposit,
  city,
  address,

  location: {
    type,
    coordinates
  },

  amenities,
  images,
  ownerId,
  available,
  createdAt
}
```

---

## 8.3 Messages Collection

```js
{
  senderId,
  receiverId,
  propertyId,
  message,
  createdAt
}
```

---

## 8.4 Favorites Collection

```js
{
  userId,
  propertyId
}
```

---

## 8.5 Notifications Collection

```js
{
  userId,
  title,
  message,
  read,
  createdAt
}
```

---

# 9. API Modules

## Authentication APIs

* POST /auth/google-login
* POST /auth/complete-profile
* GET /auth/me

---

## Property APIs

* POST /properties
* GET /properties
* GET /properties/:id
* PUT /properties/:id
* DELETE /properties/:id

---

## Search APIs

* GET /search/nearby
* GET /search/filter

---

## Messaging APIs

* POST /messages
* GET /messages/:id

---

## Favorites APIs

* POST /favorites
* DELETE /favorites/:id
* GET /favorites

---

## Notification APIs

* GET /notifications
* PUT /notifications/read

---

# 10. Frontend Structure

```txt
src/
 ├── components/
 ├── pages/
 ├── context/
 ├── hooks/
 ├── services/
 ├── routes/
 ├── utils/
 └── assets/
```

---

# 11. Backend Structure

```txt
server/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── services/
 ├── uploads/
 ├── config/
 └── utils/
```

---

# 12. Important Backend Concepts Used

## CRUD Operations

* Create property
* Read property
* Update property
* Delete property

---

## Authentication & Authorization

* JWT authentication
* Protected routes
* Role-based access

---

## Geospatial Queries

MongoDB features:

* $near
* $geoWithin
* 2dsphere indexing

Used for:

* Nearby search
* Distance calculation
* Radius filtering

---

## File Upload Handling

Using Multer:

* Property image uploads
* Local storage handling

---

# 13. User Workflow

## Owner Workflow

1. Login with Google
2. Complete profile
3. Add property details
4. Upload property images
5. Publish property
6. Receive messages from users

---

## User Workflow

1. Login with Google
2. Complete profile
3. Allow location access
4. Search nearby rentals
5. Apply filters
6. View property details
7. Contact owner
8. Save favorite properties

---

# 14. Security Features

* JWT authentication
* Protected routes
* Password-less Google login
* Input validation
* Secure API handling
* File upload validation

---

# 15. Project Summary

Smart Rental Discovery Platform is a MERN stack based rental platform that helps users discover nearby rental properties using location-aware search and advanced filtering.

The platform allows owners to list flats, shops, and farmhouses while enabling users to search properties based on:

* distance
* city
* rental preferences
* amenities
* property type

The application integrates:

* Google authentication
* Mapbox APIs
* MongoDB geospatial queries
* Dynamic filtering system
* Messaging functionality

The project follows a scalable client-server architecture and demonstrates modern full-stack development concepts including:

* authentication
* CRUD operations
* REST APIs
* geospatial search
* file uploads
* filtering systems
* responsive frontend design

The application is designed using the MERN stack:

* React
* Node.js
* Express.js
* MongoDB

and focuses on providing a modern rental discovery experience with location-based recommendations and user-friendly property management.
