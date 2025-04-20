import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "../../../components/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="shadow-lg shadow-black/80">
        <SignUp />
      </div>
    </AuthLayout>
  );
}
