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
      async options() {
        const { company } = await this.makeRequest({
          query: "listCompanies",
        });

        return company.map(({
          CompanyId: value, CompanyName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    employee: {
      type: "integer",
      label: "Employee",
      description: "The project's employee.",
      async options() {
        const { employee } = await this.makeRequest({
          query: "listEmployees",
        });

        return employee.map(({
          EmployeeId: value, EmployeeName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    paymentId: {
      type: "integer",
      label: "Payment Id",
      description: "The project's id.",
      async options({ projectId }) {
        const { payment } = await this.makeRequest({
          variables: {
            projectId,
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
    projectLeadSourceId: {
      type: "integer",
      label: "Lead Source Id",
      description: "The project's lead source Id.",
      async options() {
        const { projectLeadSource } = await this.makeRequest({
          query: "listLeadSources",
        });

        return projectLeadSource.filter((item) => item.ProjectLeadSourceStatus === "Active").map(({
          ProjectLeadSourceId: value, ProjectLeadSource: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "integer",
      label: "Project Id",
      description: "The project's id.",
      async options() {
        const { project } = await this.makeRequest({
          query: "listProjects",
        });

        return project.map(({
          ProjectId: value, ProjectTitle: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectStatus: {
      type: "integer",
      label: "Status",
      withLabel: true,
      description: "The project's status.",
      async options({ parentId = 0 }) {
        const { status } = await this.makeRequest({
          variables: {
            parentId,
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
      description: "The project's types.",
      async options() {
        const { projectType } = await this.makeRequest({
          query: "listTypes",
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
      async options() {
        const { rate } = await this.makeRequest({
          query: "listRates",
        });

        return rate.map(({
          RateId: value, RateTitle: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "integer",
      label: "Task Id",
      description: "The task's id.",
      async options({ projectId }) {
        const { task } = await this.listTasks({
          projectId,
        });

        return task.map(({
          TaskId: value, TaskText: label,
        }) => ({
          label,
          value,
        }));
      },
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
      variables = {}, query,
    }) {
      return this.query({
        mutation: queries[query],
        variables,
      });
    },
    async listTasks({
      projectId, filter,
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
          return await this.makeRequest({
            variables: filter,
            query: "listTasks",
          });
        }
      }
      return {
        task: [],
      };
    },
  },
};
