import app from "../../procore.app.mjs";

export default {
  key: "procore-create-incident",
  name: "Create Incident",
  description: "Create a new incident. [See the documentation](https://developers.procore.com/reference/rest/incidents?version=latest#create-incident).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    projectId: {
      optional: false,
      propDefinition: [
        app,
        "projectId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Incident Title",
    },
    eventDate: {
      type: "string",
      label: "Event Date",
      description: "The date and time when the incident occurred, in ISO 8601 format. If the time is unknown, use `00:00` project time converted to UTC (e.g., `2025-04-01T00:00:00Z`).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the Incident",
      optional: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Private",
      description: "Indicates whether an Incident is private",
      optional: true,
    },
    recordable: {
      type: "boolean",
      label: "Recordable",
      description: "Indicates whether an Incident is recordable",
      optional: true,
    },
    timeUnknown: {
      type: "boolean",
      label: "Time Unknown",
      description: "Indicates whether the time of the Incident occurrence is unknown",
      optional: true,
    },
  },
  methods: {
    createIncident({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/projects/${projectId}/incidents`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createIncident,
      companyId,
      projectId,
      title,
      description,
      eventDate,
      isPrivate,
      recordable,
      timeUnknown,
    } = this;

    const response = await createIncident({
      $,
      companyId,
      projectId,
      data: {
        incident: {
          title,
          description,
          event_date: eventDate,
          private: isPrivate,
          recordable,
          time_unknown: timeUnknown,
        },
      },
    });
    $.export("$summary", `Successfully created incident with ID \`${response.id}\`.`);
    return response;
  },
};
