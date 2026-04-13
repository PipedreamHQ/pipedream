import app from "../../avinode.app.mjs";

export default {
  key: "avinode-get-airport",
  name: "Get Airport",
  description:
    "Read a single airport by identifier (search or select from the dropdown, or enter an ID). [Read airport](https://developer.avinodegroup.com/reference/readairport-1)",
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
      propDefinition: [
        app,
        "airportId",
      ],
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
