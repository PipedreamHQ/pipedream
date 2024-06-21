import { axios } from "@pipedream/platform";
import decode from "html-entities-decoder";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "zoho_survey",
  propDefinitions: {
    portalId: {
      type: "string",
      label: "Portal",
      description: "Identifier of a portal",
      async options() {
        const portals = await this.listPortals();
        return portals?.map(({
          portalId: value, portalName: label,
        }) => ({
          value,
          label: decode(label),
        })) || [];
      },
    },
    groupId: {
      type: "string",
      label: "Department",
      description: "Unique identifier of a department",
      async options({ portalId }) {
        const portals = await this.listPortals();
        const portal = portals.find((portal) => portal.portalId === portalId);
        return portal.departments.map(({
          groupUniqueId: value, name: label,
        }) => ({
          value,
          label: decode(label),
        }));
      },
    },
    surveyId: {
      type: "string",
      label: "Survey",
      description: "Identifier of a survey",
      async options({
        portalId, groupId, page,
      }) {
        const limit = DEFAULT_LIMIT;
        const params = {
          filterby: "published",
          offset: limit,
          range: (limit * page) + 1,
        };
        const surveys = await this.listSurveys({
          portalId,
          groupId,
          params,
        });
        return surveys?.map(({
          id: value, name: label,
        }) => ({
          value,
          label: decode(label),
        })) || [];
      },
    },
    collectorId: {
      type: "string",
      label: "Collector",
      description: "Identifier of a collector",
      async options({
        portalId, groupId, surveyId,
      }) {
        const collectors = await this.listCollectors({
          portalId,
          groupId,
          surveyId,
        });
        return collectors?.map(({
          id: value, name: label,
        }) => ({
          value,
          label: decode(label),
        })) || [];
      },
    },
    distributionId: {
      type: "string",
      label: "Trigger Invitation",
      description: "Identifier of a distribution",
      async options({
        portalId, groupId, surveyId, collectorId,
      }) {
        const distributions = await this.listDistributions({
          portalId,
          groupId,
          surveyId,
          collectorId,
          params: {
            type: "trigger",
          },
        });
        return distributions?.map(({
          id: value, name: label,
        }) => ({
          value,
          label: decode(label),
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://survey.${this.$auth.base_api_uri}/survey/api/v1/private`;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _headers(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this._accessToken()}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    createWebhook({
      portalId, groupId, surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys/${surveyId}/webhooks`,
        method: "POST",
        headers: {
          "x-zoho-service": "pipedream",
        },
        ...args,
      });
    },
    deleteWebhook({
      portalId, groupId, surveyId, hookId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys/${surveyId}/webhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    listPortals(args = {}) {
      return this._makeRequest({
        path: "/portals",
        ...args,
      });
    },
    listSurveys({
      portalId, groupId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys`,
        ...args,
      });
    },
    listCollectors({
      portalId, groupId, surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys/${surveyId}/collectors/metainfo`,
        ...args,
      });
    },
    listDistributions({
      portalId, groupId, surveyId, collectorId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys/${surveyId}/collectors/${collectorId}/distributions/email/metainfo`,
        ...args,
      });
    },
    listEmailFields({
      portalId, groupId, surveyId, collectorId, distributionId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys/${surveyId}/collectors/${collectorId}/distributions/${distributionId}/email/fields`,
        ...args,
      });
    },
    sendEmailInvitation({
      portalId, groupId, surveyId, collectorId, distributionId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys/${surveyId}/collectors/${collectorId}/distributions/${distributionId}/email/sendinvitation`,
        method: "POST",
        ...args,
      });
    },
    listSurveyFields({
      portalId, groupId, surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/portals/${portalId}/departments/${groupId}/surveys/${surveyId}/integration/trigger/variables`,
        ...args,
      });
    },
  },
};
