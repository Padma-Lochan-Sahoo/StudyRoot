import { create } from "zustand";
import axios from "@/lib/axiosInstance";
import toast from "react-hot-toast";

// Define user type based on your API response structure
interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isVerifyingOtp: boolean;
  otpStep: boolean;
  signupEmail?: string;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<boolean>;
}


export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isVerifyingOtp: false,
  otpStep: false,

  checkAuth: async () => {
    try {
      const res = await axios.get<AuthUser>("/auth/check");

      set({ authUser: res.data });
      console.log("Auth user inside checkAuth:", res.data.role);
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true });
    try {
      await axios.post("/auth/signup", data);
      toast.success("OTP sent to your email");
      set({ otpStep: true, signupEmail: data.email });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axios.post<AuthUser>("/auth/verify-otp", { email, otp });
      set({ authUser: res.data, otpStep: false });
      toast.success("Signup successful!");
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
      return false;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      await axios.post("/auth/login", data);
      const userRes = await axios.get<AuthUser>("/auth/check");
      set({ authUser: userRes.data });
      toast.success("Logged in successfully");
      console.log("userRes:", userRes);
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Logout failed");
      return false;
    }
  },
}));