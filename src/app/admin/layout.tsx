import { AdminProviders } from "./providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <div className="min-h-svh bg-background text-text-primary">{children}</div>
    </AdminProviders>
  );
}
