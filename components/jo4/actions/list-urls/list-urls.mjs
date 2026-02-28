import jo4 from "../../jo4.app.mjs";

export default {
  key: "jo4-list-urls",
  name: "List URLs",
  description: "List your short URLs with optional click statistics. [See the documentation](https://jo4.io/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    jo4,
    page: {
      type: "integer",
      label: "Page",
      description: "Page number (0-indexed)",
      default: 0,
      optional: true,
    },
    size: {
      type: "integer",
      label: "Page Size",
      description: "Number of URLs per page",
      default: 25,
      optional: true,
      min: 1,
      max: 100,
    },
    withStats: {
      type: "boolean",
      label: "Include Click Stats",
      description: "Include total click count for each URL",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jo4.listUrls({
      params: {
        page: this.page ?? 0,
        size: this.size ?? 25,
        withStats: this.withStats ?? false,
      },
      $,
    });

    const count = response.urls?.length ?? 0;
    $.export("$summary", `Retrieved ${count} URL(s)`);
    return response;
  },
};
