# NousFood API
[Live app](https://nousfood-api.herokuapp.com/api/)

## Summary
This API supports [NousFood Client](https://github.com/Quanda/nousfood-client)

## Built with
* NodeJS
* ExpressJS
* MongoDB
* MongooseJS
* PassportJS
* ES6
* See package.json for more

## Using the API

### Authentication / Login
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/auth/login
Bearer Authentication with JSON Web Token
Must supply valid Email and Password in request header
If authentication suceeds, a valid 7d expiry JWT will be provided in response body

### Refresh JWT
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/auth/refresh <br>
The user exchanges a valid JWT for a new one with a later expiration

### Register New User
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/users <br>
Must supply Firstname, Lastname, Email, and Password in request body <br>
If successful, a valid 7d expiry JWT will be provided in response body <br>

### Get All Nootropics
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/nootropics <br>
This endpoint retrieves all nootropics from the system <br>

### Get All Stacks
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/stacks <br>
This endpoint retrieves all public stacks from the system <br>

### Get single public stack
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/stacks/{stackcode} <br>
This endpoint retrieves a single public stacks from the system <br>

### Delete public stack
##### DELETE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/stacks/{stackcode} <br>
Call this endpoint to delete a stack. Only the author of the stack can pass authentication <br>

### Get User 
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/{username} <br>
This endpoint retrieves the entire User object <br>
Bearer Authentication with JSON Web Token
Must supply valid Email and Password in request header

### Get all User stacks
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/{username}/stacks <br>
This endpoint retrieves all the User stacks <br>
Bearer Authentication with JSON Web Token
Must supply valid Email and Password in request header

### Get single User stack
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/{username}/stacks/{stackcode} <br>
This endpoint retrieves a single User stack <br>
Bearer Authentication with JSON Web Token
Must supply valid Email and Password in request header

### DELETE single User stack
##### DELETE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/{username}/stacks/{stackcode} <br>
This endpoint deletes a single User stack <br>
Bearer Authentication with JSON Web Token
Must supply valid Email and Password in request header

### Create a User stack
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/{username}/stacks <br>
This endpoint creates a single User stack <br>
Bearer Authentication with JSON Web Token
Must supply valid Email and Password in request header
