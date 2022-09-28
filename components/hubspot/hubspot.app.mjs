import { axios } from "@pipedream/platform";
import {
  API_PATH,
  ASSOCIATION_CATEGORY,
  BASE_URL,
  HUBSPOT_OWNER,
  OBJECT_TYPE,
  OBJECT_TYPES,
} from "./common/constants.mjs";

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
    objectId: {
      type: "string",
      label: "Object ID",
      description: "Hubspot's internal ID for the contact",
      async options({
        objectType, ...opts
      }) {
        return this.createOptions(objectType, opts);
      },
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
    // eslint-disable-next-line pipedream/props-description
    propertyGroups: {
      type: "string[]",
      label: "Property Groups",
      reloadProps: true,
      async options({ objectType }) {
        const { results: groups } = await this.getPropertyGroups(objectType);
        return groups.map((group) => ({
          label: group.label,
          value: group.name,
        }));
      },
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results: contacts,
          paging,
        } = await this.listObjectsInPage("contacts", nextAfter);
        return {
          options: contacts
            .filter(({ properties }) => properties.email)
            .map(({ properties }) => ({
              label: `${properties.firstname} ${properties.lastname}`,
              value: `${properties.email}`,
            })),
          context: {
            nextAfter: paging?.next?.after,
          },
        };
      },
    },
    workflow: {
      type: "string",
      label: "Workflow",
      description: "The ID of the workflow you wish to see metadata for.",
      async options() {
        const { workflows } = await this.listWorkflows();
        return {
          options: workflows.map(({
            name: label, id: value,
          }) => ({
            label,
            value,
          })),
        };
      },
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL returned after a file has been uploaded to a HubSpot Form",
      async options() {
        const { results: files } = await this.searchFiles();
        return files.map((file) => ({
          label: file.name,
          value: file.url,
        }));
      },
    },
    associationType: {
      type: "string",
      label: "Association Type",
      description: "Type of the association",
      async options({
        fromObjectType, toObjectType,
      }) {
        const { results: associationTypes } = await this.getAssociationTypes(
          fromObjectType,
          toObjectType,
        );
        return associationTypes.map((associationType) => ({
          label: associationType.label ?? `${fromObjectType}_to_${toObjectType}`,
          value: associationType.typeId,
        }));
      },
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async makeRequest(api, endpoint, opts = {}) {
      const {
        method = "GET",
        params,
        data,
        $,
      } = opts;
      const config = {
        method,
        url: `${BASE_URL}${api}${endpoint}`,
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    getObjectTypeName(objectType) {
      if (!objectType.endsWith("s")) {
        return objectType.toLowerCase();
      }
      if (objectType === "companies") {
        return "company";
      }
      return objectType.toLowerCase().slice(0, -1);
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
      switch (objectSlug) {
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
      return this.makeRequest(API_PATH.CRMV3, `/objects/${object}/search`, {
        method: "POST",
        data,
        $,
      });
    },
    async getBlogPosts(params, $) {
      return this.makeRequest(API_PATH.CMS, "/blogs/posts", {
        params,
        $,
      });
    },
    async getCalendarTasks(endDate, $) {
      const params = {
        startDate: Date.now(),
        endDate,
      };
      return this.makeRequest(API_PATH.CALENDAR, "/events/task", {
        params,
        $,
      });
    },
    async getContactProperties($) {
      return this.makeRequest(API_PATH.PROPERTIES, "/contacts/properties", {
        $,
      });
    },
    async createPropertiesArray($) {
      const allProperties = await this.getContactProperties($);
      return allProperties.map((property) => property.name);
    },
    async getDealProperties($) {
      return this.makeRequest(API_PATH.PROPERTIES, "/deals/properties", {
        $,
      });
    },
    async getDealStages(pipelineId, $) {
      return this.makeRequest(API_PATH.CRMV3, `/pipelines/deal/${pipelineId}/stages`, {
        $,
      });
    },
    async getEmailEvents(params, $) {
      return this.makeRequest(API_PATH.EMAIL, "/events", {
        params,
        $,
      });
    },
    async getEngagements(params, $) {
      return this.makeRequest(
        API_PATH.ENGAGEMENTS,
        "/engagements/paged",
        {
          params,
          $,
        },
      );
    },
    async getEvents(params, $) {
      return this.makeRequest(API_PATH.EVENTS, "/events", {
        params,
        $,
      });
    },
    async getForms(params, $) {
      return this.makeRequest(API_PATH.FORMS, "/forms", {
        params,
        $,
      });
    },
    async getFormSubmissions({
      formId, ...params
    }, $) {
      return this.makeRequest(
        API_PATH.FORM_INTEGRATIONS,
        `/submissions/forms/${formId}`,
        {
          params,
          $,
        },
      );
    },
    async getLists(params, $) {
      const {
        listType,
        ...otherParams
      } = params;
      const basePath = "/lists";
      const path = listType
        ? `${basePath}/${listType}`
        : basePath;
      return this.makeRequest(API_PATH.CONTACTS, path, {
        params: otherParams,
        $,
      });
    },
    async getListContacts(params, listId, $) {
      return this.makeRequest(
        API_PATH.CONTACTS,
        `/lists/${listId}/contacts/all`,
        {
          params,
          $,
        },
      );
    },
    async getOwners(params, $) {
      return this.makeRequest(API_PATH.CRMV3, "/owners", {
        params,
        $,
      });
    },
    async listObjectsInPage(objectType, after, params, $) {
      return this.makeRequest(API_PATH.CRMV3, `/objects/${objectType}`, {
        params: {
          after,
          ...params,
        },
        $,
      });
    },
    async getObjects(objectType, $) {
      const params = {
        limit: 100,
      };
      let results = null;
      const objects = [];
      while (!results || params.next) {
        results = await this.makeRequest(
          API_PATH.CRMV3,
          `/objects/${objectType}`,
          {
            params,
            $,
          },
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
      return this.makeRequest(
        API_PATH.CRMV3,
        `/objects/contacts/${contactId}`,
        {
          params,
          $,
        },
      );
    },
    async getObject(objectType, objectId, properties, $) {
      const params = {
        properties: properties?.join(","),
      };

      return this.makeRequest(
        API_PATH.CRMV3,
        `/objects/${objectType}/${objectId}`,
        {
          params,
          $,
        },
      );
    },
    async getLineItem(lineItemId, $) {
      return this.makeRequest(
        API_PATH.CRMV3,
        `/objects/line_items/${lineItemId}`,
        {
          $,
        },
      );
    },
    async getPublishingChannels($) {
      return this.makeRequest(
        API_PATH.BROADCAST,
        "/channels/setting/publish/current",
        {
          $,
        },
      );
    },
    async getBroadcastMessages(params, $) {
      return this.makeRequest(
        API_PATH.BROADCAST,
        "/broadcasts",
        {
          params,
          $,
        },
      );
    },
    async getEmailSubscriptionsTimeline(params, $) {
      return this.makeRequest(
        API_PATH.EMAIL,
        "/subscriptions/timeline",
        {
          params,
          $,
        },
      );
    },
    async getPipelines(objectType, $) {
      return this.makeRequest(API_PATH.CRMV3, `/pipelines/${objectType}`, {
        $,
      });
    },
    async createObject(objectType, properties, $) {
      return this.makeRequest(
        API_PATH.CRMV3,
        `/objects/${objectType}`,
        {
          method: "POST",
          data: {
            properties,
          },
          $,
        },
      );
    },
    async updateObject(objectType, properties, objectId, $) {
      return this.makeRequest(
        API_PATH.CRMV3,
        `/objects/${objectType}/${objectId}`,
        {
          method: "PATCH",
          data: {
            properties,
          },
          $,
        },
      );
    },
    async getPropertyGroups(objectType, $) {
      return this.makeRequest(API_PATH.CRMV3, `/properties/${objectType}/groups`, {
        $,
      });
    },
    async getProperties(objectType, $) {
      return this.makeRequest(API_PATH.CRMV3, `/properties/${objectType}`, {
        $,
      });
    },
    async getSchema(objectType, $) {
      return this.makeRequest(API_PATH.CRMV3, `/schemas/${objectType}`, {
        $,
      });
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
    async getCompaniesOptions(opts) {
      return this.createOptions(OBJECT_TYPE.COMPANY, opts);
    },
    async getContactsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.CONTACT, opts);
    },
    async getLineItemsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.LINE_ITEM, opts);
    },
    async getTicketsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.TICKET, opts);
    },
    async getQuotesOptions(opts) {
      return this.createOptions(OBJECT_TYPE.QUOTE, opts);
    },
    async getCallsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.CALL, opts);
    },
    async getTasksOptions(opts) {
      return this.createOptions(OBJECT_TYPE.TASK, opts);
    },
    async getNotesOptions(opts) {
      return this.createOptions(OBJECT_TYPE.NOTE, opts);
    },
    async getMeetingsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.MEETING, opts);
    },
    async getEmailsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.EMAIL, opts);
    },
    async getOwnersOptions(params) {
      const { results } = await this.getOwners(params);
      return results.map((object) => ({
        label: object.email,
        value: object.id,
      }));
    },
    async searchFiles(params, $) {
      return this.makeRequest(API_PATH.FILES, "/files/search", {
        params,
        $,
      });
    },
    async getSignedUrl(fileId, params, $) {
      return this.makeRequest(API_PATH.FILES, `/files/${fileId}/signed-url`, {
        params,
        $,
      });
    },
    async addContactsToList(listId, emails, $) {
      return this.makeRequest(
        API_PATH.CONTACTS,
        `/lists/${listId}/add`,
        {
          method: "POST",
          data: {
            emails,
          },
          $,
        },
      );
    },
    async getAssociationTypes(fromObjectType, toObjectType, $) {
      return this.makeRequest(API_PATH.CRMV4, `/associations/${fromObjectType}/${toObjectType}/labels`, {
        $,
      });
    },
    async createAssociation(fromObjectType, toObjectType, fromId, toId, $) {
      return this.makeRequest(
        API_PATH.CRMV4,
        `/objects/${fromObjectType}/${fromId}/associations/${toObjectType}/${toId}`,
        {
          $,
        },
      );
    },
    async createAssociations(fromObjectType, toObjectType, fromId, toIds, associationTypeId, $) {
      return this.makeRequest(
        API_PATH.CRMV4,
        `/associations/${fromObjectType}/${toObjectType}/batch/create`,
        {
          method: "POST",
          data: {
            inputs: toIds.map((toId) => ({
              from: {
                id: fromId,
              },
              to: {
                id: toId,
              },
              types: [
                {
                  associationCategory: ASSOCIATION_CATEGORY.HUBSPOT_DEFINED,
                  associationTypeId: associationTypeId,
                },
              ],
            })),
          },
          $,
        },
      );
    },
    async listWorkflows() {
      return this.makeRequest(
        API_PATH.AUTOMATION,
        "/workflows",
      );
    },
    async addContactsIntoWorkflow(workflowId, contactEmail, $) {
      return this.makeRequest(
        API_PATH.AUTOMATION,
        `/workflows/${workflowId}/enrollments/contacts/${contactEmail}`,
        {
          $,
          method: "POST",
        },
      );
    },
  },
};
