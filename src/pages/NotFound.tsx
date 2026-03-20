import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
      <Link to="/" className="mt-6 text-sm font-medium text-primary underline hover:text-primary/80">
        Back to Home
      </Link>
    </div>
  );
}
