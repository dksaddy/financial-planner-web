import Card from "@/components/common/Card";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthLayout({
  title,
  children,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <div className="reveal w-full max-w-md">
        <Card title={title}>
          {children}
        </Card>
      </div>
    </main>
  );
}
