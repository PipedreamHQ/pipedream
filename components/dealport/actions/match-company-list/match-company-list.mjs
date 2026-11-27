import { ConfigurationError } from "@pipedream/platform";
import app from "../../dealport.app.mjs";

export default {
  key: "dealport-match-company-list",
  name: "Match Company List ($0.00)",
  description: "Match a CSV text or structured company list against 28M+ US private company Records for free ($0.00). [See the documentation](https://app.dealport.com/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    csv: {
      type: "string",
      label: "CSV Text",
      description: "Raw CSV string with header row (`name,domain,city,state`) separated from company rows by a line break (`\\n` represents a line break), e.g. `name,domain,city,state\\nAcme LLC,acme.com,Columbus,OH`. Provide either **CSV Text** or **Items JSON**.",
      optional: true,
    },
    itemsJson: {
      type: "string",
      label: "Items JSON",
      description: "JSON array of up to 250 company objects, e.g. `[{\"name\":\"Acme LLC\",\"domain\":\"acme.com\",\"state\":\"OH\"}]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.csv && !this.itemsJson) {
      throw new ConfigurationError("Provide either CSV Text or Items JSON.");
    }
    let items;
    if (this.itemsJson) {
      try {
        items = typeof this.itemsJson === "string"
          ? JSON.parse(this.itemsJson)
          : this.itemsJson;
      } catch {
        throw new ConfigurationError("Items JSON must be a valid JSON array of company objects.");
      }
      if (!Array.isArray(items) || items.length === 0 || items.length > 250) {
        throw new ConfigurationError("Items JSON must be an array containing 1 to 250 company objects.");
      }
    }
    const response = await this.app.matchCompanies({
      $,
      data: {
        csv: this.csv,
        items,
        watch: false,
      },
    });
    const matches = response?.matches ?? response?.items ?? [];
    $.export("$summary", `Matched ${matches.length} company row${matches.length === 1
      ? ""
      : "s"} ($0.00)`);
    return response;
  },
};
