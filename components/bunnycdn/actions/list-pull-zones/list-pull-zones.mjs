import app from "../../bunnycdn.app.mjs";

export default {
  key: "bunnycdn-list-pull-zones",
  name: "List Pull Zones",
  description: "List the pull zones in your bunny.net account, optionally filtered by a search term."
    + " Returns the settings of each pull zone. Use the `Id` field with **Get Pull Zone**, **Get Statistics** or **Purge Pull Zone Cache**."
    + " [See the documentation](https://bunny.net/docs/api-reference/core/pull-zone/list-pull-zones)",
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
    search: {
      type: "string",
      label: "Search",
      description: "Only return pull zones that match this term, e.g. `images`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The most pull zones to return, e.g. `50`. Defaults to `100`.",
      default: 100,
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const pullZones = await this.app.getAllPullZones({
      $,
      maxResults: this.maxResults,
      params: {
        search: this.search,
      },
    });
    $.export("$summary", `Found ${pullZones.length} pull zone${pullZones.length === 1
      ? ""
      : "s"}`);
    return pullZones;
  },
};
