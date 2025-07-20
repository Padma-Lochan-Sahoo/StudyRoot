import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getUserSessions } from "@/lib/collabNotesApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCallback } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
// Register the cursors module
Quill.register("modules/cursors", QuillCursors);
import { useToast } from "@/hooks/use-toast";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const CollaborativeNoteEditor = () => {
  const { sessionId } = useParams();
  const { authUser } = useAuthStore();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<{id: string, fullName: string, profilePic: string}[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeout = useRef<any>(null);
  const [remoteCursors, setRemoteCursors] = useState<Record<string, any>>({});
  const quillRef = useRef<any>(null);
  const { toast } = useToast ? useToast() : { toast: (args) => alert(args.title || args.description) };

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ userId: string, fullName: string, profilePic: string, message: string, timestamp: number }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ userId: string, fullName: string }[]>([]);
  const typingTimeouts = useRef<{ [userId: string]: NodeJS.Timeout }>({});

  // ReactQuill modules config
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
    cursors: true,
  };

  useEffect(() => {
    // For now, fetch all sessions and find the one with sessionId
    const fetchSession = async () => {
      setLoading(true);
      try {
        const res = await getUserSessions();
        const found = res.sessions.find((s: any) => s._id === sessionId);
        setSession(found || null);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !authUser?._id) return;
    // Connect to Socket.IO
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;
    socket.emit("join-session", { sessionId, userId: authUser._id });
    socket.on("note-content", (newContent: string) => {
      setContent(newContent);
      setIsSyncing(false);
    });
    socket.on("session-users", (users: any[]) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.disconnect();
    };
  }, [sessionId, authUser?._id]);

  const handleQuillChange = (value: string) => {
    setContent(value);
    setIsSyncing(true);
    if (socketRef.current) {
      socketRef.current.emit("note-update", { sessionId, content: value });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsSyncing(false), 800);
  };

  // Listen for chat messages
  useEffect(() => {
    if (!socketRef.current) return;
    const handler = (msg: any) => {
      setChatMessages(prev => [...prev, msg]);
    };
    socketRef.current.on("chat-message", handler);
    return () => {
      socketRef.current?.off("chat-message", handler);
    };
  }, []);

  // Listen for typing indicators
  useEffect(() => {
    if (!socketRef.current) return;
    const handler = (data: { userId: string, fullName: string }) => {
      setTypingUsers(prev => {
        // Remove if already present
        const filtered = prev.filter(u => u.userId !== data.userId);
        return [...filtered, data];
      });
      // Remove after 2.5s
      if (typingTimeouts.current[data.userId]) clearTimeout(typingTimeouts.current[data.userId]);
      typingTimeouts.current[data.userId] = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }, 2500);
    };
    socketRef.current.on("user-typing", handler);
    return () => {
      socketRef.current?.off("user-typing", handler);
    };
  }, []);

  // Emit typing event when user types in chat
  const handleChatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    if (socketRef.current && authUser?._id && sessionId) {
      socketRef.current.emit("user-typing", { sessionId, userId: authUser._id, fullName: authUser.fullName, source: "chat" });
    }
  };

  // Emit typing event when user types in the note editor
  const handleEditorTyping = () => {
    if (socketRef.current && authUser?._id && sessionId) {
      socketRef.current.emit("user-typing", { sessionId, userId: authUser._id, fullName: authUser.fullName, source: "editor" });
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Send chat message
  const sendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !authUser?._id || !sessionId) return;
    const msg = {
      userId: authUser._id,
      fullName: authUser.fullName,
      profilePic: authUser.profilePic,
      message: chatInput,
      timestamp: Date.now(),
      sessionId,
    };
    console.log('[SOCKET] sending chat-message:', msg);
    socketRef.current?.emit("chat-message", msg);
    setChatInput("");
  };

  // Assign a color to each user based on their ID
  const getUserColor = (userId: string) => {
    const colors = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac", "#f06292", "#7986cb"];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Emit selection changes (fixed signature)
  const handleSelectionChange = useCallback((range: any, source: string, _editor: any) => {
    if (source === "user" && socketRef.current && authUser?._id && sessionId) {
      socketRef.current.emit("cursor-update", {
        sessionId,
        userId: authUser._id,
        selection: range,
      });
    }
  }, [authUser?._id, sessionId]);

  // Listen for remote cursor updates
  useEffect(() => {
    if (!socketRef.current) return;
    const handler = ({ userId, selection }: { userId: string, selection: any }) => {
      setRemoteCursors(prev => ({ ...prev, [userId]: selection }));
    };
    socketRef.current.on("remote-cursor", handler);
    return () => {
      socketRef.current?.off("remote-cursor", handler);
    };
  }, []);

  // Render remote cursors/highlights
  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;
    // Remove old cursors
    quill.getModule("cursors")?.clearCursors?.();
    // For each remote user, render their cursor/selection
    Object.entries(remoteCursors).forEach(([userId, selection]) => {
      if (!selection || userId === authUser?._id) return;
      const color = getUserColor(userId);
      // Use Quill-cursors module if available, else fallback to native highlight
      if (quill.getModule("cursors")) {
        quill.getModule("cursors").setCursor(userId, selection, userId, color);
      } else if (selection && selection.index != null) {
        // Fallback: highlight selection with background color
        quill.formatText(selection.index, selection.length || 0, { background: color });
      }
    });
  }, [remoteCursors, authUser?._id]);

  // Add Quill-cursors module if not present
  useEffect(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor?.();
   
    const QuillGlobal = (window as any).Quill;
    if (
      quill &&
      !quill.getModule("cursors") &&
      QuillGlobal &&
      QuillGlobal.imports &&
      QuillGlobal.imports["modules/cursors"]
    ) {
      quill.getModule("cursors");
    }
  }, [quillRef]);

  const handleSaveNote = () => {
    if (socketRef.current && sessionId) {
      socketRef.current.emit("note-update", { sessionId, content });
      if (toast) toast({ title: "Note saved!", description: "Your note has been saved." });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading session...</div>;
  if (!session) return <div className="p-8 text-center text-red-500">Session not found or you do not have access.</div>;

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#11998e] via-[#38ef7d] to-[#0575e6] flex flex-row items-stretch justify-center overflow-hidden">
      {/* Main content and chat side by side, full height */}
      <div className="w-full h-full flex flex-row items-stretch justify-center gap-4">
        {/* Note Editor Section - take 3/4 of width */}
        <div className="flex-[3_3_0%] flex flex-col bg-white/20 backdrop-blur-lg border-l border-t border-b border-white/30 p-0 overflow-hidden min-w-0 h-full m-3 mb-3 rounded-3xl shadow-2xl">
          <div className="px-10 pt-8 pb-4 border-b border-white/20 bg-gradient-to-r from-[#11998e]/80 via-[#38ef7d]/60 to-[#0575e6]/50 flex items-center justify-between rounded-t-3xl">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-sm text-white hover:text-[#11998e] transition-colors bg-white/20 px-3 py-1.5 rounded-lg shadow-md backdrop-blur-md border border-white/30"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              Back to Dashboard
            </button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 flex-1 ml-6">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#38ef7d"/><path d="M8 12h8M12 8v8" stroke="#0575e6" strokeWidth="2" strokeLinecap="round"/></svg>
                  {session.title}
                </h2>
                <div className="text-xs text-white flex items-center gap-2">
                  <span>Session Code:</span>
                  <span className="font-mono bg-[#11998e]/80 px-2 py-1 rounded-lg border border-white/30 text-white">{session.sessionCode}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-xs text-white font-semibold flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Online: {onlineUsers.length}
              </span>
              <button className="bg-[#11998e]/90 hover:bg-[#38ef7d] text-white px-4 py-2 rounded-xl shadow transition-all font-semibold text-sm">Share</button>
              <button className="bg-[#0575e6]/90 hover:bg-[#38ef7d] text-white px-4 py-2 rounded-xl shadow transition-all font-semibold text-sm" onClick={handleSaveNote}>Save</button>
            </div>
          </div>
          <div className="flex-1 flex flex-col px-10 py-6 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs text-white font-medium tracking-wide">Real-time collaborative editor</span>
              {/* Typing indicator for note editor */}
              {typingUsers.length > 0 && (
                <span className="text-xs text-[#11998e] animate-pulse ml-4">
                  {typingUsers.map(u => (
                    <span key={u.userId}>{u.fullName} is typing...</span>
                  ))}
                </span>
              )}
              {isSyncing && <span className="text-xs text-[#0575e6] animate-pulse font-semibold">Syncing...</span>}
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-white/10 backdrop-blur-md flex-1 min-h-[320px]">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={handleQuillChange}
                className="bg-transparent text-black min-h-[320px] font-medium quill-dark h-full"
                placeholder="Start typing your collaborative note..."
                ref={quillRef}
                onChangeSelection={handleSelectionChange}
                modules={quillModules}
                onKeyDown={handleEditorTyping}
              />
            </div>
            <div className="mt-6">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-xs text-white font-semibold">Online users:</span>
                {onlineUsers.length === 0 ? (
                  <span className="text-xs text-gray-100">None</span>
                ) : (
                  onlineUsers.map(user => (
                    <span key={user.id} className="inline-flex items-center gap-2 bg-[#11998e]/40 border border-white/30 text-white rounded-full px-3 py-1 shadow-sm backdrop-blur-md transition-all hover:scale-105">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt={user.fullName} className="w-6 h-6 rounded-full object-cover border-2 border-[#38ef7d] shadow" />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-[#38ef7d] flex items-center justify-center text-xs font-bold text-[#0575e6] border-2 border-white">{user.fullName[0]}</span>
                      )}
                      <span className="font-medium text-sm">{user.fullName}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Chat Panel - take 1/4 of width */}
        <div className="flex-[1_1_0%] max-w-[400px] min-w-[260px] flex flex-col bg-white/20 backdrop-blur-lg border-r border-t border-b border-white/30 p-0 overflow-hidden h-full m-3 mb-3 rounded-3xl shadow-2xl w-full sm:w-auto">
          <div className="px-4 pt-4 pb-2 border-b border-white/20 bg-gradient-to-r from-[#11998e]/80 via-[#38ef7d]/60 to-[#0575e6]/50 rounded-t-3xl">
            <h3 className="text-lg font-bold text-[#0575e6] tracking-tight mb-1 flex items-center gap-2">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="4" fill="#38ef7d"/><path d="M7 9h10M7 13h6" stroke="#0575e6" strokeWidth="2" strokeLinecap="round"/></svg>
              Collaboration Chat
            </h3>
            <span className="text-xs text-[#11998e]">Chat with collaborators</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 px-2 py-2 overflow-y-auto rounded-b-none shadow-inner">
            {chatMessages.length === 0 && (
              <div className="text-xs text-gray-400 text-center mt-8">No messages yet. Start the conversation!</div>
            )}
            {chatMessages.map((msg, idx) => {
              const isMe = msg.userId === authUser?._id;
              return (
                <div key={idx} className={`flex items-end gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}> 
                  {!isMe && (msg.profilePic ? (
                    <img src={msg.profilePic} alt={msg.fullName} className="w-7 h-7 rounded-full object-cover border-2 border-[#38ef7d] shadow" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-[#38ef7d] flex items-center justify-center text-xs font-bold text-[#0575e6] border-2 border-white">{msg.fullName[0]}</span>
                  ))}
                  <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`text-xs mb-0.5 ${isMe ? 'text-[#11998e]' : 'text-[#0575e6]'}`}>{isMe ? 'You' : msg.fullName}</div>
                    <div className={`rounded-2xl px-4 py-2 shadow-sm break-words text-sm ${isMe ? 'bg-[#38ef7d] text-[#0575e6]' : 'bg-[#f1f5f9] text-gray-900'} `}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendChatMessage} className="flex items-center gap-2 px-2 py-3 border-t border-white/20 bg-white/20 rounded-b-3xl shadow-md sticky bottom-0">
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="absolute left-4 bottom-16 text-xs text-[#11998e] animate-pulse z-10">
                {typingUsers.map(u => (
                  <span key={u.userId}>{u.fullName} is typing...</span>
                ))}
              </div>
            )}
            <input
              type="text"
              className="flex-1 rounded-full px-4 py-2 bg-[#f1f5f9] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11998e]"
              placeholder="Type a message..."
              value={chatInput}
              onChange={handleChatInput}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendChatMessage(e); }}
              maxLength={500}
            />
            <button type="submit" className="bg-[#11998e] hover:bg-[#0575e6] text-white rounded-full px-4 py-2 font-bold shadow transition-all">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeNoteEditor; 