import "server-only";

export const ITEM_ROW = "id, name, image, sort_order, product_id, item_suppliers(sort_order, image, brands(name))";

// Categories are rows in `products`; their position picks the accent colour used in the admin lists.
export async function listCategories(supabase) {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, published, image, items(count)")
    .order("sort_order")
    .order("name");
  return {
    error,
    categories: (data ?? []).map((c, index) => ({ ...c, index, itemCount: c.items?.[0]?.count ?? 0 })),
  };
}

export function toListItem(row, categories) {
  const offers = [...(row.item_suppliers ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return {
    id: row.id,
    name: row.name,
    image: row.image ?? offers.find((o) => o.image)?.image ?? null,
    category: categories.find((c) => c.id === row.product_id) ?? { id: row.product_id, name: "—", index: 0 },
    suppliers: offers.map((o) => o.brands?.name).filter(Boolean),
  };
}
