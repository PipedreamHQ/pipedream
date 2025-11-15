import optimoroute from "../../optimoroute.app.mjs";

export default {
  key: "optimoroute-get-mobile-events",
  name: "Get Mobile Events",
  description: "Get mobile events from Optimoroute. [See the documentation](https://optimoroute.com/api/#get-mobile-events)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    optimoroute,
    afterTag: {
      propDefinition: [
        optimoroute,
        "afterTag",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.optimoroute.getMobileEvents({
      $,
      params: {
        after_tag: this.afterTag,
      },
    });
    $.export("$summary", `Mobile events found: ${response?.events?.length}`);
    return response;
  },
};
