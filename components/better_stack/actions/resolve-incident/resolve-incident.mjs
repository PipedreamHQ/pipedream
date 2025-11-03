import app from "../../better_stack.app.mjs";

export default {
  key: "better_stack-resolve-incident",
  name: "Resolve Incident",
  description: "Brings a closure to an incident by resolving it with optional resolution details. [See the documentation](https://betterstack.com/docs/uptime/api/resolve-an-ongoing-incident/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    incidentId: {
      propDefinition: [
        app,
        "incidentId",
      ],
    },
    resolvedBy: {
      type: "string",
      label: "Resolved By",
      description: "User e-mail or a custom identifier of the entity that resolved the incident",
      optional: true,
    },
  },
  methods: {
    resolveIncident({
      incidentId, ...args
    } = {}) {
      return this.app.post({
        path: `/incidents/${incidentId}/resolve`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      resolveIncident,
      incidentId,
      resolvedBy,
    } = this;

    const response = await resolveIncident({
      $,
      incidentId,
      data: {
        resolved_by: resolvedBy,
      },
    });

    $.export("$summary", `Successfully resolved incident with ID \`${response.data.id}\``);
    return response;
  },
};
