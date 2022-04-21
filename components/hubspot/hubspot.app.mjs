import { axios } from "@pipedream/platform";
import {
  ASSOCIATION_CATEGORY,
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
    stages: {
      type: "string[]",
      label: "Stages",
      description: "Select the stages to watch for new deals in.",
      withLabel: true,
      async options() {
        const results = await this.getDealStages();
        const options = results.results[0].stages.map((result) => {
          const {
            label,
            stageId,
          } = result;
          return {
            label,
            value: stageId,
          };
        });
        return options;
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
    async getDealStages($) {
      return this.makeGetRequest("/crm-pipelines/v1/pipelines/deal", $);
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
    async getOwners(params, $) {
      return this.makeGetRequest("/crm/v3/owners", params, $);
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
    async getObject(objectType, objectId, properties, $) {
      const params = {
        properties: properties?.join(","),
      };

      return this.makeGetRequest(
        `/crm/v3/objects/${objectType}/${objectId}`,
        params,
        $,
      );
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
    async createObject(objectType, properties, $) {
      return this.makePostRequest({
        endpoint: `/crm/v3/objects/${objectType}`,
        data: {
          properties,
        },
      }, $);
    },
    async getPropertyGroups(objectType, $) {
      return this.makeGetRequest(`/crm/v3/properties/${objectType}/groups`, null, $);
    },
    async getProperties(objectType, $) {
      return this.makeGetRequest(`/crm/v3/properties/${objectType}`, null, $);
    },
    async getSchema(objectType, $) {
      return this.makeGetRequest(`/crm/v3/schemas/${objectType}`, null, $);
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
      return this.makeGetRequest("/files/v3/files/search", params, $);
    },
    async getSignedUrl(fileId, params, $) {
      return this.makeGetRequest(`/files/v3/files/${fileId}/signed-url`, params, $);
    },
    async addContactsToList(listId, emails, $) {
      return this.makePostRequest({
        endpoint: `/contacts/v1/lists/${listId}/add`,
        data: {
          emails,
        },
      }, $);
    },
    async getAssociationTypes(fromObjectType, toObjectType, $) {
      return this.makeGetRequest(`/crm/v4/associations/${fromObjectType}/${toObjectType}/labels`, null, $);
    },
    async createAssociation(fromObjectType, toObjectType, fromId, toId, $) {
      return this.makeRequest(
        `/crm/v4/objects/${fromObjectType}/${fromId}/associations/${toObjectType}/${toId}`,
        {
          $,
        },
      );
    },
    async createAssociations(fromObjectType, toObjectType, fromId, toIds, associationTypeId, $) {
      return this.makePostRequest({
        endpoint: `/crm/v4/associations/${fromObjectType}/${toObjectType}/batch/create`,
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
      }, $);
    },
  },
};
