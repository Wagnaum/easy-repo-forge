import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

export function LoginLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    // flex min-h-screen flex-1 flex-col justify-center items-center p-3 sm:p-6 lg:p-8 bg-white
    <div className="">
      <Outlet />
    </div>
  );
}