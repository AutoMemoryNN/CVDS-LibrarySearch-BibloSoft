### Auth Service API - README

#### **Overview**
The **Auth Service API** provides authentication and authorization functionalities. It includes user management, session handling, and health monitoring endpoints.

---

### **Table of Contents**
1. [Features](#features)  
2. [Authentication](#authentication)  
3. [Endpoints](#endpoints)  
    - [Auth Endpoints](#auth-endpoints)  
    - [User Endpoints](#user-endpoints)  
    - [Health Endpoints](#health-endpoints)  
4. [Schemas](#schemas)  

---

### **Features**
- Secure authentication using JWT tokens.
- User registration, login, and role management.
- Session management (refresh and logout).
- Health check endpoint.

---

### **Authentication**
This API uses **Bearer Token Authentication**. Include the following header in your requests:
```http
Authorization: Bearer <your-token>
```

---

### **Endpoints**

#### **Auth Endpoints**
1. **Get Current Session**  
   **`GET /auth/session`**  
   Retrieves the details of the current session.  
   - **Headers**:  
     - `Authorization` (Required): `Bearer <token>`  
   - **Responses**:  
     - `200 OK`: Returns session details.  
     - `401 Unauthorized`: Invalid or missing token.  

2. **User Login**  
   **`POST /auth/login`**  
   Logs in a user and returns a JWT token.  
   - **Request Body**:  
     ```json
     {
       "username": "admin",
       "password": "admin"
     }
     ```
   - **Responses**:  
     - `201 Created`: Returns the JWT token.  
     - `400 Bad Request`: Invalid request payload.  
     - `401 Unauthorized`: Incorrect credentials.  
     - `404 Not Found`: User does not exist. 

3. **Refresh Session**  
   **`PATCH /auth/session`**  
   Generates a new JWT token for the current session.  
   - **Headers**:  
     - `Authorization` (Required): `Bearer <token>`  
   - **Responses**:  
     - `200 OK`: Returns the new token.  
     - `401 Unauthorized`: Invalid or missing token.  

4. **Log Out**  
   **`DELETE /auth/session`**  
   Logs out the user, invalidating the current session.  
   - **Headers**:  
     - `Authorization` (Required): `Bearer <token>`  
   - **Responses**:  
     - `200 OK`: Logout successful.  
     - `401 Unauthorized`: Invalid or missing token.   

#### **User Endpoints**
1. **Create User**  
   **`POST /users`**  
   Registers a new user in the system.  
   - **Request Body**:  
     ```json
     {
       "username": "cvds",
       "password": "password",
       "role": "admin"
     }
     ```
   - **Responses**:  
     - `201 Created`: User successfully created.  
     - `400 Bad Request`: Invalid input data.  
     - `409 Conflict`: User already exists.  

2. **Update User**  
   **`PATCH /users`**  
   Updates details of an existing user.  
   - **Request Body**:  
     ```json
     {
       "id": "1",
       "username": "newUsername",
       "password": "newPassword",
       "role": "user"
     }
     ```
   - **Responses**:  
     - `200 OK`: User successfully updated.  
     - `400 Bad Request`: Invalid input data.  
     - `401 Unauthorized`: Missing or invalid permissions.  
     - `403 Forbidden`: Insufficient permissions.  
     - `409 Conflict`: User already exists.  

3. **Delete User**  
   **`DELETE /users/{id}`**  
   Deletes a user by their unique identifier.  
   - **Path Parameters**:  
     - `id` (Required): The ID of the user to delete.  
   - **Responses**:  
     - `200 OK`: User successfully deleted.  
     - `401 Unauthorized`: Missing or invalid permissions.  
     - `404 Not Found`: User not found.  

#### **Health Endpoints**
1. **Ping Health Check**  
   **`GET /health/ping`**  
   Simple endpoint to verify API health.  
   - **Responses**:  
     - `200 OK`: API is operational.  

---

### **Schemas**

#### **LoginDto**
```json
{
  "username": "admin",
  "password": "admin"
}
```

#### **NewUserDto**
```json
{
  "username": "cvds",
  "password": "password",
  "role": "admin"
}
```

#### **UpdateUserDto**
```json
{
  "id": "1",
  "username": "cvds",
  "password": "password",
  "role": "admin"
}
```
