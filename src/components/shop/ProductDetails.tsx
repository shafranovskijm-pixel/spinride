import type { Product } from "@/types/shop";

/** The product's core text is present on first render, without opening a tab. */
export function ProductDetails({ product }: { product: Product }) {
  const specifications = Object.entries(product.specifications || {});
  return (
    <section aria-label="Описание и характеристики товара" className="mt-12 grid gap-8 lg:grid-cols-2">
      {product.description?.trim() && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Описание</h2>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
      )}
      {specifications.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Характеристики</h2>
          <dl>
            {specifications.map(([name, value]) => (
              <div key={name} className="flex gap-4 py-3 border-b last:border-0">
                <dt className="w-1/2 text-muted-foreground">{name}</dt>
                <dd className="w-1/2 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
