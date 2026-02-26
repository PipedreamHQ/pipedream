import jo4 from "../../jo4.app.mjs";

export default {
  key: "jo4-get-url-statistics",
  name: "Get URL Statistics",
  description: "Retrieve click statistics for a short URL. [See the documentation](https://jo4.io/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    jo4,
    urlSlug: {
      propDefinition: [
        jo4,
        "urlSlug",
      ],
    },
    startTime: {
      type: "integer",
      label: "Start Time",
      description: "Start of the stats window as Unix timestamp in milliseconds. Defaults to 30 days ago.",
      optional: true,
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description: "End of the stats window as Unix timestamp in milliseconds. Defaults to now.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.startTime) params.startTime = this.startTime;
    if (this.endTime) params.endTime = this.endTime;

    const response = await this.jo4.getUrlStats({
      slug: this.urlSlug,
      params,
      $,
    });

    $.export("$summary", `Retrieved statistics for URL: ${this.urlSlug}`);
    return response;
  },
};
