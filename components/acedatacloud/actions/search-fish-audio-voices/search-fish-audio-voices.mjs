import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-search-fish-audio-voices",
  name: "Search Fish Audio Voices",
  description: "Search public or saved Fish Audio voices and return a numbered page with voice IDs. Use an `items[]._id` value as the Reference Voice ID in **Synthesize Fish Audio Speech**. [See the documentation](https://platform.acedata.cloud/documents/fish-model-query)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acedatacloud,
    title: {
      type: "string",
      label: "Voice Title",
      description: "Filter voice titles, e.g. `calm narrator`.",
      optional: true,
    },
    self: {
      type: "boolean",
      label: "Only My Voices",
      description: "Search only your saved voices when true, e.g. `true`.",
      default: true,
      optional: true,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "One-based results page, e.g. `1`. Increase it to fetch more matches.",
      default: 1,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Maximum voices on this page, e.g. `10`.",
      default: 10,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!Number.isInteger(this.pageNumber) || this.pageNumber < 1) {
      throw new Error("Page Number must be a positive integer.");
    }
    if (!Number.isInteger(this.pageSize) || this.pageSize < 1) {
      throw new Error("Page Size must be a positive integer.");
    }
    const params = {
      page_number: this.pageNumber,
      page_size: this.pageSize,
      self: this.self,
      ...(this.title && {
        title: requiredText(this.title, "Voice Title"),
      }),
    };
    const response = await this.acedatacloud.request({
      $,
      method: "GET",
      path: "/fish/model",
      params,
    });
    $.export("$summary", `Found ${response?.items?.length ?? 0} Fish Audio voices on page ${this.pageNumber}`);
    return response;
  },
};
