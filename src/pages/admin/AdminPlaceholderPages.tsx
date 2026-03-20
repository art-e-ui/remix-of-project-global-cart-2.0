import { Shield, FileText, Activity, FileCode, Lock } from "lucide-react";

function PlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary mb-6">
        <Icon className="h-9 w-9" />
      </div>
      <h1 className="text-2xl font-black text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">{description}</p>
      <div className="mt-6 rounded-2xl bg-muted px-6 py-3 text-sm text-muted-foreground">
        This feature is under development
      </div>
    </div>
  );
}

export function ContentPage() {
  return <PlaceholderPage title="Content Management" description="Create and manage your store's content, pages, and blog posts." icon={FileText} />;
}

export function RolesPage() {
  return <PlaceholderPage title="Roles & Permissions" description="Configure granular access control for admin users and define custom permission sets." icon={Shield} />;
}

export function SecurityPage() {
  return <PlaceholderPage title="Security Center" description="Monitor security events, manage 2FA policies, and review access patterns." icon={Lock} />;
}


export function SystemDashboardPage() {
  return <PlaceholderPage title="System Dashboard" description="Real-time system health monitoring with resource usage metrics and performance insights." icon={Activity} />;
}

export function SystemLogsPage() {
  return <PlaceholderPage title="System Logs" description="Browse and search application logs, error reports, and system events." icon={FileCode} />;
}