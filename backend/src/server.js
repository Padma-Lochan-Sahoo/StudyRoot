
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import { app } from "./app.js";
import connectCloudinary from "./lib/cloudinary.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import CollabNoteSession from "./models/CollabNoteSession.js";
import User from "./models/user.model.js";



dotenv.config();



const startServer = async () => {
  try {
    await connectDB();

    await connectCloudinary();
    console.log("✅ Cloudinary Connected");

    const port = process.env.PORT || 3000; // Fallback to 3000 if PORT is not set
    const httpServer = createServer(app);
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    // In-memory map: sessionId -> Map of userId -> userInfo
    const sessionUsers = {};

    io.on("connection", (socket) => {
      let currentSessionId = null;
      let currentUserId = null;

      // Join a session room
      socket.on("join-session", async ({ sessionId, userId }) => {
        socket.join(sessionId);
        currentSessionId = sessionId;
        currentUserId = userId;
        // Fetch user info
        const user = await User.findById(userId).select("_id fullName profilePic");
        if (!sessionUsers[sessionId]) sessionUsers[sessionId] = new Map();
        if (user) {
          sessionUsers[sessionId].set(userId, {
            id: user._id.toString(),
            fullName: user.fullName,
            profilePic: user.profilePic || "",
          });
        }
        // Emit current note content
        const session = await CollabNoteSession.findById(sessionId);
        if (session) {
          socket.emit("note-content", session.noteContent || "");
        }
        // Broadcast updated user list
        io.to(sessionId).emit("session-users", Array.from(sessionUsers[sessionId].values()));
      });

      // Handle note content changes
      socket.on("note-update", async ({ sessionId, content }) => {
        io.to(sessionId).emit("note-content", content);
        await CollabNoteSession.findByIdAndUpdate(sessionId, { noteContent: content });
      });

      // Handle cursor/selection updates
      socket.on("cursor-update", ({ sessionId, userId, selection }) => {
        // Broadcast to others in the room
        socket.to(sessionId).emit("remote-cursor", { userId, selection });
      });

      // Handle chat messages
      socket.on("chat-message", (msg) => {
        console.log("[SOCKET] chat-message received:", msg);
        if (msg && msg.sessionId) {
          io.to(msg.sessionId).emit("chat-message", msg);
        }
      });

      // Handle user typing indicator
      socket.on("user-typing", ({ sessionId, userId, fullName }) => {
        // Broadcast to others in the session
        socket.to(sessionId).emit("user-typing", { userId, fullName });
      });

      // On disconnect, remove user from session
      socket.on("disconnect", () => {
        if (currentSessionId && currentUserId && sessionUsers[currentSessionId]) {
          sessionUsers[currentSessionId].delete(currentUserId);
          io.to(currentSessionId).emit("session-users", Array.from(sessionUsers[currentSessionId].values()));
        }
      });
    });

    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit process on failure
  }
};

// Start the server
startServer();

// Export for Vercel
export default app;