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
      description: "Survey where the action will be performed.",
      async options() {
        const { data } = await this.getSurveys();

        return data.map((survey) => ({
          label: survey.title,
          value: survey.id,
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
    async getSurveys() {
      return await this._makeRequest({
        method: "GET",
        path: "/surveys",
      });
    },
    async getSurvey({
      $, surveyId,
    }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/surveys/${surveyId}/details`,
      });
    },
    async getCollectors({ surveyId }) {
      return await this._makeRequest({
        method: "GET",
        path: `/surveys/${surveyId || this.surveyId}/collectors`,
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
