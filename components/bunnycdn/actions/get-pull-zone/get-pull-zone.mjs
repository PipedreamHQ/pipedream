import app from "../../bunnycdn.app.mjs";

export default {
  key: "bunnycdn-get-pull-zone",
  name: "Get Pull Zone",
  description: "Get the settings of one pull zone, including its origin, hostnames and bandwidth use."
    + " Use **List Pull Zones** to find the pull zone."
    + " [See the documentation](https://bunny.net/docs/api-reference/core/pull-zone/get-pull-zone)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    pullZoneId: {
      propDefinition: [
        app,
        "pullZoneId",
      ],
    },
  },
  async run({ $ }) {
    const pullZone = await this.app.getPullZone({
      $,
      pullZoneId: this.pullZoneId,
    });
    $.export("$summary", `Retrieved pull zone ${pullZone.Name}`);
    return pullZone;
  },
};
