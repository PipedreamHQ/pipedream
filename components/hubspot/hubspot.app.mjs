import { axios } from "@pipedream/platform";
import {
  API_PATH,
  BASE_URL,
  HUBSPOT_OWNER,
  OBJECT_TYPE,
  OBJECT_TYPES,
  DEFAULT_LIMIT,
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
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
        page, listType,
      }) {
        const { lists } = await this.getLists({
          listType,
          params: {
            count: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return lists?.map(({
          listId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    dealPipeline: {
      type: "string",
      label: "Pipeline",
      description: "Select the pipeline to watch for new deals in",
      async options() {
        const { results } = await this.getPipelines({
          objectType: "deal",
        });
        return results?.map(({
          id: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    stages: {
      type: "string[]",
      label: "Stages",
      description: "Select the stages to watch for new deals in.",
      async options({ pipeline }) {
        const { results } = await this.getDealStages({
          pipelineId: pipeline,
        });
        return results?.map(({
          id: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "Watch for new events concerning the object type specified.",
      async options() {
        return OBJECT_TYPES;
      },
    },
    objectSchema: {
      type: "string",
      label: "Object Schema",
      description: "Watch for new events of objects with the specified custom schema.",
      async options() {
        const { results } = await this.listSchemas();
        return results?.map(({
          objectTypeId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "Hubspot's internal ID for the contact",
      async options({
        objectType, ...opts
      }) {
        return objectType
          ? await this.createOptions(objectType, opts)
          : [];
      },
    },
    objectIds: {
      type: "string[]",
      label: "Object",
      description: "Watch for new events concerning the objects selected.",
      async options({
        objectType, ...opts
      }) { console.log(opts);
        return objectType
          ? await this.createOptions(objectType, opts)
          : [];
      },
    },
    forms: {
      type: "string[]",
      label: "Form",
      description: "Watch for new submissions of the specified forms.",
      withLabel: true,
      async options({ page }) {
        const results = await this.getForms({
          params: {
            count: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          guid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
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
        const { results: groups } = await this.getPropertyGroups({
          objectType,
        });
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
    contactProperties: {
      type: "string[]",
      label: "Contact Properties",
      description: "Select the properties to include in the contact object",
      optional: true,
      default: [],
      async options({ excludeDefaultProperties }) {
        const properties = await this.getContactProperties();
        const relevantProperties = excludeDefaultProperties
          ? properties.filter(({ name }) => !DEFAULT_CONTACT_PROPERTIES.includes(name))
          : properties;
        return relevantProperties?.map(({
          name: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    companyProperties: {
      type: "string[]",
      label: "Company Properties",
      description: "Select the properties to include in the company object",
      optional: true,
      default: [],
      async options({ excludeDefaultProperties }) {
        const { results: properties } = await this.getProperties({
          objectType: "companies",
        });
        const relevantProperties = excludeDefaultProperties
          ? properties.filter(({ name }) => !DEFAULT_COMPANY_PROPERTIES.includes(name))
          : properties;
        return relevantProperties?.map(({
          name: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    dealProperties: {
      type: "string[]",
      label: "Deal Properties",
      description: "Select the properties to include in the deal object",
      optional: true,
      default: [],
      async options({ excludeDefaultProperties }) {
        const { results: properties } = await this.getProperties({
          objectType: "deals",
        });
        const relevantProperties = excludeDefaultProperties
          ? properties.filter(({ name }) => !DEFAULT_DEAL_PROPERTIES.includes(name))
          : properties;
        return relevantProperties?.map(({
          name: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    ticketProperties: {
      type: "string[]",
      label: "Ticket Properties",
      description: "Select the properties to include in the ticket object",
      optional: true,
      default: [],
      async options({ excludeDefaultProperties }) {
        const { results: properties } = await this.getProperties({
          objectType: "tickets",
        });
        const relevantProperties = excludeDefaultProperties
          ? properties.filter(({ name }) => !DEFAULT_TICKET_PROPERTIES.includes(name))
          : properties;
        return relevantProperties?.map(({
          name: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    productProperties: {
      type: "string[]",
      label: "Product Properties",
      description: "Select the properties to include in the product object",
      optional: true,
      default: [],
      async options({ excludeDefaultProperties }) {
        const { results: properties } = await this.getProperties({
          objectType: "products",
        });
        const relevantProperties = excludeDefaultProperties
          ? properties.filter(({ name }) => !DEFAULT_PRODUCT_PROPERTIES.includes(name))
          : properties;
        return relevantProperties?.map(({
          name: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    lineItemProperties: {
      type: "string[]",
      label: "Line Item Properties",
      description: "Select the properties to include in the line item object",
      optional: true,
      default: [],
      async options({ excludeDefaultProperties }) {
        const { results: properties } = await this.getProperties({
          objectType: "line_items",
        });
        const relevantProperties = excludeDefaultProperties
          ? properties.filter(({ name }) => !DEFAULT_LINE_ITEM_PROPERTIES.includes(name))
          : properties;
        return relevantProperties?.map(({
          name: value, label,
        }) => ({
          value,
          label,
        })) || [];
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
        if (!fromObjectType || !toObjectType) {
          return [];
        }
        const { results: associationTypes } = await this.getAssociationTypes({
          fromObjectType,
          toObjectType,
        });
        return associationTypes.map((associationType) => ({
          label: associationType.label ?? `${fromObjectType}_to_${toObjectType}`,
          value: associationType.typeId,
        }));
      },
    },
    ticketPipeline: {
      type: "string",
      label: "Pipeline",
      description: "The pipeline of the ticket",
      async options() {
        const { results } = await this.getPipelines({
          objectType: "ticket",
        });
        return results?.map(({
          id: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    ticketStage: {
      type: "string",
      label: "Ticket Stage",
      description: "The stage of the ticket",
      async options({ pipelineId }) {
        const stages = await this.getTicketStages({
          pipelineId,
        });
        return stages.map(({
          id: value, label,
        }) => ({
          value,
          label,
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
    makeRequest({
      $ = this,
      api,
      endpoint,
      ...otherOpts
    }) {
      return axios($, {
        url: `${BASE_URL}${api}${endpoint}`,
        headers: this._getHeaders(),
        ...otherOpts,
      });
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
    getCompaniesOptions(opts) {
      return this.createOptions(OBJECT_TYPE.COMPANY, opts);
    },
    getContactsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.CONTACT, opts);
    },
    getLineItemsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.LINE_ITEM, opts);
    },
    getTicketsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.TICKET, opts);
    },
    getQuotesOptions(opts) {
      return this.createOptions(OBJECT_TYPE.QUOTE, opts);
    },
    getCallsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.CALL, opts);
    },
    getTasksOptions(opts) {
      return this.createOptions(OBJECT_TYPE.TASK, opts);
    },
    getNotesOptions(opts) {
      return this.createOptions(OBJECT_TYPE.NOTE, opts);
    },
    getMeetingsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.MEETING, opts);
    },
    getEmailsOptions(opts) {
      return this.createOptions(OBJECT_TYPE.EMAIL, opts);
    },
    async getOwnersOptions(params) {
      const { results } = await this.getOwners({
        params,
      });
      return results.map((object) => ({
        label: object.email,
        value: object.id,
      }));
    },
    searchCRM({
      object, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        method: "POST",
        endpoint: `/objects/${object}/search`,
        ...opts,
      });
    },
    getBlogPosts(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CMS,
        endpoint: "/blogs/posts",
        ...opts,
      });
    },
    getContactProperties(opts = {}) {
      return this.makeRequest({
        api: API_PATH.PROPERTIES,
        endpoint: "/contacts/properties",
        ...opts,
      });
    },
    getDealProperties(opts = {}) {
      return this.makeRequest({
        api: API_PATH.PROPERTIES,
        endpoint: "/deals/properties",
        ...opts,
      });
    },
    getDealStages({
      pipelineId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/pipelines/deal/${pipelineId}/stages`,
        ...opts,
      });
    },
    async getTicketStages({ pipelineId }) {
      const { results: pipelines } = await this.getPipelines({
        objectType: "ticket",
      });
      const { stages } = pipelines.find(({ id }) => id == pipelineId);
      return stages;
    },
    getEmailEvents(opts = {}) {
      return this.makeRequest({
        api: API_PATH.EMAIL,
        endpoint: "/events",
        ...opts,
      });
    },
    getEngagements(opts = {}) {
      return this.makeRequest({
        api: API_PATH.ENGAGEMENTS,
        endpoint: "/engagements/paged",
        ...opts,
      });
    },
    getEvents(opts = {}) {
      return this.makeRequest({
        api: API_PATH.EVENTS,
        endpoint: "/events",
        ...opts,
      });
    },
    getForms(opts = {}) {
      return this.makeRequest({
        api: API_PATH.FORMS,
        endpoint: "/forms",
        ...opts,
      });
    },
    getFormSubmissions({
      formId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.FORM_INTEGRATIONS,
        endpoint: `/submissions/forms/${formId}`,
        ...opts,
      });
    },
    getLists({
      listType, ...opts
    }) {
      const basePath = "/lists";
      const path = listType
        ? `${basePath}/${listType}`
        : basePath;
      return this.makeRequest({
        api: API_PATH.CONTACTS,
        endpoint: path,
        ...opts,
      });
    },
    getListContacts({
      listId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CONTACTS,
        endpoint: `/lists/${listId}/contacts/all`,
        ...opts,
      });
    },
    getOwners(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/owners",
        ...opts,
      });
    },
    listObjectsInPage(objectType, after, params, $) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/${objectType}`,
        params: {
          after,
          ...params,
        },
        $,
      });
    },
    getContact({
      contactId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/contacts/${contactId}`,
        ...opts,
      });
    },
    getObject(objectType, objectId, properties, $) {
      const params = {
        properties: properties?.join(","),
      };
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/${objectType}/${objectId}`,
        params,
        $,
      });
    },
    getLineItem({
      lineItemId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/line_items/${lineItemId}`,
        ...opts,
      });
    },
    getPublishingChannels(opts = {}) {
      return this.makeRequest({
        api: API_PATH.BROADCAST,
        endpoint: "/channels/setting/publish/current",
        ...opts,
      });
    },
    getBroadcastMessages(opts = {}) {
      return this.makeRequest({
        api: API_PATH.BROADCAST,
        endpoint: "/broadcasts",
        ...opts,
      });
    },
    getEmailSubscriptionsTimeline(opts = {}) {
      return this.makeRequest({
        api: API_PATH.EMAIL,
        endpoint: "/subscriptions/timeline",
        ...opts,
      });
    },
    getPipelines({
      objectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/pipelines/${objectType}`,
        ...opts,
      });
    },
    createObject({
      objectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/${objectType}`,
        method: "POST",
        ...opts,
      });
    },
    updateObject({
      objectType, objectId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/${objectType}/${objectId}`,
        method: "PATCH",
        ...opts,
      });
    },
    getPropertyGroups({
      objectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/properties/${objectType}/groups`,
        ...opts,
      });
    },
    getProperties({
      objectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/properties/${objectType}`,
        ...opts,
      });
    },
    listSchemas(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/schemas",
        ...opts,
      });
    },
    getSchema({
      objectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/schemas/${objectType}`,
        ...opts,
      });
    },
    searchFiles(opts = {}) {
      return this.makeRequest({
        api: API_PATH.FILES,
        endpoint: "/files/search",
        ...opts,
      });
    },
    getSignedUrl({
      fileId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.FILES,
        endpoint: `/files/${fileId}/signed-url`,
        ...opts,
      });
    },
    addContactsToList({
      listId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CONTACTS,
        endpoint: `/lists/${listId}/add`,
        method: "POST",
        ...opts,
      });
    },
    getAssociationTypes({
      fromObjectType, toObjectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV4,
        endpoint: `/associations/${fromObjectType}/${toObjectType}/labels`,
        ...opts,
      });
    },
    createAssociation({
      fromObjectType, toObjectType, fromId, toId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV4,
        endpoint: `/objects/${fromObjectType}/${fromId}/associations/${toObjectType}/${toId}`,
        ...opts,
      });
    },
    createAssociations({
      fromObjectType, toObjectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV4,
        endpoint: `/associations/${fromObjectType}/${toObjectType}/batch/create`,
        method: "POST",
        ...opts,
      });
    },
    listWorkflows(opts = {}) {
      return this.makeRequest({
        api: API_PATH.AUTOMATION,
        endpoint: "/workflows",
        ...opts,
      });
    },
    addContactsIntoWorkflow({
      workflowId, contactEmail, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.AUTOMATION,
        endpoint: `/workflows/${workflowId}/enrollments/contacts/${contactEmail}`,
        method: "POST",
        ...opts,
      });
    },
    batchCreateContacts(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/contacts/batch/create",
        method: "POST",
        ...opts,
      });
    },
    batchUpdateContacts(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/contacts/batch/update",
        method: "POST",
        ...opts,
      });
    },
    getDeal({
      dealId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.DEAL,
        endpoint: `/deal/${dealId}`,
        ...opts,
      });
    },
    getMemberships({
      objectType, objectId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/lists/records/${objectType}/${objectId}/memberships`,
        ...opts,
      });
    },
    translateLegacyListId(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/lists/idmapping",
        ...opts,
      });
    },
    batchGetObjects({
      objectType, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/${objectType}/batch/read`,
        method: "POST",
        ...opts,
      });
    },
  },
};
