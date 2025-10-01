import explorium from "../../explorium.app.mjs";

export default {
  key: "explorium-fetch-businesses",
  name: "Fetch Businesses",
  description: "Fetches business records using filters. [See the documentation](https://developers.explorium.ai/reference/list_businesses)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    explorium,
    name: {
      propDefinition: [
        explorium,
        "name",
      ],
    },
    country: {
      propDefinition: [
        explorium,
        "country",
      ],
    },
    size: {
      propDefinition: [
        explorium,
        "size",
      ],
    },
    revenue: {
      propDefinition: [
        explorium,
        "revenue",
      ],
    },
    websiteKeywords: {
      type: "string[]",
      label: "Website Keywords",
      description: "Filter by website keywords",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.explorium.fetchBusinesses({
      $,
      data: {
        mode: "full",
        size: 100,
        page_size: 100,
        filters: {
          company_name: this.name
            ? {
              values: [
                this.name,
              ],
            }
            : undefined,
          country_code: this.country
            ? {
              values: [
                this.country,
              ],
            }
            : undefined,
          company_size: this.size
            ? {
              values: this.size,
            }
            : undefined,
          company_revenue: this.revenue
            ? {
              values: this.revenue,
            }
            : undefined,
          website_keywords: this.websiteKeywords
            ? {
              values: this.websiteKeywords,
            }
            : undefined,
        },
      },
    });
    $.export("$summary", `Fetched ${data.length} businesses`);
    return data;
  },
};
