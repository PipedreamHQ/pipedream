import app from "../../beebole_app.app.mjs";

export default {
  name: "Run report",
  description: "Run a report from Beebole",
  key: "beebole_app-run-report",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    begda: {
      propDefinition: [
        app,
        "begda",
      ],
    },
    endda: {
      propDefinition: [
        app,
        "endda",
      ],
    },
    keys: {
      type: "string[]",
      label: "Columns",
      description: "Select the columns to display in the report.",
      options: [
        {
          label: "Absence",
          value: "absence",
        },
        {
          label: "Absence ID",
          value: "absenceId",
        },
        {
          label: "Activity",
          value: "activity",
        },
        {
          label: "Billing",
          value: "billing",
        },
        {
          label: "Billing - %",
          value: "billingPercent",
        },
        {
          label: "Billable - ratio",
          value: "billingRatio",
        },
        {
          label: "Billable/Non-billable",
          value: "billableSplit",
        },
        {
          label: "Billable Utilization %",
          value: "billability",
        },
        {
          label: "Budget",
          value: "budget",
        },
        {
          label: "Business days",
          value: "workDays",
        },
        {
          label: "Business days remaining",
          value: "remWorkDays",
        },
        {
          label: "Business hours",
          value: "workHours",
        },
        {
          label: "Business hours remaining",
          value: "remWorkHours",
        },
        {
          label: "Comment",
          value: "comment",
        },
        {
          label: "Company",
          value: "company",
        },
        {
          label: "Company ID",
          value: "companyId",
        },
        {
          label: "Costs",
          value: "cost",
        },
        {
          label: "Costs - %",
          value: "costsPercent",
        },
        {
          label: "Date",
          value: "date",
        },
        {
          label: "Daily Cost",
          value: "dailyCost",
        },
        {
          label: "Daily Rate",
          value: "dailyRate",
        },
        {
          label: "Days",
          value: "inDays",
        },
        {
          label: "Event ID",
          value: "eventId",
        },
        {
          label: "Hourly Cost",
          value: "hourlyCost",
        },
        {
          label: "Hourly Rate",
          value: "hourlyRate",
        },
        {
          label: "Hours",
          value: "hours",
        },
        {
          label: "Hours - %",
          value: "hoursPercent",
        },
        {
          label: "Is working",
          value: "isAtWork",
        },
        {
          label: "Month",
          value: "month",
        },
        {
          label: "Overtime / day",
          value: "overtime",
        },
        {
          label: "Overtime / week",
          value: "weeklyOvertime",
        },
        {
          label: "Person",
          value: "person",
        },
        {
          label: "Person ID",
          value: "personId",
        },
        {
          label: "Profit",
          value: "profit",
        },
        {
          label: "Profit - %",
          value: "profitPercent",
        },
        {
          label: "Profit - ratio",
          value: "profitRatio",
        },
        {
          label: "Project",
          value: "project",
        },
        {
          label: "Project ID",
          value: "projectId",
        },
        {
          label: "Status",
          value: "status",
        },
        {
          label: "Task",
          value: "task",
        },
        {
          label: "Task ID",
          value: "taskId",
        },
        {
          label: "Time End",
          value: "etime",
        },
        {
          label: "Time Start",
          value: "stime",
        },
        {
          label: "Sub Project",
          value: "subproject",
        },
        {
          label: "Sub Project ID",
          value: "subprojectId",
        },
        {
          label: "Week",
          value: "week",
        },
      ],
      default: [
        "company",
        "project",
        "task",
        "person",
        "hours",
        "comment",
      ],
    },
    statusFilters: {
      type: "string[]",
      label: "Status",
      description: "Choose approval statuses",
      options: [
        {
          label: "Draft",
          value: "d",
        },
        {
          label: "Submitted",
          value: "s",
        },
        {
          label: "Rejected",
          value: "r",
        },
        {
          label: "Approved",
          value: "a",
        },
        {
          label: "Locked",
          value: "l",
        },
      ],
      default: [
        "d",
        "s",
        "a",
        "r",
        "l",
      ],
    },
    groups: {
      type: "string[]",
      label: "Groups/Custom fields (optional)",
      description: "Groups and Custom fields as columns",
      default: [],
      async options() {
        const response = await this.app.apiRequest({
          data: {
            services: [
              {
                service: "group.tree",
              },
              {
                service: "custom_field.list",
              },
            ],
          },
        });
        let opts = [],
          pushGroups = function(v, c, t) {
            v.forEach((i) => {
              let text = t + i.name;
              if (i.groups) {
                c.push({
                  "value": "gid" + i.id,
                  "label": text,
                });
                pushGroups(i.groups, c, text + ": ");
              }
            });
          };
        pushGroups(response[0].groups, opts, "");
        response[1].customFields.forEach((cf) => opts.push({
          "value": "gid" + cf.id,
          "label": cf.name,
        }));

        return opts;
      },
      optional: true,
    },
    groupFilters: {
      type: "integer[]",
      label: "Groups to filter results by (optional)",
      description: "List of groups to filter results. Array of internal IDs i.e. [66]",
      optional: true,
    },
  },
  async run({ $ }) {
    let jobResp,
      response,
      maxWait = 10,
      srvData = {
        service: "time_entry.export",
        from: this.begda,
        to: this.endda,
        show: "all",
        statusFilters: this.statusFilters,
        outputFormat: "array",
      };

    srvData.keys = this.keys.concat(...this.groups);
    if (this.groupFilters && this.groupFilters.length)
      srvData.gids = JSON.parse(this.groupFilters);

    try {
      jobResp = await this.app.apiRequest({
        $,
        data: srvData,
      });
      while (maxWait) {
        response = await this.app.apiRequest({
          $,
          data: {
            service: "time_entry.get_job_info",
            id: jobResp.job.id,
            outputFormat: "array",
          },
        });
        if (response.job.status.indexOf("running") > -1)
          maxWait -= 1;
        else {
          $.export("$summary", `Successfully run report with ${response.job.result.length - 1} results`);
          return response;
        }
      }

      return "Report is taking too long. Stopped. Define additional filters";
    } catch (errors) {
      return errors;
    }
  },
};
