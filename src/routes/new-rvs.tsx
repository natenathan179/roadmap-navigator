import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { InventoryBrowser } from "@/components/site/InventoryBrowser";
import { PageHeader } from "@/components/site/PageHeader";
import { parseInventorySearch, type InventorySearch, type InventorySearchInput } from "@/lib/search";

export const Route = createFileRoute("/new-rvs")({
  validateSearch: (search: InventorySearchInput): InventorySearch => parseInventorySearch(search),
  head: () => ({
    meta: [
      { title: "New Motorhomes for Sale | Summit Ridge RV, Bend Oregon" },
      {
        name: "description",
        content:
          "Shop brand-new Class A, Class B, Class C and Super C motorhomes with full factory warranty at Summit Ridge RV in Bend, Oregon.",
      },
      { property: "og:title", content: "New Motorhomes for Sale | Summit Ridge RV" },
      {
        property: "og:description",
        content: "Brand-new coaches with full factory warranty, PDI completed before delivery.",
      },
    ],
  }),
  component: NewRvs,
});

function NewRvs() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/new-rvs" });

  return (
    <>
      <PageHeader
        eyebrow="New RVs"
        title="Brand-new motorhomes with full factory warranty"
        description="Every new coach gets a complete pre-delivery inspection and a walkthrough orientation before you drive off the lot."
      />
      <InventoryBrowser
        search={search}
        lockedCondition="new"
        onChange={(next) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })}
      />
    </>
  );
}
