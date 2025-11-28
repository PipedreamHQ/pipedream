import { axios } from "@pipedream/platform";
import Bottleneck from "bottleneck";
import {
  API_PATH,
  BASE_URL,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_LIMIT,
  DEFAULT_LINE_ITEM_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  HUBSPOT_OWNER,
  OBJECT_TYPE,
  OBJECT_TYPES,
} from "./common/constants.mjs";
const limiter = new Bottleneck({
  minTime: 500, // 2 requests per second
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

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
      description: "Watch for new events concerning the object type specified. For custom objects, this is the object's `fullyQualifiedName`, `objectTypeId`, or the short-hand custom object type name (aka `p_{object_name}`)",
      async options({ includeCustom = false }) {
        const objectTypes = OBJECT_TYPES;
        if (includeCustom) {
          const { results } = await this.listSchemas();
          const customObjects = results?.map(({
            fullyQualifiedName: value, labels,
          }) => ({
            value,
            label: labels.plural,
          })) || [];
          objectTypes.push(...customObjects);
        }
        return objectTypes;
      },
    },
    objectSchema: {
      type: "string",
      label: "Object Schema",
      description: "Watch for new events of objects with the specified custom schema. This is the `objectTypeId` of an object.",
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
      useQuery: true,
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
      useQuery: true,
      async options({
        objectType, ...opts
      }) {
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
      useQuery: true,
      async options({
        prevContext, query,
      }) {
        const { nextAfter } = prevContext;
        const {
          results: contacts,
          paging,
        } = await this.searchCRM({
          object: "contacts",
          data: {
            after: nextAfter,
            query,
          },
        });
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
    fileId: {
      type: "string",
      label: "File ID",
      description: "The ID of a file uploaded to HubSpot",
      async options() {
        const { results: files } = await this.searchFiles();
        return files.map((file) => ({
          label: file.name,
          value: file.id,
        }));
      },
    },
    associationType: {
      type: "integer",
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
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The identifier of the lead",
      useQuery: true,
      async options({ query }) {
        const { results } = await this.searchCRM({
          object: "lead",
          data: {
            properties: [
              "hs_lead_name",
            ],
            query,
          },
        });
        return results?.map(({
          id: value, properties,
        }) => ({
          value,
          label: properties?.hs_lead_name || value,
        })) || [];
      },
    },
    customObjectType: {
      type: "string",
      label: "Custom Object Type",
      description: "The type of custom object to create. This is the object's `fullyQualifiedName`, `objectTypeId`, or the short-hand custom object type name (aka `p_{object_name}`)",
      async options() {
        const { results } = await this.listSchemas();
        return results?.map(({
          name, fullyQualifiedName,
        }) => ({
          label: name,
          value: fullyQualifiedName,
        }) ) || [];
      },
    },
    timeframe: {
      type: "string",
      label: "Time Frame",
      description: "Filter meetings within a specific time frame",
      optional: true,
      reloadProps: true,
      options: [
        {
          label: "Today",
          value: "today",
        },
        {
          label: "This Week",
          value: "this_week",
        },
        {
          label: "This Month",
          value: "this_month",
        },
        {
          label: "Last Month",
          value: "last_month",
        },
        {
          label: "Custom Range",
          value: "custom",
        },
      ],
    },
    mostRecent: {
      type: "boolean",
      label: "Most Recent Only",
      description: "Only return the most recent meeting",
      optional: true,
      default: false,
    },
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The ID of the meeting to retrieve",
      useQuery: true,
      async options({ query }) {
        const { results } = await this.searchMeetings({
          data: {
            query,
          },
        });
        return results.map(({ id }) => id);
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to update.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listForms({
          data: {
            after: nextAfter,
          },
        });

        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The ID of the page to clone.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listSitePages({
          data: {
            after: nextAfter,
          },
        });

        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    landingPageId: {
      type: "string",
      label: "Landing Page ID",
      description: "The ID of the landing page to clone.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listLandingPages({
          data: {
            after: nextAfter,
          },
        });

        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    templatePath: {
      type: "string",
      label: "Template Path",
      description: "The template path of the page.",
      async options({ page }) {
        const { objects } = await this.listTemplates({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return objects?.map(({
          path: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    pageName: {
      type: "string",
      label: "Page Name",
      description: "The name of the page.",
    },
    landingFolderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder to create the landing page in.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listLandingFolders({
          data: {
            after: nextAfter,
          },
        });
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign to create the email in.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listCampaigns({
          data: {
            after: nextAfter,
          },
        });
        return {
          options: results?.map(({ id }) => id) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    emailId: {
      type: "string",
      label: "Marketing Email ID",
      description: "The ID of the marketing email to clone.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listMarketingEmails({
          data: {
            after: nextAfter,
          },
        });
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    inboxId: {
      type: "string",
      label: "Inbox ID",
      description: "The ID of an inbox",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listInboxes({
          data: {
            after: nextAfter,
          },
        });
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of a channel",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listChannels({
          data: {
            after: nextAfter,
          },
        });
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The ID of a thread",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listThreads({
          data: {
            after: nextAfter,
          },
        });
        return {
          options: results?.map(({ id }) => ({
            value: id,
            label: `Thread ${id}`,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    channelAccountId: {
      type: "string",
      label: "Channel Account ID",
      description: "The ID of a channel account",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results, paging,
        } = await this.listChannelAccounts({
          data: {
            after: nextAfter,
          },
        });
        return {
          options: results?.map(({
            id, name,
          }) => ({
            value: id,
            label: name,
          })) || [],
          context: {
            nextAfter: paging?.next.after,
          },
        };
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of workflow to create",
      options: [
        {
          label: "Drip Delay",
          value: "DRIP_DELAY",
        },
        {
          label: "Static Anchor",
          value: "STATIC_ANCHOR",
        },
        {
          label: "Property Anchor",
          value: "PROPERTY_ANCHOR",
        },
      ],
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "A list of objects representing the workflow actions. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/guide#action-types) for more information.",
      optional: true,
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    // Recursively trim string values in accordance with Hubspot's validation rules
    // https://developers.hubspot.com/changelog/breaking-change-enhanced-validations-for-non-string-properties-in-hubspots-crmobject-apis
    trimStringValues(obj) {
      if (typeof obj === "string") {
        return obj.trim();
      } else if (Array.isArray(obj)) {
        return obj.map(this.trimStringValues);
      } else if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj).map(([
            key,
            value,
          ]) => [
            key,
            this.trimStringValues(value),
          ]),
        );
      }
      return obj;
    },
    makeRequest({
      $ = this,
      api,
      endpoint,
      data,
      params,
      ...otherOpts
    }) {
      return axiosRateLimiter($, {
        url: `${BASE_URL}${api}${endpoint}`,
        headers: this._getHeaders(),
        data: data && this.trimStringValues(data),
        params: params && this.trimStringValues(params),
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
        query,
      } = opts;
      const { nextAfter } = prevContext;
      if (page !== 0 && !nextAfter) {
        return [];
      }
      const {
        paging,
        results,
      } = await this.searchCRM({
        object: referencedObjectType,
        data: {
          query,
          after: nextAfter,
        },
      });
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
    async getPipelinesOptions(objectType) {
      const { results } = await this.getPipelines({
        objectType,
      });
      return results?.map((pipeline) => ({
        label: pipeline.label,
        value: pipeline.id,
      })) || [];
    },
    async getPipelineStagesOptions(objectType, pipelineId) {
      if (!pipelineId) {
        return [];
      }
      const { stages } = await this.getPipeline({
        objectType,
        pipelineId,
      });
      return stages?.map((stage) => ({
        label: stage.label,
        value: stage.id,
      })) || [];
    },
    async getBusinessUnitOptions() {
      const { results } = await this.getBusinessUnits();
      return results?.map((unit) => ({
        label: unit.name,
        value: unit.id,
      })) || [];
    },
    async searchCRM({
      object, ...opts
    }) {
      // Adding retry logic here since the search endpoint specifically has a per-second rate limit
      const MAX_RETRIES = 5;
      const BASE_RETRY_DELAY = 500;
      let success = false;
      let retries = 0;
      while (!success) {
        try {
          const response = await this.makeRequest({
            api: API_PATH.CRMV3,
            method: "POST",
            endpoint: `/objects/${object}/search`,
            ...opts,
          });
          return response;
        } catch (error) {
          if (error.status === 429 && ++retries < MAX_RETRIES) {
            // Retry delays basically amount to:
            // 1000-1500 ms, 2000-2500 ms, 4000-4500 ms, 8000-8500 ms
            const randomDelay = Math.floor(Math.random() * BASE_RETRY_DELAY);
            const delay = BASE_RETRY_DELAY * (2 ** retries) + randomDelay;
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }
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
    getFormDefinition({
      formId, ...opts
    } = {}) {
      return this.makeRequest({
        api: API_PATH.MARKETINGV3,
        endpoint: `/forms/${formId}`,
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
      return this.makeRequest({
        api: API_PATH.CONTACTS,
        endpoint: `/lists${listType
          ? `/${listType}`
          : ""}`,
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
    getBusinessUnits(opts = {}) {
      return this.makeRequest({
        api: API_PATH.BUSINESS_UNITS,
        endpoint: `/business-units/user/${this.$auth.oauth_uid}`,
        ...opts,
      });
    },
    getPipeline({
      objectType, pipelineId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/pipelines/${objectType}/${pipelineId}`,
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
        api: API_PATH["AUTOMATIONV3"],
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
    getWorkflowEmails(opts = {}) {
      return this.makeRequest({
        api: API_PATH.AUTOMATIONV4,
        endpoint: "/flows/email-campaigns",
        ...opts,
      });
    },
    getWorkflowDetails({
      workflowId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.AUTOMATIONV3,
        endpoint: `/workflows/${workflowId}`,
        ...opts,
      });
    },
    createWorkflow(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.AUTOMATIONV3,
        endpoint: "/workflows",
        ...opts,
      });
    },
    deleteWorkflow({
      workflowId, ...opts
    }) {
      return this.makeRequest({
        method: "DELETE",
        api: API_PATH.AUTOMATIONV3,
        endpoint: `/workflows/${workflowId}`,
        ...opts,
      });
    },
    getMigratedWorkflowMappings(opts = {}) {
      return this.makeRequest({
        api: API_PATH.AUTOMATIONV4,
        endpoint: "/workflow-id-mappings/batch/read",
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
    async getListMembershipsByJoinOrder({
      listId, ...opts
    }) {
      const MAX_RETRIES = 5;
      const BASE_RETRY_DELAY = 500;
      let success = false;
      let retries = 0;
      while (!success) {
        try {
          const response = await this.makeRequest({
            api: API_PATH.CRMV3,
            endpoint: `/lists/${listId}/memberships/join-order`,
            ...opts,
          });
          return response;
        } catch (error) {
          if (error.status === 429 && ++retries < MAX_RETRIES) {
            const randomDelay = Math.floor(Math.random() * BASE_RETRY_DELAY);
            const delay = BASE_RETRY_DELAY * (2 ** retries) + randomDelay;
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }
    },
    async batchGetObjects({
      objectType, ...opts
    }) {
      const MAX_RETRIES = 5;
      const BASE_RETRY_DELAY = 500;
      let success = false;
      let retries = 0;
      while (!success) {
        try {
          const response = await this.makeRequest({
            api: API_PATH.CRMV3,
            endpoint: `/objects/${objectType}/batch/read`,
            method: "POST",
            ...opts,
          });
          return response;
        } catch (error) {
          if (error.status === 429 && ++retries < MAX_RETRIES) {
            const randomDelay = Math.floor(Math.random() * BASE_RETRY_DELAY);
            const delay = BASE_RETRY_DELAY * (2 ** retries) + randomDelay;
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }
    },
    listNotes(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/notes",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/tasks",
        ...opts,
      });
    },
    getAssociations({
      objectType, objectId, toObjectType, ...opts
    } = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV4,
        endpoint: `/objects/${objectType}/${objectId}/associations/${toObjectType}`,
        ...opts,
      });
    },
    /**
     * Get meeting by ID
     * @param {string} meetingId - The ID of the meeting to retrieve
     * @param {object} opts - Additional options to pass to the request
     * @returns {Promise<object>} The meeting object
     */
    getMeeting({
      meetingId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/meetings/${meetingId}`,
        ...opts,
      });
    },
    /**
     * Create a new meeting
     * @param {object} opts - The meeting data and request options
     * @returns {Promise<object>} The created meeting object
     */
    createMeeting(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/meetings",
        method: "POST",
        ...opts,
      });
    },
    /**
     * Search meetings using a filter
     * @param {object} opts - Search parameters and request options
     * @returns {Promise<object>} Search results
     */
    searchMeetings(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/meetings/search",
        method: "POST",
        ...opts,
      });
    },
    listPages(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CMS,
        endpoint: "/pages/site-pages",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CONTENT,
        endpoint: "/templates",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this.makeRequest({
        api: API_PATH.MARKETINGV3,
        endpoint: "/campaigns",
        ...opts,
      });
    },
    listMarketingEmails(opts = {}) {
      return this.makeRequest({
        api: API_PATH.MARKETINGV3,
        endpoint: "/emails",
        ...opts,
      });
    },
    listMarketingEvents(opts = {}) {
      return this.makeRequest({
        api: API_PATH.MARKETINGV3,
        endpoint: "/marketing-events/",
        ...opts,
      });
    },
    listMarketingForms(opts = {}) {
      return this.makeRequest({
        api: API_PATH.MARKETINGV3,
        endpoint: "/forms",
        ...opts,
      });
    },
    getSubscriptionPreferences({
      email, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.COMMUNICATION_PREFERENCES,
        endpoint: `/statuses/${email}`,
        ...opts,
      });
    },
    createForm(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.MARKETINGV3,
        endpoint: "/forms",
        ...opts,
      });
    },
    updateForm({
      formId, ...opts
    }) {
      return this.makeRequest({
        method: "PATCH",
        api: API_PATH.MARKETINGV3,
        endpoint: `/forms/${formId}`,
        ...opts,
      });
    },
    listForms(opts = {}) {
      return this.makeRequest({
        api: API_PATH.MARKETINGV3,
        endpoint: "/forms",
        ...opts,
      });
    },
    listSitePages(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CMS,
        endpoint: "/pages/site-pages",
        ...opts,
      });
    },
    listLandingPages(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CMS,
        endpoint: "/pages/landing-pages",
        ...opts,
      });
    },
    cloneSitePage(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.CMS,
        endpoint: "/pages/site-pages/clone",
        ...opts,
      });
    },
    createPage(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.CMS,
        endpoint: "/pages/site-pages",
        ...opts,
      });
    },
    updatePage({
      pageId, ...opts
    }) {
      return this.makeRequest({
        method: "PATCH",
        api: API_PATH.CMS,
        endpoint: `/pages/site-pages/${pageId}`,
        ...opts,
      });
    },
    createLandingPage(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.CMS,
        endpoint: "/pages/landing-pages",
        ...opts,
      });
    },
    updateLandingPage({
      pageId, ...opts
    }) {
      return this.makeRequest({
        method: "PATCH",
        api: API_PATH.CMS,
        endpoint: `/pages/landing-pages/${pageId}`,
        ...opts,
      });
    },
    listLandingFolders(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CMS,
        endpoint: "/pages/landing-pages/folders",
        ...opts,
      });
    },
    createEmail(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.MARKETINGV3,
        endpoint: "/emails",
        ...opts,
      });
    },
    cloneEmail(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.MARKETINGV3,
        endpoint: "/emails/clone",
        ...opts,
      });
    },
    createContactWorkflow(opts = {}) {
      return this.makeRequest({
        method: "POST",
        api: API_PATH.AUTOMATIONV4,
        endpoint: "/flows",
        ...opts,
      });
    },
    async getContactWithAllProperties({
      contactId, ...opts
    }) {
      const properties = await this.getContactProperties();
      const allPropertyNames = properties.map((prop) => prop.name);

      return this.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/objects/contacts/${contactId}`,
        params: {
          properties: allPropertyNames.join(","),
        },
        ...opts,
      });
    },
    async batchGetContactsWithAllProperties({
      contactIds, ...opts
    }) {
      const properties = await this.getContactProperties();
      const allPropertyNames = properties.map((prop) => prop.name);

      return this.batchGetObjects({
        objectType: "contacts",
        data: {
          inputs: contactIds.map((id) => ({
            id,
          })),
          properties: allPropertyNames,
        },
        ...opts,
      });
    },
    getInbox({
      inboxId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: `/conversations/inboxes/${inboxId}`,
        ...opts,
      });
    },
    getChannel({
      channelId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: `/conversations/channels/${channelId}`,
        ...opts,
      });
    },
    listInboxes(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: "/conversations/inboxes",
        ...opts,
      });
    },
    listChannels(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: "/conversations/channels",
        ...opts,
      });
    },
    listThreads(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: "/conversations/threads",
        ...opts,
      });
    },
    listMessages({
      threadId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: `/conversations/threads/${threadId}/messages`,
        ...opts,
      });
    },
    listChannelAccounts(opts = {}) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: "/conversations/channel-accounts",
        ...opts,
      });
    },
    createMessage({
      threadId, ...opts
    }) {
      return this.makeRequest({
        api: API_PATH.CONVERSATIONS,
        endpoint: `/conversations/threads/${threadId}/messages`,
        method: "POST",
        ...opts,
      });
    },
  },
};
