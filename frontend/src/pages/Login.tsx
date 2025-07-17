import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, Key } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const {
    signup,
    verifyOtp,
    login,
    isSigningUp,
    isLoggingIn,
    isVerifyingOtp,
    otpStep,
    signupEmail,
    authUser,
  } = useAuthStore();

  useEffect(() => {
  if (authUser) {
    navigate("/dashboard");
  }
}, [authUser, navigate]);


  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [otp, setOtp] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpStep) {
      const success = await verifyOtp(signupEmail!, otp);
      if (success) {
        setOtp("");
        setFormData({ fullName: "", email: "", password: "" });
        navigate("/dashboard");
      }
      return;
    }

    if (isLogin) {
      const success = await login({
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        setFormData({ fullName: "", email: "", password: "" });
        navigate("/dashboard");
      }
    } else {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Motivation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-uninote-blue via-uninote-purple to-uninote-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold">UniNote</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-6">
            Study Smarter, <br /> Not Harder
          </h1>
          <p className="text-xl text-center text-white/80 max-w-md">
            Access thousands of verified study materials from top universities. Your academic success starts here.
          </p>
        </div>
      </div>

      {/* Right - Form */}
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
              {otpStep ? "Verify OTP" : isLogin ? "Welcome Back" : "Join UniNote"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {otpStep
                ? "Enter the OTP sent to your email"
                : isLogin
                ? "Sign in to access your study materials"
                : "Create your account to get started"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!otpStep && !isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12 bg-white/50 border-gray-200"
                    />
                  </div>
                </div>
              )}

              {!otpStep && (
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
                        required
                        className="pl-10 h-12 bg-white/50 border-gray-200"
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
                        required
                        className="pl-10 h-12 bg-white/50 border-gray-200"
                      />
                    </div>
                  </div>
                </>
              )}

              {otpStep && (
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="pl-10 h-12 bg-white/50 border-gray-200"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSigningUp || isLoggingIn || isVerifyingOtp}
                className={`w-full h-12 bg-gradient-to-r from-uninote-blue to-uninote-purple text-white font-medium rounded-xl transition-all duration-300 ${
                  isSigningUp || isLoggingIn || isVerifyingOtp
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-uninote-purple hover:to-uninote-blue hover:scale-[1.02]"
                }`}
              >
                {otpStep
                  ? isVerifyingOtp
                    ? "Verifying OTP..."
                    : "Verify OTP"
                  : isLogin
                  ? isLoggingIn
                    ? "Signing In..."
                    : "Sign In"
                  : isSigningUp
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </form>

            {!otpStep && (
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
