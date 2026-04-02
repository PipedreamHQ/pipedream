import app from "../../avinode.app.mjs";

export default {
  key: "avinode-get-airport",
  name: "Get Airport",
  description:
    "Read a single airport by identifier. [See the documentation](https://developer.avinodegroup.com/reference/readairport-1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    airportId: {
      type: "string",
      label: "Airport ID",
      description: "The identifier of the airport to retrieve",
      optional: false,
    },
  },
  async run({ $ }) {
    const { airportId } = this;
    const body = await this.app.getAirport({
      $,
      airportId,
    });
    const data = body?.data !== undefined
      ? body.data
      : body;

    $.export(
      "$summary",
      `Retrieved airport \`${airportId}\``,
    );
    return data;
  },
};
