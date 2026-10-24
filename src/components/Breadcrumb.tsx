import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

// Trail of links ending in the current page (the last item, not clickable).
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 body-text-sm text-ink-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-ink font-semibold">
                  {item.label}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="hover:text-accent hover:underline underline-offset-2 cursor-pointer"
                  >
                    {item.label}
                  </button>
                  <ChevronRight size={14} aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
