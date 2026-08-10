// x-pd-ai: optimized
import app from "../../search_api.app.mjs";

export default {
  key: "search_api-list-locations",
  name: "List Locations",
  description: "List the Google locations supported for geo-targeting. [See the documentation](https://www.searchapi.io/docs/locations-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
      description: "The query used to search for locations, e.g. `new york` or `london`.",
    },
    limit: {
      propDefinition: [
        app,
        "locationsLimit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      q: this.q,
      limit: this.limit,
    };

    const result = await this.app.listLocations({
      $,
      params,
    });

    const count = result?.length || 0;
    $.export("$summary", `Successfully found ${count} location${count === 1
      ? ""
      : "s"} for "${this.q}"`);

    return result;
  },
};
