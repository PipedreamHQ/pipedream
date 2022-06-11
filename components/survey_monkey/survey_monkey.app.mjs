import { axios } from "@pipedream/platform";
import { v4 as uuid } from "uuid";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "survey_monkey",
  propDefinitions: {
    survey: {
      type: "string",
      label: "Survey",
      description: `Select a **Survey** from the list.
      \\
      Alternatively, you can provide a custom *Survey ID*.`,
      async options() {
        const { data } = await this.getSurveys();

        return data.map((survey) => ({
          label: survey.title,
          value: survey.id,
        }));
      },
    },
    responseId: {
      type: "string",
      label: "Response",
      description: `Select one of the above survey's *Responses* to get the details for.
      \\
      Alternatively, you can provide a custom *Response ID*.`,
      async options({ surveyId }) {
        const { data } = await this.getResponses({
          surveyId,
        });

        return data.map((response) => ({
          label: `(ID ${response.id})`,
          value: response.id,
        }));
      },
    },
    collectorId: {
      type: "string",
      label: "Collector",
      description: `Select one of the above survey's *Collectors* to get the details for.
      \\
      Alternatively, you can provide a custom *Collector ID*.`,
      async options({ surveyId }) {
        const { data } = await this.getCollectors({
          surveyId,
        });

        return data.map((collector) => ({
          label: collector.name || `(ID ${collector.id})`,
          value: collector.id,
        }));
      },
    },
    objectType: {
      type: "string",
      label: "Object type",
      description: `Object type to filter events by: survey or collector. 
        NOTE: Setting object_type to collector and event_type to collector_created will result in a 400 error. 
        Object type should not be provided for survey_created webhook`,
      options: [
        "survey",
        "collector",
      ],
      optional: false,
      default: "",
    },
    eventType: {
      type: "string",
      label: "Event types",
      description: "Event type that the webhook listens to",
      options: [
        ...constants.EVENT_TYPES,
        ...constants.ADDITIONAL_EVENT_TYPES,
      ],
    },
  },
  methods: {
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(customConfig) {
      const {
        $,
        url,
        path,
        method,
        params,
        data,
        ...otherConfig
      } =
        customConfig;

      const BASE_URL = constants.BASE_URL;

      const config = {
        method,
        url: url || `${BASE_URL}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
        params,
        data,
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async getUserInfo({ $ }) {
      return this._makeRequest({
        method: "GET",
        path: "/users/me",
        $,
      });
    },
    async getSurveys({ $ }) {
      return this._makeRequest({
        method: "GET",
        path: "/surveys",
        $,
      });
    },
    async getSurveyDetails({
      surveyId, $,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/surveys/${surveyId}/details`,
        $,
      });
    },
    async getResponses({
      surveyId, $,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/surveys/${surveyId}/responses`,
        $,
      });
    },
    async getResponseDetails({
      surveyId, responseId, $,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/surveys/${surveyId}/responses/${responseId}`,
        $,
      });
    },
    async getCollectors({
      surveyId, $,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/surveys/${surveyId ?? this.survey}/collectors`,
        $,
      });
    },
    async getCollectorDetails({
      collectorId, $,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/collectors/${collectorId}`,
        $,
      });
    },
    async deleteHook(hookId) {
      return await this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    getCollectorTypes() {
      return constants.EVENT_TYPES;
    },
    async createCustomHook({
      endpoint, eventType, objectType, objectIds,
    }) {
      const data = {
        name: `${eventType}_${uuid()}`,
        event_type: eventType,
        subscription_url: endpoint,
        object_ids: objectIds,
      };
      if (eventType != "survey_created") data.object_type = objectType;

      const { id } = await this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      return id;
    },
    async createHook(webhookUrl, surveyId) {
      const data = {
        name: `survey_created_${uuid()}`,
        event_type: "survey_created",
        subscription_url: webhookUrl,
      };

      if (surveyId) {
        data.name = `response_created_${uuid()}`;
        data.event_type = "response_created";
        data.object_type = "survey";
        data.object_ids = [
          surveyId,
        ];
      }

      const { id } = await this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      return id;
    },
  },
};
