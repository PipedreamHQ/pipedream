import { axios } from "@pipedream/platform";
const DEFAULT_PAGE_SIZE = 100;

export default {
  type: "app",
  app: "questionpro",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization. Found in the Organization Settings.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({
        organizationId, page,
      }) {
        const { response } = await this.listUsers({
          organizationId,
          params: {
            page: page + 1,
            perPage: DEFAULT_PAGE_SIZE,
          },
        });
        return response?.map((user) => ({
          label: (`${user.firstName} ${user.lastName}`.trim() + `${user.email
            ? ` (${user.email})`
            : ""}`).trim(),
          value: user.userID,
        }));
      },
    },
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "The ID of the survey",
      async options({
        userId, page,
      }) {
        const { response } = await this.listSurveys({
          userId,
          params: {
            page: page + 1,
            perPage: DEFAULT_PAGE_SIZE,
          },
        });
        return response?.map((survey) => ({
          label: survey.name,
          value: survey.surveyID,
        }));
      },
    },
    emailListId: {
      type: "string",
      label: "Email List ID",
      description: "The ID of the email list",
      async options({
        surveyId, page,
      }) {
        const { response } = await this.listEmailLists({
          surveyId,
          params: {
            page: page + 1,
            perPage: DEFAULT_PAGE_SIZE,
          },
        });
        return response?.map((emailList) => ({
          label: emailList.name,
          value: emailList.emailListID,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template",
      async options({
        surveyId, page,
      }) {
        const { response } = await this.listEmailTemplates({
          surveyId,
          params: {
            page: page + 1,
            perPage: DEFAULT_PAGE_SIZE,
          },
        });
        return response?.map((template) => ({
          label: template.title,
          value: template.emailTemplateID,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.questionpro.com/a/api/v2`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    createWebhook({
      surveyId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/surveys/${surveyId}/webhooks`,
        ...opts,
      });
    },
    deleteWebhook({
      surveyId, webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/surveys/${surveyId}/webhooks/${webhookId}`,
        ...opts,
      });
    },
    listUsers({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/users`,
        ...opts,
      });
    },
    listSurveys({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}/surveys`,
        ...opts,
      });
    },
    listEmailLists({
      surveyId, ...opts
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}/emaillists`,
        ...opts,
      });
    },
    listEmailTemplates({
      surveyId, ...opts
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}/templates`,
        ...opts,
      });
    },
    createContact({
      surveyId, emailListId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/surveys/${surveyId}/emaillists/${emailListId}/emails`,
        ...opts,
      });
    },
    sendSurvey({
      surveyId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/surveys/${surveyId}/batches`,
        ...opts,
      });
    },
  },
};
