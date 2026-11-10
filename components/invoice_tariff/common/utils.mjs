import { XMLParser } from "fast-xml-parser";

// Generic, this-free parsing helpers shared by invoice_tariff components.

const parser = new XMLParser({
  ignoreAttributes: false,
  processEntities: true,
  htmlEntities: true,
  cdataPropName: "__cdata",
  trimValues: true,
  maxEntitySize: 1024 * 1024, // 1MB
  maxExpansionDepth: 10,
  maxTotalExpansions: 1000,
  maxExpandedLength: 10 * 1024 * 1024, // 10MB
  maxEntityCount: 100,
});

const textOf = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    if ("#text" in value) return textOf(value["#text"]);
    if ("__cdata" in value) return textOf(value.__cdata);
  }
  return "";
};

// Parse an RSS 2.0 document into normalized items
// ({ title, link, pubDate, summary }), handling CDATA and XML entity decoding.
export const parseRssItems = (xml) => {
  const parsed = parser.parse(typeof xml === "string" ? xml : String(xml));
  const raw = parsed?.rss?.channel?.item;
  if (!raw) return [];
  const items = Array.isArray(raw) ? raw : [raw];
  return items.map((item) => ({
    title: textOf(item.title),
    link: textOf(item.link),
    pubDate: textOf(item.pubDate),
    summary: textOf(item.description),
  }));
};
