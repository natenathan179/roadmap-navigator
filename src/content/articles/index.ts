import type { Article } from "@/lib/articles";

import { cheapUsedRvsForSale } from "./cheap-used-rvs-for-sale";
import { classAMotorhomesBuyersGuide } from "./class-a-motorhomes-buyers-guide";
import { classBVsClassCMotorhomes } from "./class-b-vs-class-c-motorhomes";
import { classCMotorhomeBuyersGuide } from "./class-c-motorhome-buyers-guide";
import { classCRvFinancing } from "./class-c-rv-financing";
import { forestRiverCherokeeTravelTrailers } from "./forest-river-cherokee-travel-trailers";
import { forestRiverForesterClassC } from "./forest-river-forester-class-c";
import { forestRiverImpressionFifthWheel } from "./forest-river-impression-fifth-wheel";
import { forestRiverRockwoodTravelTrailers } from "./forest-river-rockwood-travel-trailers";
import { forestRiverSandpiper3800rk } from "./forest-river-sandpiper-3800rk";
import { forestRiverVibeFloorPlans } from "./forest-river-vibe-floor-plans";
import { forestRiverVibeTravelTrailerReview } from "./forest-river-vibe-travel-trailer-review";
import { forestRiverWildwood28view } from "./forest-river-wildwood-28view";
import { forestRiverWildwoodTravelTrailer } from "./forest-river-wildwood-travel-trailer";
import { hideout175bhVsJayFlightSlx175bh } from "./hideout-175bh-vs-jay-flight-slx-175bh";
import { keystoneHideout175bhByYear } from "./keystone-hideout-175bh-by-year";
import { keystoneHideout175bh } from "./keystone-hideout-175bh";
import { keystoneHideout2024Vs2025Vs2026 } from "./keystone-hideout-2024-vs-2025-vs-2026";
import { keystoneHideoutBunkhouse } from "./keystone-hideout-bunkhouse";
import { keystoneHideoutForSale } from "./keystone-hideout-for-sale";
import { keystoneHideoutInterior } from "./keystone-hideout-interior";
import { keystoneHideoutSport } from "./keystone-hideout-sport";
import { keystoneHideoutTravelTrailer } from "./keystone-hideout-travel-trailer";
import { mostReliableClassCMotorhomes } from "./most-reliable-class-c-motorhomes";
import { motorhomesForSaleByOwner } from "./motorhomes-for-sale-by-owner";
import { newmarDutchStarBuyersGuide } from "./newmar-dutch-star-buyers-guide";
import { newmarDutchStarFloorPlans } from "./newmar-dutch-star-floor-plans";
import { newmarDutchStarPrice } from "./newmar-dutch-star-price";
import { rockwoodFifthWheels } from "./rockwood-fifth-wheels";
import { rockwoodMiniLiteTravelTrailer } from "./rockwood-mini-lite-travel-trailer";
import { rockwoodUltraLiteTravelTrailer } from "./rockwood-ultra-lite-travel-trailer";
import { rockwoodVsWildwoodVsCherokee } from "./rockwood-vs-wildwood-vs-cherokee";
import { rvMotorhomesBuyersGuide } from "./rv-motorhomes-buyers-guide";
import { shastaCamperFloorPlans } from "./shasta-camper-floor-plans";
import { shastaCamperForSale } from "./shasta-camper-for-sale";
import { shastaCamperInterior } from "./shasta-camper-interior";
import { shastaCompact18fq } from "./shasta-compact-18fq";
import { shastaOasisTravelTrailer } from "./shasta-oasis-travel-trailer";
import { shastaTravelTrailer } from "./shasta-travel-trailer";
import { smallUsedMotorhomesForSale } from "./small-used-motorhomes-for-sale";
import { usedClassARvsForSale } from "./used-class-a-rvs-for-sale";
import { usedClassCMotorhomesForSale } from "./used-class-c-motorhomes-for-sale";
import { usedForestRiverRockwoodByYear } from "./used-forest-river-rockwood-by-year";
import { usedForestRiverTravelTrailersByYear } from "./used-forest-river-travel-trailers-by-year";
import { usedForestRiverVibeForSale } from "./used-forest-river-vibe-for-sale";
import { usedNewmarDutchStarForSale } from "./used-newmar-dutch-star-for-sale";
import { usedRvMotorhomesForSale } from "./used-rv-motorhomes-for-sale";
import { usedRvValuesAndPrices } from "./used-rv-values-and-prices";
import { vintageShastaCamper } from "./vintage-shasta-camper";
import { wildwoodFsx179dbk } from "./wildwood-fsx-179dbk";

/** Listed in this order on /guides. */
export const ARTICLES: [Article, ...Article[]] = [
  rvMotorhomesBuyersGuide,
  classCMotorhomeBuyersGuide,
  classAMotorhomesBuyersGuide,
  classBVsClassCMotorhomes,
  mostReliableClassCMotorhomes,
  usedClassCMotorhomesForSale,
  classCRvFinancing,
  usedRvMotorhomesForSale,
  usedRvValuesAndPrices,
  motorhomesForSaleByOwner,
  cheapUsedRvsForSale,
  smallUsedMotorhomesForSale,
  usedClassARvsForSale,
  newmarDutchStarBuyersGuide,
  newmarDutchStarPrice,
  newmarDutchStarFloorPlans,
  usedNewmarDutchStarForSale,
  forestRiverVibeTravelTrailerReview,
  forestRiverVibeFloorPlans,
  usedForestRiverVibeForSale,
  forestRiverImpressionFifthWheel,
  forestRiverRockwoodTravelTrailers,
  rockwoodMiniLiteTravelTrailer,
  rockwoodFifthWheels,
  forestRiverWildwoodTravelTrailer,
  rockwoodVsWildwoodVsCherokee,
  rockwoodUltraLiteTravelTrailer,
  usedForestRiverRockwoodByYear,
  forestRiverWildwood28view,
  wildwoodFsx179dbk,
  forestRiverCherokeeTravelTrailers,
  usedForestRiverTravelTrailersByYear,
  forestRiverSandpiper3800rk,
  forestRiverForesterClassC,
  keystoneHideoutTravelTrailer,
  keystoneHideoutForSale,
  keystoneHideoutSport,
  keystoneHideout175bh,
  keystoneHideout175bhByYear,
  hideout175bhVsJayFlightSlx175bh,
  keystoneHideoutBunkhouse,
  keystoneHideout2024Vs2025Vs2026,
  keystoneHideoutInterior,
  shastaTravelTrailer,
  shastaCamperForSale,
  shastaOasisTravelTrailer,
  shastaCompact18fq,
  shastaCamperFloorPlans,
  shastaCamperInterior,
  vintageShastaCamper,
];

export const findArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
