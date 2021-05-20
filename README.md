<h1 align="center" style="border-bottom: none;">Prague Tour Guide Chatbot</h1>
<h2 align="center"> Web application with Watson Assistant chatbot </h2>
<p> Backend - Node.js with <a href="https://cloud.ibm.com/apidocs/assistant-v2#introduction">Watson Assistant V2 API</a>. The basis for the backend is taken from <a href="the basis for the backend is taken from">Watson Assistant Sample Application</a></p>
<p> Frontend - React.js. </p>

<h2> Run locally </h2>
  
  <p>For database you need create an account in <a href="https://www.mongodb.com/cloud/atlas">MongoDb Atlas</a> and create database to take a connection string (MONGODB_URI).</p>
  <p>For chatbot you need create an account in <a href="https://cloud.ibm.com/registration">IBM Cloud</a> and create Watson Assistant service to take all creadentials (ASSISTANT_ID,ASSISTANT_IAM_APIKEY, ASSISTANT_URL, ASSISTANT_IAM_NAME).</p>
  
    
   1. In the project directory install dependencies for backend using "npm install".
   2. In the client folder install dependencies for frontend using "npm install".
   3. In the project directory run "npm run dev".


Frontend is running on http://localhost:3000/. Backend is running on http://localhost:5000/
