import app from "../../procore.app.mjs";

export default {
  key: "procore-create-timesheet",
  name: "Create Timesheet",
  description: "Create a new timesheet. [See the documentation](https://developers.procore.com/reference/rest/timesheets?version=latest#create-timesheet).",
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
    date: {
      type: "string",
      label: "Date",
      description: "The date of the timesheet. Eg. `2025-04-01`.",
    },
  },
  methods: {
    createTimesheet({
      projectId, ...args
    }) {
      return this.app.post({
        path: `/projects/${projectId}/timesheets`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createTimesheet,
      companyId,
      projectId,
      date,
    } = this;

    const response = await createTimesheet({
      $,
      companyId,
      projectId,
      data: {
        timesheet: {
          date,
        },
      },
    });
    $.export("$summary", `Successfully created timesheet with ID \`${response.id}\`.`);
    return response;
  },
};
