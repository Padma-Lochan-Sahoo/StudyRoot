import axios from "./axiosInstance";

export const createSession = async (title: string, inviteEmails?: string[]) => {
  const res = await axios.post("/collab/create", { title, inviteEmails });
  return res.data;
};

export const joinSession = async (sessionCode: string) => {
  const res = await axios.post("/collab/join", { sessionCode });
  return res.data;
};

export const getUserSessions = async () => {
  const res = await axios.get("/collab/mine");
  return res.data;
};

export const deleteSession = async (id: string) => {
  const res = await axios.delete(`/collab/${id}`);
  return res.data;
};
