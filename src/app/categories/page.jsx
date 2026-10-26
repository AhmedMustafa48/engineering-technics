import { permanentRedirect } from "next/navigation";

// Categories are browsed from the products page; keep /categories from 404ing.
export default function CategoriesIndex() {
  permanentRedirect("/products");
}
