import axios from "@/lib/axiosInstance";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, KeyRound } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isVerifyingOtp) {
        const { data } = await axios.post("/auth/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });
        console.log("✅ OTP verified:", data.message);
        alert("Account created successfully! Now you can log in.");
        setIsVerifyingOtp(false);
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "", otp: "" });
        return;
      }

      if (isLogin) {
        const { data } = await axios.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log("Login Success ✅", data);
        navigate("/dashboard");
      } else {
        const { data } = await axios.post("/auth/signup", {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        });
        console.log("Signup OTP sent 📧", data);
        setIsVerifyingOtp(true);
      }
    } catch (err) {
      console.error("Auth Error ❌", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-uninote-blue via-uninote-purple to-uninote-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold">UniNote</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-6">Study Smarter, <br />Not Harder</h1>
          <p className="text-xl text-center text-white/80 max-w-md">
            Access thousands of verified study materials from top universities.
          </p>
        </div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-uninote-light to-white">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
                UniNote
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isVerifyingOtp ? "Verify OTP" : isLogin ? "Welcome Back" : "Join UniNote"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isVerifyingOtp
                ? "Enter the OTP sent to your email"
                : isLogin
                ? "Sign in to access your study materials"
                : "Create your account to get started"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isVerifyingOtp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-12 bg-white/50 border-gray-200"
                      required
                    />
                  </div>
                </div>
              )}

              {!isVerifyingOtp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 bg-white/50 border-gray-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 h-12 bg-white/50 border-gray-200"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {isVerifyingOtp && (
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter the OTP"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="pl-10 h-12 bg-white/50 border-gray-200"
                      required
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <Link to="#" className="text-sm text-uninote-blue hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 bg-gradient-to-r from-uninote-blue to-uninote-purple text-white font-medium rounded-xl transition-all duration-300 ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-uninote-purple hover:to-uninote-blue hover:scale-[1.02]"
                }`}
              >
                {isLoading
                  ? isVerifyingOtp
                    ? "Verifying OTP..."
                    : isLogin
                    ? "Signing In..."
                    : "Creating Account..."
                  : isVerifyingOtp
                  ? "Verify OTP"
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>

            {!isVerifyingOtp && (
              <div className="text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-uninote-blue hover:underline font-medium"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
