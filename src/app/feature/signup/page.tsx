import { SignupForm } from "@/Components/auth/SignupForm";

const SignupPage = () => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-orange-100/50">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage;
