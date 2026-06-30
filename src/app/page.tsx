import { cn } from "@/lib/utils";
import LoginForm from "@/view/auth/login-form";
import Image from "next/image";

export default function Home() {
  return (
    <div className={cn("flex flex-col  items-center justify-center min-h-screen")}>
      <LoginForm />
    </div>
  );
}
