# Web Chat
Chat is a web application that allows users to communicate with one another. It features instant text messaging, group chats and many more. 

## Technologies Used
- React.js
- Nest.js
- Material UI
- Web Sockets 
- TypeScript

## Getting Started
To get started with this project, you need to follow these steps:

1. Install dependencies for both client and server:
```bash
cd server

npm install

cd ../client

npm install
```
2. Set up the environment:\
Set up the database, and mark its URL in the .env file in the server as DATABASE_URL. Also for server .env you should include Cloudinary's cloud name (as CLOUD_NAME), API key (as API_KEY), API key secret (as API_KEY_SECRET) and client URL (as CLIENT_URL)\
For the clients .env file you should include the URL of your servers for the web socket (VITE_SOCKET_URL) and another URL for HTTP requests (VITE_API_URL)
3. Run the development server:
```bash

npm run all

```
3. Open http://localhost:3000 with your browser to see the result.

## Features
- User-friendly interface
- Instant messaging
- Voice messages
- Group chats
- User accounts

## Preview 
![image](https://github.com/Stasnislau/Chat/assets/56834401/b7f090c8-8685-4014-abc3-b477a5a6f529)

