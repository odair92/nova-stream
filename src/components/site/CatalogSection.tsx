import { Star } from "lucide-react";

import type { CatalogCategory } from "@/lib/types";

export function CatalogSection({ categories }: { categories: CatalogCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Catálogo</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">Um acervo para toda a família</h2>
        <p className="mt-3 text-muted-foreground">
          Filmes, séries, esportes, infantil e documentários com conteúdo licenciado e atualizado.
        </p>
      </header>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h3 className="text-xl sm:text-2xl">{category.name}</h3>
              {category.description ? (
                <p className="hidden text-sm text-muted-foreground sm:block">{category.description}</p>
              ) : null}
            </div>
            <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
              {category.items.map((item) => (
                <article
                  key={item.id}
                  className="group w-[45%] shrink-0 snap-start sm:w-[220px]"
                >
                  <div className="relative overflow-hidden rounded-lg border border-border bg-card">
                    <img
                      src={item.poster_url ?? ""}
                      alt={item.title}
                      width={512}
                      height={768}
                      loading="lazy"
                      className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.featured ? (
                      <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                        Destaque
                      </span>
                    ) : null}
                  </div>
                  <h4 className="mt-3 truncate text-sm font-semibold">{item.title}</h4>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {item.year ? <span>{item.year}</span> : null}
                    {item.rating ? (
                      <span className="rounded border border-border px-1">{item.rating}</span>
                    ) : null}
                    {item.tags?.[0] ? (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-primary" />
                        {item.tags[0]}
                      </span>
                    ) : null}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
