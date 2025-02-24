import pd from "pipedrive";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pipedrive",
  propDefinitions: {
    userId: {
      type: "integer",
      label: "User ID",
      description: "ID of the user who will be marked as the owner of this deal. If omitted, the authorized user ID will be used.",
      optional: true,
      async options() {
        const { data: users } = await this.getUsers();
        return users.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    personId: {
      type: "integer",
      label: "Person ID",
      description: "ID of the person this deal will be associated with",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: persons,
          additional_data: additionalData,
        } = await this.getPersons({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: persons.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor,
          },
        };
      },
    },
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description: "ID of the organization this deal will be associated with",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: organizations,
          additional_data: additionalData,
        } = await this.getOrganizations({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });
        return {
          options: organizations.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor || false,
          },
        };
      },
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Deal success probability percentage. Used/shown only when `deal_probability` for the pipeline of the deal is enabled.",
      optional: true,
    },
    lostReason: {
      type: "string",
      label: "Lost Reason",
      description: "Optional message about why the deal was lost (to be used when status=lost)",
      optional: true,
    },
    visibleTo: {
      type: "integer",
      label: "Visible To",
      description: "Visibility of the deal. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
      optional: true,
      options: constants.VISIBLE_TO_OPTIONS,
    },
    addTime: {
      type: "string",
      label: "Add Time",
      description: "The creation date and time of the deal. Requires admin user API token. Format: `YYYY-MM-DDTHH:MM:SSZ`",
      optional: true,
    },
    dealTitle: {
      type: "string",
      label: "Title",
      description: "Deal title",
    },
    dealValue: {
      type: "string",
      label: "Value",
      description: "Value of the deal. If omitted, value will be set to 0.",
      optional: true,
    },
    dealCurrency: {
      type: "string",
      label: "Currency",
      description: "Currency of the deal. Accepts a 3-character currency code. If omitted, currency will be set to the default currency of the authorized user.",
      optional: true,
    },
    stageId: {
      type: "integer",
      label: "Stage ID",
      description: "ID of the stage this deal will be placed in a pipeline (note that you can't supply the ID of the pipeline as this will be assigned automatically based on `stage_id`). If omitted, the deal will be placed in the first stage of the default pipeline. Get the `stage_id` from [here](https://developers.pipedrive.com/docs/api/v1/#!/Stages/get_stages).",
      optional: true,
      async options({ prevContext }) {
        if (prevContext.cursor === false) {
          return [];
        }
        const {
          data: stages,
          additional_data: additionalData,
        } = await this.getStages({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: stages?.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "open = Open, won = Won, lost = Lost, deleted = Deleted. If omitted, status will be set to open.",
      optional: true,
      options: constants.STATUS_OPTIONS,
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "ID of the deal this activity will be associated with",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: deals,
          additional_data: additionalData,
        } = await this.getDeals({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: deals?.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor,
          },
        };
      },
    },
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "ID of the pipeline this activity will be associated with",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.cursor === false) {
          return [];
        }
        const {
          data: pipelines,
          additional_data: additionalData,
        } = await this.getPipelines({
          cursor: prevContext.cursor,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: pipelines?.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            cursor: additionalData.next_cursor,
          },
        };
      },
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "ID of the lead this activity will be associated with",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.nextStart === false) {
          return [];
        }
        const {
          data: leads,
          additional_data: additionalData,
        } = await this.getLeads({
          start: prevContext.nextStart,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: leads?.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            nextStart: additionalData.next_start || false,
          },
        };
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "ID of the project this activity will be associated with",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.nextStart === false) {
          return [];
        }
        const {
          data: projects,
          additional_data: additionalData,
        } = await this.getProjects({
          start: prevContext.nextStart,
          limit: constants.DEFAULT_PAGE_LIMIT,
        });

        return {
          options: projects?.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            nextStart: additionalData.next_start || false,
          },
        };
      },
    },
  },
  methods: {
    api(model, version = "v1") {
      const config = new pd[version].Configuration({
        accessToken: this.$auth.oauth_access_token,
        basePath: `${this.$auth.api_domain}/api/${version}`,
      });
      return new pd[version][model](config);
    },
    getActivityTypes(opts) {
      const activityTypesApi = this.api("ActivityTypesApi");
      return activityTypesApi.getActivityTypes(opts);
    },
    getDeals(opts = {}) {
      const dealApi = this.api("DealsApi", "v2");
      return dealApi.getDeals(opts);
    },
    getPipelines(opts = {}) {
      const pipelineApi = this.api("PipelinesApi", "v2");
      return pipelineApi.getPipelines(opts);
    },
    getLeads(opts = {}) {
      const leadApi = this.api("LeadsApi");
      return leadApi.getLeads(opts);
    },
    getProjects(opts = {}) {
      const projectApi = this.api("ProjectsApi");
      return projectApi.getProjects(opts);
    },
    getOrganizations(opts = {}) {
      const organizationApi = this.api("OrganizationsApi", "v2");
      return organizationApi.getOrganizations(opts);
    },
    getPersons(opts = {}) {
      const personApi = this.api("PersonsApi", "v2");
      return personApi.getPersons(opts);
    },
    getUsers(opts) {
      const UsersApi = this.api("UsersApi");
      return UsersApi.getUsers(opts);
    },
    getStages(opts) {
      const stagesApi = this.api("StagesApi", "v2");
      return stagesApi.getStages(opts);
    },
    addActivity(opts = {}) {
      const activityApi = this.api("ActivitiesApi", "v2");
      return activityApi.addActivity({
        AddActivityRequest: opts,
      });
    },
    addNote(opts = {}) {
      const noteApi = this.api("NotesApi");
      return noteApi.addNote({
        AddNoteRequest: opts,
      });
    },
    addDeal(opts = {}) {
      const dealsApi = this.api("DealsApi", "v2");
      return dealsApi.addDeal({
        AddDealRequest: opts,
      });
    },
    addOrganization(opts = {}) {
      const organizationApi = this.api("OrganizationsApi", "v2");
      return organizationApi.addOrganization({
        AddOrganizationRequest: opts,
      });
    },
    addPerson(opts = {}) {
      const personsApi = this.api("PersonsApi", "v2");
      return personsApi.addPerson({
        AddPersonRequest: opts,
      });
    },
    addWebhook(opts = {}) {
      const webhooksApi = this.api("WebhooksApi");
      return webhooksApi.addWebhook({
        AddWebhookRequest: opts,
      });
    },
    deleteWebhook(webhookId) {
      const webhooksApi = this.api("WebhooksApi");
      return webhooksApi.deleteWebhook({
        id: webhookId,
      });
    },
    searchPersons(opts = {}) {
      const personsApi = this.api("PersonsApi");
      return personsApi.searchPersons(opts);
    },
    updateDeal({
      dealId, ...opts
    }) {
      const dealsApi = this.api("DealsApi", "v2");
      return dealsApi.updateDeal({
        id: dealId,
        UpdateDealRequest: opts,
      });
    },
  },
};
