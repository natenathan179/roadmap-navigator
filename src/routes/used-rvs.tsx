import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { InventoryBrowser } from "@/components/site/InventoryBrowser";
import { PageHeader } from "@/components/site/PageHeader";
import { parseInventorySearch, type InventorySearch } from "@/lib/search";

export const Route = createFileRoute("/used-rvs")({
  validateSearch: (search: Record<string, unknown>): InventorySearch => parseInventorySearch(search),
  head: () => ({
    meta: [
      { title: "Used Motorhomes for Sale | Pre-Owned RVs in Bend, Oregon" },
      {
        name: "description",
        content:
          "Inspected, reconditioned pre-owned motorhomes for sale in Bend, Oregon. Every used RV comes with a multi-point inspection report and service history.",
      },
      { property: "og:title", content: "Used Motorhomes for Sale | Summit Ridge RV" },
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
        description="Every used motorhome arrives with a multi-point inspection report, service history where available and fresh fluids."
      />
      <InventoryBrowser
        search={search}
        lockedCondition="used"
        onChange={(next) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })}
      />
    </>
  );
}
