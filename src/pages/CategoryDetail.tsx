import { useParams, Navigate } from "react-router-dom";

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/categories?cat=${slug || ""}`} replace />;
}
