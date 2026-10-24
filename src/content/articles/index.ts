import type { Article } from "@/lib/articles";

import { cheapUsedRvsForSale } from "./cheap-used-rvs-for-sale";
import { classAMotorhomesBuyersGuide } from "./class-a-motorhomes-buyers-guide";
import { classBVsClassCMotorhomes } from "./class-b-vs-class-c-motorhomes";
import { classCMotorhomeBuyersGuide } from "./class-c-motorhome-buyers-guide";
import { classCRvFinancing } from "./class-c-rv-financing";
import { forestRiverImpressionFifthWheel } from "./forest-river-impression-fifth-wheel";
import { forestRiverVibeFloorPlans } from "./forest-river-vibe-floor-plans";
import { forestRiverVibeTravelTrailerReview } from "./forest-river-vibe-travel-trailer-review";
import { mostReliableClassCMotorhomes } from "./most-reliable-class-c-motorhomes";
import { motorhomesForSaleByOwner } from "./motorhomes-for-sale-by-owner";
import { newmarDutchStarBuyersGuide } from "./newmar-dutch-star-buyers-guide";
import { newmarDutchStarFloorPlans } from "./newmar-dutch-star-floor-plans";
import { newmarDutchStarPrice } from "./newmar-dutch-star-price";
import { rvMotorhomesBuyersGuide } from "./rv-motorhomes-buyers-guide";
import { smallUsedMotorhomesForSale } from "./small-used-motorhomes-for-sale";
import { usedClassARvsForSale } from "./used-class-a-rvs-for-sale";
import { usedClassCMotorhomesForSale } from "./used-class-c-motorhomes-for-sale";
import { usedForestRiverVibeForSale } from "./used-forest-river-vibe-for-sale";
import { usedNewmarDutchStarForSale } from "./used-newmar-dutch-star-for-sale";
import { usedRvMotorhomesForSale } from "./used-rv-motorhomes-for-sale";
import { usedRvValuesAndPrices } from "./used-rv-values-and-prices";

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
];

export const findArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
