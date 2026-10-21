import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { InventoryBrowser } from "@/components/site/InventoryBrowser";
import { PageHeader } from "@/components/site/PageHeader";
import { parseInventorySearch, type InventorySearch, type InventorySearchInput } from "@/lib/search";

export const Route = createFileRoute("/inventory/")({
  validateSearch: (search: InventorySearchInput): InventorySearch => parseInventorySearch(search),
  head: () => ({
    meta: [
      { title: "RV Inventory | Travel Trailers, Fifth Wheels & Motorhomes for Sale" },
      {
        name: "description",
        content:
          "Search our full RV inventory by type, manufacturer, year, price, weight, length and sleeping capacity — travel trailers, fifth wheels, truck campers and motorhomes for sale in Michigan.",
      },
      { property: "og:title", content: "RV Inventory | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "Filter every new and used RV on the lot by type, price, weight and floorplan.",
      },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/inventory/" });

  return (
    <>
      <PageHeader
        eyebrow="RV Inventory"
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
