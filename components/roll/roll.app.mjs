import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "roll",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company Id",
      description: "The company's id.",
      async options() {
        const { data: { company } } = await this.listCompanies({});

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
        const { data: { employee } } = await this.listEmployees();

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
        const { data: { payment } } = await this.listPayments(projectId);

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
        const { data: { projectLeadSource } } = await this.listLeadSources();

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
        const { data: { project } } = await this.listProjects({});

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
        const { data: { status } } = await this.listStatuses({
          parentId,
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
        const { data: { projectType } } = await this.listTypes();

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
        const { data: { rate } } = await this.listRates();

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
        const { data: { task } } = await this.listTasks({
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
    async _makeRequest({
      $ = this, query, ...opts
    }) {

      const config = {
        url: this._apiUrl(),
        headers: this._getHeaders(),
        method: "POST",
        data: {
          query,
        },
        ...opts,
      };

      return axios($, config);
    },
    addSchema({
      $, mutation,
    }) {
      return this._makeRequest({
        $,
        query: `mutation {
          ${mutation}
        }`,
      });
    },
    listChecklists(projectId) {
      return this._makeRequest({
        query: `query {
            checklist (ProjectId: ${projectId}) {
              ChecklistId
            }
          }`,
      });
    },
    listCompanies({
      $, filter,
    }) {
      return this._makeRequest({
        $,
        query: `query {
            company ${filter || ""} {
              CompanyId
              CompanyName
              CompanyStatus
              CompanyInvoiceFirstName
              CompanyInvoiceLastName
              CompanyPhone
              CompanyPhoneArea
              CompanyPhoneCountry
              CompanyMobile
              CompanyEmail
              CompanyWebsite
              CompanyAddress
              CompanyAddress2
              CompanyCityOrTown
              CompanyStateOrRegion
              CompanyZipOrPostcode
              CompanyCountry
            }
          }`,
      });
    },
    listEmployees() {
      return this._makeRequest({
        query: `query {
            employee {
              EmployeeId
              EmployeeName
              EmployeeEmail
              CustomerId
            }
          }`,
      });
    },
    listLeadSources() {
      return this._makeRequest({
        query: `query {
            projectLeadSource {
              ProjectLeadSourceId
              ProjectLeadSource
              ProjectLeadSourceStatus
            }
          }`,
      });
    },
    listPayments(projectId) {
      return this._makeRequest({
        query: `query {
          payment(ProjectId: ${projectId}) {
            PaymentId
            Description
          }
        }`,
      });
    },
    listProjects({
      $, filter,
    }) {
      return this._makeRequest({
        $,
        query: `query {
          project ${filter || ""}{
            ProjectId
            CompanyId
            ProjectTitle
            ProjectDescription
            ProjectType
            ProjectLeadSourceId
            ProjectStatus
            ProjectSubStatusId
            ProjectValue
            ProjectJobNumber
            PONum
            ProjectAtRisk
            ProjectIsRetainer
            ProjectRetainerFrequency
            ProjectRetainerPeriod
            ProjectColor
            ProjectRetainerStartDate
            CompletedDate
            DueDate
            ProjectStartDate
            ProjectEndDate
            CostOrChargeout
            ProjectOrder
            Created
            LastUpdated
          }
        }`,
      });
    },
    listRates() {
      return this._makeRequest({
        query: `query {
            rate {
              RateId
              RateTitle
            }
          }`,
      });
    },
    listStatuses({ parentId }) {
      return this._makeRequest({
        query: `query {
            status(ParentId: ${parentId}) {
              Id,
              Slug,
              Status
            }
          }`,
      });
    },
    listTimes({
      $, filter,
    }) {
      return this._makeRequest({
        $,
        query: `query {
          time ${filter || ""}{
            TimeId
            EmployeeId
            ProjectId
            PaymentId
            TaskId
            RateId
            RateValue
            TimeText
            TimeInSeconds
            LoggedForDate
            TimeStatus
            Created
            LastUpdated
          }
        }`,
      });
    },
    listTypes() {
      return this._makeRequest({
        query: `query {
            projectType {
              ProjectTypeId
              ProjectType
              ProjectTypeIdStatus
            }
          }`,
      });
    },
    async listTasks({
      projectId, filter,
    }) {
      filter = `(${filter}`;

      if (projectId) {
        const { data: { checklist } } = await this.listChecklists(projectId);
        filter += `ChecklistId: ${checklist[0].ChecklistId}`;
      }

      filter += ")";

      return this._makeRequest({
        query: `query {
            task ${filter} {
              TaskId
              TaskText
            }
          }`,
      });
    },
  },
};
