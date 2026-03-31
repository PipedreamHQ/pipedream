import app from "../../avinode.app.mjs";

export default {
  key: "avinode-list-aircraft-types",
  name: "List Aircraft Types",
  description:
    "List all aircraft types. Paginates until every type is retrieved. [See the documentation](https://developer.avinodegroup.com/reference/listaircrafttypes)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    pageSize: {
      type: "integer",
      label: "Page size",
      description: "Number of records to request per API page (`page[size]`)",
      optional: true,
      default: 100,
      min: 1,
      max: 500,
    },
    fields: {
      type: "string[]",
      label: "Sparse fields",
      description:
        "Optional fields to include per type: perfdetails, typedetails, typephotos",
      optional: true,
      options: [
        "perfdetails",
        "typedetails",
        "typephotos",
      ],
    },
  },
  async run({ $ }) {
    const {
      pageSize, fields,
    } = this;
    const aircraftTypes = await this.app.listAircraftTypes({
      $,
      pageSize,
      fields,
    });

    $.export(
      "$summary",
      `Retrieved ${aircraftTypes.length} aircraft type${aircraftTypes.length === 1
        ? ""
        : "s"}`,
    );
    return aircraftTypes;
  },
};
