import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "../../../components/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="shadow-lg shadow-black/80">
        <SignIn />
      </div>
    </AuthLayout>
  );
}
