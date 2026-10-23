import type { Article } from "@/lib/articles";

import { classAMotorhomesBuyersGuide } from "./class-a-motorhomes-buyers-guide";
import { classBVsClassCMotorhomes } from "./class-b-vs-class-c-motorhomes";
import { classCMotorhomeBuyersGuide } from "./class-c-motorhome-buyers-guide";
import { classCRvFinancing } from "./class-c-rv-financing";
import { mostReliableClassCMotorhomes } from "./most-reliable-class-c-motorhomes";
import { rvMotorhomesBuyersGuide } from "./rv-motorhomes-buyers-guide";
import { usedClassCMotorhomesForSale } from "./used-class-c-motorhomes-for-sale";

/** Listed in this order on /guides. */
export const ARTICLES: [Article, ...Article[]] = [
  rvMotorhomesBuyersGuide,
  classCMotorhomeBuyersGuide,
  classAMotorhomesBuyersGuide,
  classBVsClassCMotorhomes,
  mostReliableClassCMotorhomes,
  usedClassCMotorhomesForSale,
  classCRvFinancing,
];

export const findArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
