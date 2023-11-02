# authentication-manager
A React app (frontend) that uses Express and Mongoose (backend) to manage user registration and login using JSON Web Tokens (JWT). Users have different roles (rights) within the application such as reassigning other users to different organizational units and departments. Additionaly, JWT tokens are are checked in the backend to ensure the user has the access/rights to perform specific operations. 

## To use this app with a browser, do the following:
#### Backend
- Clone the repo to you local machine
- Open the project and in your command line interface, navigate to this folder and type `npm install` to download and insall the node-modules needed to run the backend.
- Run the backend typing `npm start`. The project uses [nodemon](https://www.npmjs.com/package/nodemon) to automatically reload everytime a change is made and saved. 
- The front end will run on http://localhost:8000/
- If you do not have MongoDB account already, create a new one [here](https://www.mongodb.com/)
- Inside MongoDB, create one document for the [Organisation Unit Model](https://github.com/KaraboMolemane/authentication-manager/blob/b4c40fc2c9b965f70f82d1ce5fc03a9a28b96b38/models/organisational_unit.model.js) and the [User Model](https://github.com/KaraboMolemane/authentication-manager/blob/b4c40fc2c9b965f70f82d1ce5fc03a9a28b96b38/models/user.model.js).
- The User Model should have at least one admin user that will have rights to assign user roles and assign users to departments.
- In the root folder, create a `.env` file and add your connection string as follows: 

`MONGODB_URI="your-mongodb-uri-here"`
- NB!!! Remember not to ever publish your connection string to GitHub 

#### Frontend
- Open another instance of the terminal on your project and navigate to the frontend by typing `cd frontend`. 
- Install the dev dependecies for the frontend application by typing `npm install`.
-  Run the frontend by typing `npm start`. The project will automatically open the application on http://localhost:3000/ and it will reload everytime changes are made. 
- Register as a user and login. At this point you will need the admin user to assin the newly registered user to at least on department within an organisational uint. Depending on the user role/rights, the newly registered user will then be able to view, add, and edit departmental repo entries. 
