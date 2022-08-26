import zohoProjects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-add-log-time",
  name: "Add Log Time",
  description: "Add Time for a General Log. Adds the time log to other tasks. [See the docs here](https://www.zoho.com/projects/help/rest-api/log-time.html#alink11)",
  type: "action",
  version: "0.0.29",
  props: {
    zohoProjects,
    portalId: {
      propDefinition: [
        zohoProjects,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        zohoProjects,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the other tasks.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date of the timesheet. Eg. (`MM-DD-YYYY`)",
    },
    hours: {
      type: "string",
      label: "Hours",
      description: "Time period of the timesheet. Eg. (`hh:mm`)",
    },
    billStatus: {
      type: "string",
      label: "Bill Status",
      description: "Timesheet billable status must be provided as *Billable* or *Non Billable*.",
      options: [
        "Billable",
        "Non Billable",
      ],
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional information about the time log.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      portalId,
      projectId,
      name,
      date,
      hours,
      billStatus,
      notes,
    } = this;

    const response =
      await this.zohoProjects.addTimeGeneralLog({
        $,
        portalId,
        projectId,
        data: {
          name,
          date,
          hours,
          bill_status: billStatus,
          notes,
        },
      });

    $.export("$summary", "Successfully added a new log time");

    return response;
  },
};
