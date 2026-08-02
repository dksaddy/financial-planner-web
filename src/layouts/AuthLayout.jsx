import Card from "@/components/common/Card";

export default function AuthLayout({
  title,
  children,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-md">
        <Card title={title}>
          {children}
        </Card>
      </div>
    </main>
  );
}