import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { InventoryBrowser } from "@/components/site/InventoryBrowser";
import { PageHeader } from "@/components/site/PageHeader";
import { parseInventorySearch, type InventorySearch } from "@/lib/search";

export const Route = createFileRoute("/inventory/")({
  validateSearch: (search: Record<string, unknown>): InventorySearch => parseInventorySearch(search),
  head: () => ({
    meta: [
      { title: "RV Inventory | Motorhomes for Sale in Bend, Oregon" },
      {
        name: "description",
        content:
          "Search our full motorhome inventory by class, manufacturer, year, price, mileage, length and sleeping capacity. Class A, B, C and Super C RVs for sale.",
      },
      { property: "og:title", content: "RV Inventory | Summit Ridge RV" },
      {
        property: "og:description",
        content: "Filter every new and used motorhome on the lot by class, price, mileage and floorplan.",
      },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/inventory" });

  return (
    <>
      <PageHeader
        eyebrow="Motorhome Inventory"
        title="Every coach on the lot, in one place"
        description="Filter by class, manufacturer, price, mileage, length and floorplan. New inventory arrives weekly."
      />
      <InventoryBrowser
        search={search}
        onChange={(next) =>
          navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })
        }
      />
    </>
  );
}
