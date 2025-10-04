import app from "../../procore.app.mjs";

export default {
  key: "procore-create-manpower-log",
  name: "Create Manpower Log",
  description: "Create a new manpower log. [See the documentation](https://developers.procore.com/reference/rest/manpower-logs?version=latest#create-manpower-log).",
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
    notes: {
      type: "string",
      label: "Notes",
      description: "The notes for the record",
    },
    datetime: {
      type: "string",
      label: "Datetime",
      description: "The datetime of the record. Eg. `2025-04-01T00:00:00Z`.",
      optional: true,
    },
    numWorkers: {
      type: "integer",
      label: "Number Of Workers",
      description: "The number of workers",
      optional: true,
    },
    numHours: {
      type: "string",
      label: "Number Of Hours",
      description: "The number of hours for each worker",
      optional: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
        ({
          companyId, projectId,
        }) => ({
          companyId,
          projectId,
        }),
      ],
    },
  },
  methods: {
    createManpowerLog({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/projects/${projectId}/manpower_logs`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createManpowerLog,
      companyId,
      projectId,
      datetime,
      notes,
      numWorkers,
      numHours,
      userId,
      locationId,
    } = this;

    const response = await createManpowerLog({
      $,
      companyId,
      projectId,
      data: {
        manpower_log: {
          datetime,
          notes,
          num_workers: numWorkers,
          num_hours: numHours,
          user_id: userId,
          location_id: locationId,
        },
      },
    });
    $.export("$summary", `Successfully created manpower log with ID \`${response.id}\`.`);
    return response;
  },
};
