import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-get-incident",
  name: "Get Incident",
  description: "Returns an incident by ID. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/getIncidentById)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    incidentId: {
      propDefinition: [
        app,
        "incidentId",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      incidentId,
    } = this;

    const response = await app.getIncident({
      $,
      incidentId,
    });

    $.export("$summary", `Successfully retrieved incident with ID \`${response.id}\``);

    return response;
  },
};
