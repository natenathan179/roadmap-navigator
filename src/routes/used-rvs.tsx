import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { InventoryBrowser } from "@/components/site/InventoryBrowser";
import { PageHeader } from "@/components/site/PageHeader";
import { parseInventorySearch, type InventorySearch, type InventorySearchInput } from "@/lib/search";

export const Route = createFileRoute("/used-rvs")({
  validateSearch: (search: InventorySearchInput): InventorySearch => parseInventorySearch(search),
  head: () => ({
    meta: [
      { title: "Used RVs for Sale | Pre-Owned Travel Trailers & Motorhomes in Bend, Oregon" },
      {
        name: "description",
        content:
          "Inspected, reconditioned used RVs for sale in Bend, Oregon — travel trailers, fifth wheels, truck campers and motorhomes. Every used RV comes with a multi-point inspection report and service history.",
      },
      { property: "og:title", content: "Used RVs for Sale | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "Pre-owned Class A, B, C and Super C coaches with inspection reports and service history.",
      },
    ],
  }),
  component: UsedRvs,
});

function UsedRvs() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/used-rvs" });

  return (
    <>
      <PageHeader
        eyebrow="Used RVs"
        title="Pre-owned coaches, inspected and documented"
        description="Every used RV arrives with a multi-point inspection report, service history where available and fresh fluids."
      />
      <InventoryBrowser
        search={search}
        lockedCondition="used"
        onChange={(next) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })}
      />
    </>
  );
}
