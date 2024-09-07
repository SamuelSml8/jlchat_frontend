# JL Chat Frontend

## Description

The JL Chat Frontend is a web application designed for real-time messaging, both individually and in groups. Built with React and Tailwind CSS, this application provides an intuitive interface for users to manage their chats, create groups, and add friends. It integrates with the JL Chat API for backend functionality, including user authentication and real-time messaging via WebSockets.

## Technologies Used

- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Declarative routing for React applications
- **Axios**: Promise-based HTTP client for making API requests
- **Socket.IO**: Real-time communication library for WebSocket support
- **React Toastify**: For displaying notifications

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

Clone the repository using either HTTPS or SSH:

**HTTP option**
```bash
$ git clone https://github.com/SamuelSml8/jlchat_frontend.git
```

**SSH option**
```bash
$ git clone git@github.com:SamuelSml8/jlchat_frontend.git
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
$ cd jlchat_frontend
$ npm install
```

### 4. Running the app
Run the application using the following command:
```bash
# watch mode
$ npm start

# development
$ npm run dev
```

- The application will start and be accessible at http://localhost:5173/login

## Features

- **Login and Registration**: Secure user authentication.
- **Real-Time Messaging**: Send and receive messages instantly using WebSockets.
- **Chat Management**: Create and manage group chats.
- **Friend Management**: Add friends and view friend list.

## Stay in touch

- Author - [Samuel Vera Miranda](www.linkedin.com/in/samuelsml)

## License

Nest is [MIT licensed](LICENSE).