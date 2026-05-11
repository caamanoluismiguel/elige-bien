import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/leads");
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
          Admin
        </h1>
        <p className="font-[family-name:var(--font-inter)] text-[#A0A0A0] text-sm mb-8">
          Panel interno de Elige Bien.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
