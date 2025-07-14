import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
