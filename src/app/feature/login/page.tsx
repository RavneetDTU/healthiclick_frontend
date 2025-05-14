import { LoginForm } from "@/Components/auth/LoginForm";

const LoginPage = () => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-orange-100/50">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage;
