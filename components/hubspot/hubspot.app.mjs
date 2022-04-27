import { axios } from "@pipedream/platform";
import {
  OBJECT_TYPE,
  OBJECT_TYPES,
  HUBSPOT_OWNER,
} from "./common/object-types.mjs";

export default {
  type: "app",
  app: "hubspot",
  propDefinitions: {
    lists: {
      type: "string[]",
      label: "Lists",
      description: "Select the lists to watch for new contacts.",
      withLabel: true,
      async options({
        prevContext, listType,
      }) {
        const { offset = 0 } = prevContext;
        const params = {
          count: 250,
          offset,
        };
        const { lists } = await this.getLists({
          listType,
          ...params,
        });
        const options = lists.map((result) => {
          const {
            name: label,
            listId,
          } = result;
          return {
            label,
            value: listId,
          };
        });
        return {
          options,
          context: {
            offset: params.offset + params.count,
          },
        };
      },
    },
    dealPipeline: {
      type: "string",
      label: "Pipeline",
      description: "Select the pipeline to watch for new deals in",
      async options() {
        const { results } = await this.getPipelines("deal");
        return results.map((result) => {
          const {
            label,
            id: value,
          } = result;
          return {
            label,
            value,
          };
        });
      },
    },
    stages: {
      type: "string[]",
      label: "Stages",
      description: "Select the stages to watch for new deals in.",
      withLabel: true,
      async options({ pipeline }) {
        const { results } = await this.getDealStages(pipeline);
        return results.map((result) => {
          const {
            label,
            id,
          } = result;
          return {
            label,
            value: id,
          };
        });
      },
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "Watch for new events concerning the object type specified.",
      options: OBJECT_TYPES,
    },
    objectIds: {
      type: "string[]",
      label: "Object",
      description: "Watch for new events concerning the objects selected.",
      async options({
        objectType, ...opts
      }) {
        return this.createOptions(objectType, opts);
      },
    },
    forms: {
      type: "string[]",
      label: "Form",
      description: "Watch for new submissions of the specified forms.",
      withLabel: true,
      async options(prevContext) {
        const { offset } = prevContext;
        const params = {
          count: 50,
          offset: offset || 0,
        };
        const results = await this.getForms();
        const options = results.map((result) => {
          const {
            name: label,
            guid,
          } = result;
          return {
            label,
            value: guid,
          };
        });
        return {
          options,
          context: {
            offset: params.offset + params.count,
          },
        };
      },
    },
    channel: {
      type: "string",
      label: "Social Media Channel",
      description: "Watch for new events from the specified channel",
      async options() {
        const channels = await this.getPublishingChannels();
        return channels.map((channel) => {
          const {
            accountType,
            username,
            channelKey: value,
          } = channel;
          const label = `${accountType} ${username}`;
          return {
            label,
            value,
          };
        });
      },
    },
  },
  methods: {
    _getBaseURL() {
      return "https://api.hubapi.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async makeRequest(endpoint, opts = {}) {
      const {
        method = "GET",
        params,
        data,
        $,
      } = opts;
      const config = {
        method,
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    async makeGetRequest(endpoint, params = null, $) {
      return this.makeRequest(endpoint, {
        params,
        $,
      });
    },
    async makePostRequest({
      endpoint, data,
    }, $) {
      return this.makeRequest(endpoint, {
        method: "POST",
        data,
        $,
      });
    },
    /**
     * Returns the object type name of a CRM object to be used in Hubspot API
     * calls
     *
     * {@see {@link https://developers.hubspot.com/docs/cms/data/crm-objects CRM Object}
     *
     * @param {string} objectSlug - The object type's plural label or fully qualified
     * name
     * @returns The object type name
     */
    getObjectTypeName(objectSlug) {
      if (!objectSlug.endsWith("s")) {
        return objectSlug.toLowerCase();
      }
      if (objectSlug === "companies") {
        return "company";
      }
      return objectSlug.toLowerCase().slice(0, -1);
    },
    /**
     * Returns a label for a CRM object, intended to be used as the label for
     * prop options
     *
     * @param {object} object - The CRM object to get a label for
     * @param {string} objectSlug - The object type's plural label or fully
     * qualified name
     * @returns A label for the object
     */
    getObjectLabel(object, objectSlug) {
      const {
        id,
        properties,
      } = object;
      const objectName = this.getObjectTypeName(objectSlug);
      switch (objectName) {
      case OBJECT_TYPE.COMPANY:
        return properties.name;
      case OBJECT_TYPE.CONTACT:
        return `${properties.firstname} ${properties.lastname}`;
      case OBJECT_TYPE.DEAL:
        return properties.dealname;
      case OBJECT_TYPE.LINE_ITEM:
        return properties.name;
      case OBJECT_TYPE.TICKET:
        return properties.subject;
      case OBJECT_TYPE.QUOTE:
        return properties.hs_title ?? id;
      case HUBSPOT_OWNER:
        return properties.email;
      case OBJECT_TYPE.CALL:
        return properties.hs_call_title ?? id;
      case OBJECT_TYPE.MEETING:
        return properties.hs_meeting_title ?? id;
      case OBJECT_TYPE.EMAIL:
        return properties.hs_email_subject ?? id;
      case OBJECT_TYPE.TASK:
        return properties.hs_task_subject ?? id;
      case OBJECT_TYPE.NOTE:
        return properties.hs_note_body;
      default:
        return id;
      }
    },
    async searchCRM({
      object, ...data
    }, $) {
      const config = {
        method: "POST",
        url: `${this._getBaseURL()}/crm/v3/objects/${object}/search`,
        headers: this._getHeaders(),
        data,
      };
      return axios($ ?? this, config);
    },
    async getBlogPosts(params, $) {
      return this.makeGetRequest("/cms/v3/blogs/posts", params, $);
    },
    async getCalendarTasks(endDate, $) {
      const params = {
        startDate: Date.now(),
        endDate,
      };
      return this.makeGetRequest("/calendar/v1/events/task", params, $);
    },
    async getContactProperties($) {
      return this.makeGetRequest("/properties/v1/contacts/properties", $);
    },
    async createPropertiesArray($) {
      const allProperties = await this.getContactProperties($);
      return allProperties.map((property) => property.name);
    },
    async getDealProperties($) {
      return this.makeGetRequest("/properties/v1/deals/properties", $);
    },
    async getDealStages(pipelineId, $) {
      return this.makeGetRequest(`/crm/v3/pipelines/deal/${pipelineId}/stages`, $);
    },
    async getEmailEvents(params, $) {
      return this.makeGetRequest("/email/public/v1/events", params, $);
    },
    async getEngagements(params, $) {
      return this.makeGetRequest(
        "/engagements/v1/engagements/paged",
        params,
        $,
      );
    },
    async getEvents(params, $) {
      return this.makeGetRequest("/events/v3/events", params, $);
    },
    async getForms(params, $) {
      return this.makeGetRequest("/forms/v2/forms", params, $);
    },
    async getFormSubmissions({
      formId, ...params
    }, $) {
      return this.makeGetRequest(
        `/form-integrations/v1/submissions/forms/${formId}`,
        params,
        $,
      );
    },
    async getLists(params, $) {
      const {
        listType,
        ...otherParams
      } = params;
      const basePath = "/contacts/v1/lists";
      const path = listType
        ? `${basePath}/${listType}`
        : basePath;
      return this.makeGetRequest(path, otherParams, $);
    },
    async getListContacts(params, listId, $) {
      return this.makeGetRequest(
        `/contacts/v1/lists/${listId}/contacts/all`,
        params,
        $,
      );
    },
    async listObjectsInPage(objectType, after, params, $) {
      return this.makeGetRequest(`/crm/v3/objects/${objectType}`, {
        after,
        ...params,
      }, $);
    },
    async getObjects(objectType, $) {
      const params = {
        limit: 100,
      };
      let results = null;
      const objects = [];
      while (!results || params.next) {
        results = await this.makeGetRequest(
          `/crm/v3/objects/${objectType}`,
          params,
          $,
        );
        params.next = results.paging?.next?.after;
        for (const result of results.results) {
          objects.push(result);
        }
      }
      return objects;
    },
    async getContact(contactId, properties, $) {
      const params = {
        properties,
      };
      return this.makeGetRequest(
        `/crm/v3/objects/contacts/${contactId}`,
        params,
        $,
      );
    },
    async getLineItem(lineItemId, $) {
      return this.makeGetRequest(
        `/crm/v3/objects/line_items/${lineItemId}`,
        $,
      );
    },
    async getPublishingChannels($) {
      return this.makeGetRequest(
        "/broadcast/v1/channels/setting/publish/current",
        $,
      );
    },
    async getBroadcastMessages(params, $) {
      return this.makeGetRequest(
        "/broadcast/v1/broadcasts",
        params,
        $,
      );
    },
    async getEmailSubscriptionsTimeline(params, $) {
      return this.makeGetRequest(
        "/email/public/v1/subscriptions/timeline",
        params,
        $,
      );
    },
    async getPipelines(objectType, $) {
      return this.makeGetRequest(`/crm/v3/pipelines/${objectType}`, $);
    },
    /**
     * Returns a list of prop options for a CRM object type
     *
     * @param {*} referencedObjectType The object type to
     * @param {object} [opts = {}] - an object representing configuration
     * options used to create prop options, intended to be passed from the first
     * argument of the prop's async options
     * @returns a list of prop options
     */
    async createOptions(referencedObjectType, opts = {}) {
      const {
        prevContext,
        page,
      } = opts;
      const { nextAfter } = prevContext;
      if (page !== 0 && !nextAfter) {
        return [];
      }
      const {
        paging,
        results,
      } = await this.listObjectsInPage(referencedObjectType, nextAfter);
      return {
        options: results.map((object) => ({
          label: this.getObjectLabel(object, referencedObjectType) ?? object.id,
          value: object.id,
        })),
        context: {
          nextAfter: paging?.next.after,
        },
      };
    },
  },
};
