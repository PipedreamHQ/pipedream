import common from "../common.mjs";

export default {
  ...common,
  key: "zoho_projects-new-log-time",
  name: "New Log Time",
  description: "Emit new event when a log time is created. [See the docs here](https://www.zoho.com/projects/help/rest-api/log-time.html#alink1)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    portalId: {
      propDefinition: [
        common.props.zohoProjects,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        common.props.zohoProjects,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    viewType: {
      type: "string",
      label: "View Type",
      description: "View type of the timesheet must be provided as day or week or month or custom_date",
      options: [
        {
          label: "Day",
          value: "day",
        },
        {
          label: "Week",
          value: "week",
        },
        {
          label: "Month",
          value: "month",
        },
        {
          label: "Custom Date",
          value: "custom_date",
        },
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date of the timesheet view type. E.g. (`[MM-DD-YYYY]`)",
    },
    billStatus:	{
      type: "string",
      label: "Bill Status",
      description: "Timesheet billable status must be provided as `All`, `Billable` or `Non Billable`.",
      options: [
        "All",
        "Billable",
        "Non Billable",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return "timelogs";
    },
    getResourceFn() {
      return this.zohoProjects.getLogs;
    },
    getResourceFnArgs() {
      const {
        portalId,
        projectId,
        viewType,
        date,
        billStatus,
      } = this;
      return {
        portalId,
        projectId,
        params: {
          users_list: "all",
          view_type: viewType,
          date,
          bill_status: billStatus,
          component_type: "general",
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return resource.created_time_long > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id_string,
        ts: resource.created_time_long,
        summary: `TimeLog ID ${resource.id_string}`,
      };
    },
  },
};
