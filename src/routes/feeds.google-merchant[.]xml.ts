import { createFileRoute } from "@tanstack/react-router";

import { absoluteUrl, DEALER } from "@/lib/dealership";
import { fetchRvs, rvTitle, type Rv } from "@/lib/inventory";

// Google Merchant Center product feed (RSS 2.0 + g: namespace), fetched on a schedule by Merchant Center.
// RVs aren't allowed in regular Shopping ads, so this is built for the Vehicle ads data source: the
// standard product attributes plus vin / model / year / mileage and, once a store code is set,
// vehicle_fulfillment. Every value matches what the unit's landing page shows.

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 5000;
const MAX_EXTRA_IMAGES = 10;

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    // Strip control characters that make the whole feed fail XML parsing.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

/** Only units Google can list: available, priced, photographed. Sold or incomplete units are left out. */
const isListable = (rv: Rv) => rv.status === "available" && rv.price > 0 && rv.photos.length > 0 && !!rv.slug;

function item(rv: Rv): string {
  const condition = rv.condition === "new" ? "new" : "used";
  const title = clip(`${condition === "new" ? "New" : "Used"} ${rvTitle(rv)} ${rv.rv_type ?? rv.rv_class}`, MAX_TITLE);
  const description = clip(
    (rv.description ?? title).replace(/\s+/g, " ").trim(),
    MAX_DESCRIPTION,
  );
  const [image, ...extraImages] = rv.photos.map(absoluteUrl);

  const fields: [string, string | number | null | undefined][] = [
    ["g:id", rv.stock_number],
    ["g:title", title],
    ["g:description", description],
    ["g:link", absoluteUrl(`/inventory/${rv.slug}`)],
    ["g:image_link", image],
    ...extraImages.slice(0, MAX_EXTRA_IMAGES).map((url): [string, string] => ["g:additional_image_link", url]),
    // The site shows whole-dollar prices, so the feed does too — a mismatch disapproves the item.
    ["g:price", `${Math.round(rv.price)}.00 USD`],
    ["g:availability", "in_stock"],
    ["g:condition", condition],
    ["g:brand", rv.make],
    ["g:product_type", `Recreational Vehicles > ${rv.rv_class}`],
    // RVs have no GTIN/MPN; the VIN is the identifier.
    ["g:identifier_exists", "no"],
    ["g:vin", rv.vin],
    ["g:model", rv.model],
    ["g:year", rv.year],
    ["g:mileage", `${rv.mileage} miles`],
    ["g:color", rv.ext_color],
    ["g:engine", rv.engine],
  ];

  const lines = fields
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([tag, value]) => `      <${tag}>${escapeXml(String(value))}</${tag}>`);

  if (DEALER.googleStoreCode) {
    lines.push(
      `      <g:store_code>${escapeXml(DEALER.googleStoreCode)}</g:store_code>`,
      `      <g:vehicle_fulfillment><g:option>in_store</g:option><g:store_code>${escapeXml(DEALER.googleStoreCode)}</g:store_code></g:vehicle_fulfillment>`,
    );
  }

  return `    <item>\n${lines.join("\n")}\n    </item>`;
}

export const Route = createFileRoute("/feeds/google-merchant.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Unlike the sitemap, fail loudly: an empty 200 feed would make Merchant Center expire every item.
        let rvs: Rv[];
        try {
          rvs = await fetchRvs();
        } catch {
          return new Response("Inventory temporarily unavailable", {
            status: 503,
            headers: { "Retry-After": "600" },
          });
        }

        const items = rvs.filter(isListable).map(item).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(DEALER.name)} — RV Inventory</title>
    <link>${escapeXml(DEALER.siteUrl)}</link>
    <description>${escapeXml(`New and used RVs for sale at ${DEALER.name}, ${DEALER.stateName}`)}</description>
${items}
  </channel>
</rss>
`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=900",
          },
        });
      },
    },
  },
});
