# Chat Application

This is a chat application that allows two or more users to communicate in real-time. Users can register, log in, send messages, and share images. The application is built using TypeScript, Express, and MongoDB.

## Features

- User registration and login system
- Real-time messaging between users
- Ability to send and receive images
- User profile management
- Chat history retrieval

## Technologies Used

- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- Bcrypt for password hashing
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd chat-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up your MongoDB database and update the connection string in the application.

5. Start the application:
   ```
   npm start
   ```

## Usage

- Register a new user by sending a POST request to `/api/auth/register`.
- Log in by sending a POST request to `/api/auth/login`.
- Send messages using the `/api/chat/send` endpoint.
- Retrieve chat history with a GET request to `/api/chat/history`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.