import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = io("http://localhost:3000");
  }

  joinChat(chatId) {
    this.socket.emit("joinChat", chatId);
  }

  sendMessage(chatId, message, sender) {
    this.socket.emit("sendMessage", { chatId, message, sender });
  }

  onMessage(callback) {
    this.socket.on("receiveMessage", callback);
  }

  onUserJoined(callback) {
    this.socket.on("userJoined", callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();
export default socketService;
