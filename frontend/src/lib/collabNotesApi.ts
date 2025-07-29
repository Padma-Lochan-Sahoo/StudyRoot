import axios from "./axiosInstance";

export const createSession = async (title: string) => {
  const res = await axios.post("/collab/sessions", { title });
  return res.data;
};

export const joinSession = async (sessionCode: string) => {
  // Since backend does not have join by code, we fetch all sessions and find by code
  const res = await axios.get("/collab/sessions");
  const session = res.data.sessions.find((s: any) => s.sessionCode === sessionCode);
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
};

export const getUserSessions = async () => {
  const res = await axios.get("/collab/sessions");
  return res.data;
};

export const deleteSession = async (id: string) => {
  const res = await axios.delete(`/collab/sessions/${id}`);
  return res.data;
};
