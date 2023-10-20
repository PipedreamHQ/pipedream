import { GraphQLClient } from "graphql-request";
import "graphql/language/index.js";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "roll",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company Id",
      description: "The company's id.",
      async options({ page }) {
        const limit = 100;
        const { company } = await this.makeRequest({
          query: "listCompanies",
          variables: {
            limit: limit,
            offset: limit * page,
          },
        });

        return company.map(({
          CompanyId: value, CompanyName,
        }) => ({
          label: CompanyName || value,
          value,
        }));
      },
    },
    color: {
      type: "string",
      label: "Color",
      description: "The hexadecimal [color code](https://www.w3schools.com/colors/colors_hexadecimal.asp).",
    },
    completedDate: {
      type: "string",
      label: "Completed Date",
      description: "The date the project was completed. Date format: `0000-00-00T00:00:00.000Z`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The project's description",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date by which the project must be done. Date format: `0000-00-00`",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The company's contact email.",
    },
    employee: {
      type: "integer",
      label: "Employee",
      description: "The project's employee.",
      async options({ page }) {
        const limit = 100;
        const { employee } = await this.makeRequest({
          query: "listEmployees",
          variables: {
            limit: limit,
            offset: limit * page,
          },
        });

        return employee.map(({
          EmployeeId: value, EmployeeName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The day by the project must be finish. Date format: `0000-00-00`",
    },
    jobNumber: {
      type: "string",
      label: "Job Number",
      description: "The identification number of the job.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The company's name.",
    },
    paymentId: {
      type: "integer",
      label: "Payment Id",
      description: "The payment's id.",
      async options({
        projectId, page,
      }) {
        const limit = 100;
        const { payment } = await this.makeRequest({
          variables: {
            projectId,
            limit: limit,
            offset: limit * page,
          },
          query: "listPayments",
        });

        return payment.map(({
          PaymentId: value, Description: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    poNum: {
      type: "string",
      label: "PONum",
      description: "The purchase order number.",
    },
    projectAtRisk: {
      type: "boolean",
      label: "Project At Risk",
      description: "Whether the project is at risk or not.",
    },
    projectId: {
      type: "integer",
      label: "Project Id",
      description: "The project's id.",
      async options({ page }) {
        const limit = 100;
        const { project } = await this.makeRequest({
          query: "listProjects",
          variables: {
            limit: limit,
            offset: limit * page,
          },
        });

        return project.map(({
          ProjectId: value, ProjectTitle,
        }) => ({
          label: ProjectTitle || value,
          value,
        }));
      },
    },
    projectIsRetainer: {
      type: "string",
      label: "Project Is Retainer",
      description: "Whether the project is retainer or not.",
      options: [
        "Yes",
        "No",
      ],
    },
    projectLeadSourceId: {
      type: "integer",
      label: "Lead Source Id",
      description: "The project's lead source Id.",
      async options({ page }) {
        const limit = 100;
        const { projectLeadSource } = await this.makeRequest({
          query: "listLeadSources",
          variables: {
            limit: limit,
            offset: limit * page,
          },
        });

        return projectLeadSource.filter((item) => item.ProjectLeadSourceStatus === "Active").map(({
          ProjectLeadSourceId: value, ProjectLeadSource: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectRetainerFrequency: {
      type: "integer",
      label: "Project Retainer Frequency",
      description: "The amount of time.",
    },
    projectRetainerStartDate: {
      type: "string",
      label: "Project Retainer Start Date",
      description: "Specifies the period over the frequency. Date format: `0000-00-00T00:00:00.000Z`",
    },
    projectStatus: {
      type: "integer",
      label: "Status",
      withLabel: true,
      description: "The project's status.",
      async options({
        parentId = 0, page,
      }) {
        const limit = 100;
        const { status } = await this.makeRequest({
          variables: {
            parentId,
            limit: limit,
            offset: limit * page,
          },
          query: "listStatuses",
        });

        return status.filter((item) => item.Status === "Active").map(({
          Id: value, Slug: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectType: {
      type: "integer[]",
      label: "Type",
      description: "The project's types. You must select the checkbox values in the correct order, otherwise it will not match correctly.",
      async options({ page }) {
        const limit = 100;
        const { projectType } = await this.makeRequest({
          query: "listTypes",
          variables: {
            limit: limit,
            offset: limit * page,
          },
        });

        return projectType.map(({
          ProjectTypeId: value, ProjectType: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    rateId: {
      type: "integer",
      label: "Rate Id",
      description: "The rate's id.",
      async options({ page }) {
        const limit = 100;
        const { rate } = await this.makeRequest({
          query: "listRates",
          variables: {
            limit: limit,
            offset: limit * page,
          },
        });

        return rate.map(({
          RateId: value, RateTitle: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The day by the project must be started. Date format: `0000-00-00`",
    },
    taskId: {
      type: "integer",
      label: "Task Id",
      description: "The task's id.",
      async options({
        projectId, page,
      }) {
        const { task } = await this.listTasks({
          projectId,
          page,
        });

        return task.map(({
          TaskId: value, TaskText: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The project's title",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The project's amount.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.rollhq.com/graphql";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_access_token}`,
      };
    },
    async query({
      query,
      mutation,
      variables,
    }) {
      const client = new GraphQLClient(this._apiUrl(), {
        headers: this._getHeaders(),
      });

      return await client.request(query || mutation, variables);
    },
    makeRequest({
      variables = {}, query, type = "query",
    }) {
      return this.query({
        [type]: queries[query],
        variables,
      });
    },
    async listTasks({
      projectId, filter = {}, page,
    }) {
      if (projectId) {
        const { checklist } = await this.makeRequest({
          variables: {
            projectId,
          },
          query: "listChecklists",
        });
        if (checklist.length) {
          filter.checklistId = checklist[0].ChecklistId;
        }
      }

      if (page) {
        const limit = 100;
        filter.offset = limit * page;
        filter.limit = limit;
      }

      return await this.makeRequest({
        variables: filter,
        query: "listTasks",
      });
    },
  },
};
