# Shop RESTful API 

# Description

A RESTful API for an online store.

**Tech Stack:** *JavaScript, Node, Express, MongoDB, Mongoose*

# Routes 

## Create User (Signup)

Creates a new user, and encrypts their password with BCrypt

* **URL**

  /user/signup

* **Method:**

  `POST`
  
*  **URL Params**

 None

* **Data Params**

  `{ "email": "name@email.com", "password": "password" }`

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ id: 1, email: "name@email.com", password: "encrypted" }`
 
* **Error Response:**

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ error : "User already exists with that email, please login" }`

  OR

  * **Code:** 500 ERROR <br />
    **Content:** `{ error : message }`
