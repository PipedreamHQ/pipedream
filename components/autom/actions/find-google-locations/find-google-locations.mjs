import app from "../../autom.app.mjs";

export default {
  key: "autom-find-google-locations",
  name: "Find Google Locations",
  description: "Find the Google location names and IDs for a city, region or country, ordered by reach, e.g. to localize a Google search. [See the documentation](https://docs.autom.dev/api-reference/finder/google-locations)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    query: {
      type: "string",
      label: "Location Name",
      description: "A city, region or country name to look up, e.g. `paris`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.findGoogleLocations({
      $,
      params: {
        query: this.query,
      },
    });
    $.export("$summary", `Found ${response.length ?? 0} Google locations for "${this.query}"`);
    return response;
  },
};
