import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-amazon",
  name: "Get Amazon Data",
  description: "Search Amazon or retrieve a product, offers or bestseller list. Search/product cost 1 credit; offers/bestsellers cost 5. [Documentation](https://fastaf.co/docs/#amazon)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fastaf,
    resource: {
      type: "string",
      label: "Resource",
      description: "Choose search, product, offers or bestsellers. Reviews are not available. [Documentation](https://fastaf.co/docs/#amazon)",
      options: [
        "search",
        "product",
        "offers",
        "bestsellers",
      ],
      default: "search",
    },
    query: {
      propDefinition: [
        fastaf,
        "query",
      ],
      optional: true,
      description: "Required for search only. Ignored for other resources. [Documentation](https://fastaf.co/docs/#amazon)",
    },
    asin: {
      type: "string",
      label: "ASIN",
      description: "Amazon product identifier from its product URL. Required for product/offers; ignored for search/bestsellers. [Documentation](https://fastaf.co/docs/#amazon)",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Amazon Domain",
      description: "Amazon domain suffix, not hostname: `com`, `co.uk`, `de`, etc. Default `com`. [Documentation](https://fastaf.co/docs/#amazon)",
      default: "com",
      optional: true,
    },
    country: {
      propDefinition: [
        fastaf,
        "country",
      ],
      description: "Two-letter marketplace country code, such as `us`; default `us`. No country surcharge on this endpoint. [Documentation](https://fastaf.co/docs/#amazon)",
    },
    language: {
      propDefinition: [
        fastaf,
        "language",
      ],
      description: "Product language code, such as `en` or `de`. Omitted: marketplace default. Not sent for offers. [Documentation](https://fastaf.co/docs/#amazon)",
    },
    postalCode: {
      type: "string",
      label: "Delivery Postal Code",
      description: "Delivery location used for price and availability, such as `10001`. Not sent for bestsellers. [Documentation](https://fastaf.co/docs/#amazon)",
      optional: true,
    },
    page: {
      propDefinition: [
        fastaf,
        "page",
      ],
      description: "One-based page: 1-100 for search, 1-2 for bestsellers. Default 1; not sent for product/offers. Each page is a separate paid request. [Documentation](https://fastaf.co/docs/#amazon)",
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Bestsellers only: category slug, node ID or slug/node pair, such as `kitchen/289668`. Omit for all departments. [Documentation](https://fastaf.co/docs/#amazon)",
      optional: true,
    },
    listType: {
      type: "string",
      label: "Ranked List",
      description: "Bestsellers only. Omitted: bestsellers. [Documentation](https://fastaf.co/docs/#amazon)",
      options: [
        "bestsellers",
        "new_releases",
        "movers_and_shakers",
        "most_wished_for",
        "most_gifted",
      ],
      optional: true,
    },
    fullList: {
      type: "boolean",
      label: "Full Ranked List",
      description: "Bestsellers only: true returns the combined ranked list (service default); false returns the selected page. No extra FastAF credits. [Documentation](https://fastaf.co/docs/#amazon)",
      optional: true,
    },
  },
  async run({ $ }) {
    const resource = this.resource || "search";
    if (resource === "search" && !this.query?.trim()) throw new Error("Search requires a query.");
    if ([
      "product",
      "offers",
    ].includes(resource) && !this.asin?.trim()) {
      throw new Error("Product and offers require an ASIN.");
    }
    const { data } = await this.fastaf.amazon({
      $,
      data: {
        resource,
        domain: this.domain,
        country: this.country,
        language: resource !== "offers"
          ? this.language
          : undefined,
        query: resource === "search"
          ? this.query
          : undefined,
        asin: [
          "product",
          "offers",
        ].includes(resource)
          ? this.asin
          : undefined,
        postal_code: resource !== "bestsellers"
          ? this.postalCode
          : undefined,
        page: [
          "search",
          "bestsellers",
        ].includes(resource)
          ? this.page
          : undefined,
        category_id: resource === "bestsellers"
          ? this.categoryId
          : undefined,
        type: resource === "bestsellers"
          ? this.listType
          : undefined,
        full_list: resource === "bestsellers"
          ? this.fullList
          : undefined,
      },
    });
    $.export("$summary", "Successfully retrieved the requested Amazon resource.");
    return data;
  },
};
