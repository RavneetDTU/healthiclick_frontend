import { SignupForm } from "@/Components/auth/SignupForm";

const SignupPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
