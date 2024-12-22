[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mH5r8fxQ)

![Noroff](http://images.restapi.co.za/pvt/Noroff-64.png)
# Noroff EP e-commerce Application
## Back-end Development Year 1
### EP - Course Assignment Back-end
---
### Environment Configuration Example  
  
The application requires .env files for both the front-end and back-end to configure sensitive information. Below is an example configuration for the .env files:    

- Back-End .env Example:  

HOST="localhost"  
ADMIN_USERNAME="your_admin_username"  
ADMIN_PASSWORD="your_admin_password"  
DATABASE_NAME="your_database_name"  
DIALECT="mysql"  
PORT="3001"  
TOKEN_SECRET="your_token_secret"  

- Front-End .env Example:  

BACKEND_API_URL = "http://localhost:3001"  
PORT = "3000"

### Running the Application

Before starting:

- Node.js: Ensure you have Node.js installed.
- MySQL: A running MySQL is required for the back-end.
- Git: To clone the repository.
---

1. First clone the repository (https://github.com/noroff-backend-1/ep-ca-1-GeiraHaug). 
2. Navigate to the back-end folder by typing "cd back-end" in the terminal, and then do the same in the front-end folder ("cd front-end").
3. Type in "npm install" to install all dependencies.
4. Create a .env file in the back-end and the front-end folders based on the examples above.  
5. Then you can start the servers by typing "npm start" in the terminal, first while in the back-end folder, and then navigate to the front-end folder and type "npm start" there as well.
6. IMPORTANT! In order to use the application it must first be initialized by sending "POST http://localhost:3001/init" in postman or by accessing the swager documentation (http://localhost:3001/doc) and execute the /init there.
7. To run the jest/supertest for the back-end, open a new terminal, navigate to the back-end folder ("cd back-end") and type "npm test".
8. The admin front-end can be accessed by opening your web browser and navigate to "http://localhost:3000"

- The API documentation (Swagger) can be viewed in http://localhost:3001/doc . Here you can test and see all the endpoints of the back-end.
- The back-end runs on "http://localhost:3001" for testing endpoints in postman.
- Only the admin can log into the front-end browser.
- The front-end is partially done. The admin can log in and navigate through the views in the navbar. The only seperate button that works is the "Add Product" button.


### Plugins and Libraries

Back-end:

- Express.js
- Sequelize
- MySQL2
- dotenv
- jsonwebtoken
- jsend
- swagger-autogen
- swagger-ui-express
- validator
- --save-dev jest
- --save-dev supertest

Front-end:

- Express.js
- EJS
- Bootstrap
- express-session
- dotenv
- jsonwebtoken

Node version:
- v22.12.0

---

### REFERENCES

Back-end:

- ID field was implemented into the models in the models folder as I sourced information about this from ChatGPT. This is to maintain control of managing the primary keys, as this project is bigger than previous ones.
- The way the relationships are arranged is in collaboration with ChatGPT. For example how the membership status of a user is put into orders, in order to not repeat code
- The models logic was done with help from chatGPT
- Authentication files was inspired by schools lucture (linkedInLearning), and chatgpt
- https://github.com/validatorjs/validator.js/ was used for dealing with the validation used throughout the exam.
- Returning category and brand names with raw SQL query was understood with knowledge from chatGPT
- https://jwt.io/ was used for double checking if the admin token was containing the role correctly.
- I struggled getting the user name into the creation of token and login in combination with having the separate admin user implemented, so I got knowledge from chatGPT's logic to solve the issue by using the userWithRole logic seen in auth.js.
- The isDeleted for products was made with knowledge from chatGPT
- Mix of knowledge from school and chatGPT was used for addressing CORS middleware and setting Access-Control-Allow-Origin in back-end's app.js
- Expect.any was used in tests and the knowledge about it was from chatGPT.
- Knowledge from chatGPT was used to make the function getAllProducts work properly.


Front-End:

- Used https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch for fetch logic.
- chatGPT was used to gain knowledge about how to use JWT in the front-end
- Knowledge about how to get the admins token from the back-end when the admin logged in, and saving it into a session, was learned from chatGPT.
- For making the modal prompt for adding a product, knowledge from chatGPT was used.
- The logic for making the add product button was knowledge from chatGPT.
- How to get the tables in the front-end populated dynamically, was with knowledge from chatGPT.

---