import app from "../../letsfg.app.mjs";

export default {
  key: "letsfg-resolve-location",
  name: "Resolve Location",
  description: "Resolve a city or airport name to IATA codes. Call this before Search Flights when you only have a place name. [See the documentation](https://letsfg.co/developers/docs/api-search/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.resolveLocation({
      $,
      query: this.query,
    });

    const count = Array.isArray(response)
      ? response.length
      : 0;
    $.export("$summary", `Resolved \`${this.query}\` to ${count} location${count === 1
      ? ""
      : "s"}`);

    return response;
  },
};
