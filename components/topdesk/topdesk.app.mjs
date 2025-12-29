import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "topdesk",
  propDefinitions: {
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "The UUID of the incident",
      async options({ prevContext }) {
        const { pageStart } = prevContext;
        if (pageStart === null) {
          return [];
        }
        const incidents = await this.listIncidents({
          params: {
            pageStart,
            pageSize: 100,
          },
        });
        return {
          options: incidents?.map((incident) => ({
            label: incident.briefDescription
              ? `${incident.number} - ${incident.briefDescription}`
              : incident.number,
            value: incident.id,
          })) || [],
          context: {
            pageStart: incidents.length === 100
              ? (pageStart || 0) + 100
              : null,
          },
        };
      },
    },
    knowledgeItemId: {
      type: "string",
      label: "Knowledge Item ID",
      description: "The UUID or number of the knowledge item",
      async options({ prevContext }) {
        const response = await this.listKnowledgeItems({
          params: {
            start: prevContext?.start || 0,
            page_size: 100,
          },
        });
        const items = response.item || [];
        return {
          options: items.map((item) => ({
            label: `${item.number} - ${item.translation?.content?.title || "Untitled"}`,
            value: item.id,
          })),
          context: {
            start: response.next
              ? (prevContext?.start || 0) + 100
              : null,
          },
        };
      },
    },
    operatorId: {
      type: "string",
      label: "Operator ID",
      description: "The UUID of the operator",
      async options({ prevContext }) {
        const operators = await this.listOperators({
          params: {
            start: prevContext?.start || 0,
            page_size: 100,
          },
        });
        return {
          options: operators?.map((operator) => ({
            label: operator.dynamicName || `${operator.firstName} ${operator.surName}`,
            value: operator.id,
          })) || [],
          context: {
            start: operators?.length === 100
              ? (prevContext?.start || 0) + 100
              : null,
          },
        };
      },
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The UUID of the person",
      async options({ prevContext }) {
        const persons = await this.listPersons({
          params: {
            start: prevContext?.start || 0,
            page_size: 100,
          },
        });
        return persons.map((person) => ({
          label: `${person.firstName} ${person.surName}`,
          value: person.id,
        })) || [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The UUID of the category",
      optional: true,
      async options() {
        const response = await this.listCategories();
        const items = response.item || [];
        return items.map((item) => ({
          label: item.parent
            ? `${item.parent.name} - ${item.name}`
            : item.name,
          value: item.id,
        }));
      },
    },
    subcategoryId: {
      type: "string",
      label: "Subcategory ID",
      description: "The UUID of the subcategory",
      optional: true,
      async options({ categoryId }) {
        if (!categoryId) {
          return [];
        }
        const response = await this.listCategories({
          params: {
            query: `parent.id==${categoryId}`,
          },
        });
        const items = response.item || [];
        return items.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    callTypeId: {
      type: "string",
      label: "Call Type ID",
      description: "The UUID of the call type",
      optional: true,
      async options() {
        const response = await this.listCallTypes();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    entryTypeId: {
      type: "string",
      label: "Entry Type ID",
      description: "The UUID of the entry type",
      optional: true,
      async options() {
        const response = await this.listEntryTypes();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    impactId: {
      type: "string",
      label: "Impact ID",
      description: "The UUID of the impact",
      optional: true,
      async options() {
        const response = await this.listImpacts();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    urgencyId: {
      type: "string",
      label: "Urgency ID",
      description: "The UUID of the urgency",
      optional: true,
      async options() {
        const response = await this.listUrgencies();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    priorityId: {
      type: "string",
      label: "Priority ID",
      description: "The UUID of the priority",
      optional: true,
      async options() {
        const response = await this.listPriorities();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    durationId: {
      type: "string",
      label: "Duration ID",
      description: "The UUID of the duration",
      optional: true,
      async options() {
        const response = await this.listDurations();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    slaId: {
      type: "string",
      label: "SLA ID",
      description: "The UUID of the SLA",
      optional: true,
      async options() {
        const response = await this.listSLAs();
        return response.results?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    processingStatusId: {
      type: "string",
      label: "Processing Status ID",
      description: "The UUID of the processing status",
      optional: true,
      async options() {
        const response = await this.listProcessingStatuses();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    closureCodeId: {
      type: "string",
      label: "Closure Code ID",
      description: "The UUID of the closure code",
      optional: true,
      async options() {
        const response = await this.listClosureCodes();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The UUID of the location",
      optional: true,
      async options() {
        const response = await this.listLocations({
          params: {
            pageSize: 100,
          },
        });
        return response.map((item) => ({
          label: item.name
            ? `${item.name}${item.roomNumber
              ? ` - ${item.roomNumber}`
              : ""}`
            : item.roomNumber || item.id,
          value: item.id,
        }));
      },
    },
    branchId: {
      type: "string",
      label: "Branch ID",
      description: "The UUID of the branch",
      optional: true,
      async options() {
        const response = await this.listBranches();
        return response.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    operatorGroupId: {
      type: "string",
      label: "Operator Group ID",
      description: "The UUID of the operator group",
      optional: true,
      async options({ prevContext }) {
        const response = await this.listOperatorGroups({
          params: {
            start: prevContext?.start || 0,
            page_size: 100,
          },
        });
        return {
          options: response.map((item) => ({
            label: item.groupName,
            value: item.id,
          })),
          context: {
            start: response.length === 100
              ? (prevContext?.start || 0) + 100
              : null,
          },
        };
      },
    },
    supplierId: {
      type: "string",
      label: "Supplier ID",
      description: "The UUID of the supplier",
      optional: true,
      async options({ prevContext }) {
        const response = await this.listSuppliers({
          params: {
            start: prevContext?.start || 0,
            page_size: 100,
          },
        });
        return {
          options: response.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          context: {
            start: response.length === 100
              ? (prevContext?.start || 0) + 100
              : null,
          },
        };
      },
    },
    objectName: {
      type: "string",
      label: "Object Name",
      description: "The UUID of the object (asset). Can only be set by operators.",
      optional: true,
      async options({ prevContext }) {
        const response = await this.listAssets({
          params: {
            pageStart: prevContext?.pageStart || 0,
            pageSize: 100,
            fields: "name",
            archived: false,
          },
        });
        const assets = response.dataSet || [];
        return {
          options: assets.map(({ name }) => name),
          context: {
            pageStart: assets.length === 100
              ? (prevContext?.pageStart || 0) + 100
              : null,
          },
        };
      },
    },
    briefDescription: {
      type: "string",
      label: "Brief Description",
      description: "Brief description of the incident (max 80 characters)",
      optional: true,
    },
    request: {
      type: "string",
      label: "Request",
      description: "The initial request text. HTML tags are supported: `<i>`, `<em>`, `<b>`, `<strong>`, `<u>`, `<br>`, `<h5>`, `<h6>`",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action text to add. HTML tags are supported: `<i>`, `<em>`, `<b>`, `<strong>`, `<u>`, `<br>`, `<h5>`, `<h6>`",
      optional: true,
    },
    actionInvisibleForCaller: {
      type: "boolean",
      label: "Action Invisible For Caller",
      description: "Whether the action is invisible for persons. Can only be set by operators.",
      optional: true,
    },
    externalNumber: {
      type: "string",
      label: "External Number",
      description: "External number (max 60 characters). Can only be set by operators.",
      optional: true,
    },
    targetDate: {
      type: "string",
      label: "Target Date",
      description: "Target date in ISO 8601 format (e.g., `2024-08-01T12:00:00.000+0200`). Can only be set by operators.",
      optional: true,
    },
    onHold: {
      type: "boolean",
      label: "On Hold",
      description: "Whether the incident is on hold. Can only be set by operators.",
      optional: true,
    },
    responded: {
      type: "boolean",
      label: "Responded",
      description: "Whether the incident is responded. SLM-licence is needed. Can only be set by operators.",
      optional: true,
    },
    responseDate: {
      type: "string",
      label: "Response Date",
      description: "Response date in ISO 8601 format. SLM-licence is needed. Can only be set by operators.",
      optional: true,
    },
    completed: {
      type: "boolean",
      label: "Completed",
      description: "Whether the incident is completed. Can only be set by operators.",
      optional: true,
    },
    completedDate: {
      type: "string",
      label: "Completed Date",
      description: "Completed date in ISO 8601 format. Can only be set by operators.",
      optional: true,
    },
    closed: {
      type: "boolean",
      label: "Closed",
      description: "Whether the incident is closed. Can only be set by operators.",
      optional: true,
    },
    closedDate: {
      type: "string",
      label: "Closed Date",
      description: "Closed date in ISO 8601 format. Can only be set by operators.",
      optional: true,
    },
    majorCall: {
      type: "boolean",
      label: "Major Call",
      description: "Whether the incident is a major call. Can only be set by operators.",
      optional: true,
    },
    publishToSsd: {
      type: "boolean",
      label: "Publish To SSD",
      description: "Whether to publish the incident to Self Service Desk. Can only be set by operators.",
      optional: true,
    },
    optionalFields1: {
      type: "object",
      label: "Optional Fields 1",
      description: "Optional fields tab 1 as a JSON object",
      optional: true,
    },
    optionalFields2: {
      type: "object",
      label: "Optional Fields 2",
      description: "Optional fields tab 2 as a JSON object",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.api_url}${path}`;
    },
    getAuth() {
      const {
        username,
        app_token: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        auth: this.getAuth(),
        ...opts,
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
    patch(opts = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...opts,
      });
    },
    listIncidents(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents",
        ...opts,
      });
    },
    getIncident({
      incidentId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/tas/api/incidents/id/${incidentId}`,
        ...opts,
      });
    },
    createIncident(opts = {}) {
      return this.post({
        path: "/tas/api/incidents",
        ...opts,
      });
    },
    updateIncident({
      incidentId, ...opts
    } = {}) {
      return this.patch({
        path: `/tas/api/incidents/id/${incidentId}`,
        ...opts,
      });
    },
    listKnowledgeItems(opts = {}) {
      return this._makeRequest({
        path: "/services/knowledge-base-v1/knowledgeItems",
        ...opts,
      });
    },
    getKnowledgeItem({
      itemId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/services/knowledge-base-v1/knowledgeItems/${itemId}`,
        ...opts,
      });
    },
    listKnowledgeItemStatuses(opts = {}) {
      return this._makeRequest({
        path: "/services/knowledge-base-v1/knowledgeItemStatuses",
        ...opts,
      });
    },
    listOperators(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/operators",
        ...opts,
      });
    },
    listPersons(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/persons",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/categories",
        ...opts,
      });
    },
    listCallTypes(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/call_types",
        ...opts,
      });
    },
    listEntryTypes(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/entry_types",
        ...opts,
      });
    },
    listImpacts(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/impacts",
        ...opts,
      });
    },
    listUrgencies(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/urgencies",
        ...opts,
      });
    },
    listPriorities(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/priorities",
        ...opts,
      });
    },
    listDurations(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/durations",
        ...opts,
      });
    },
    listSLAs(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/slas",
        ...opts,
      });
    },
    listProcessingStatuses(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/statuses",
        ...opts,
      });
    },
    listClosureCodes(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/incidents/closure_codes",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/locations",
        ...opts,
      });
    },
    listBranches(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/branches",
        ...opts,
      });
    },
    listOperatorGroups(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/operatorgroups",
        ...opts,
      });
    },
    listSuppliers(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/suppliers",
        ...opts,
      });
    },
    listAssets(opts = {}) {
      return this._makeRequest({
        path: "/tas/api/assetmgmt/assets",
        ...opts,
      });
    },
    listProgressTrail({
      incidentId, ...opts
    }) {
      return this._makeRequest({
        path: `/tas/api/incidents/id/${incidentId}/progresstrail`,
        ...opts,
      });
    },
    async *paginate({
      fn,
      fnArgs = {},
      maxResults = 600,
      dataField,
    }) {
      let resourcesCount = 0;
      let start = 0;

      while (true) {
        const response = await fn({
          ...fnArgs,
          params: {
            ...fnArgs.params,
            start,
            page_size: (fnArgs.params?.page_size || 100),
          },
        });

        // Extract items from response based on dataField or use response directly
        const items = dataField
          ? (response[dataField] || [])
          : (Array.isArray(response)
            ? response
            : []);

        if (!items.length) {
          console.log("No items found");
          return;
        }

        for (const item of items) {
          yield item;
          resourcesCount++;

          if (maxResults && resourcesCount >= maxResults) {
            console.log("Reached max results");
            return;
          }
        }

        const hasNextPage = response.next || (items.length === 100);

        if (!hasNextPage) {
          console.log("No more pages found");
          return;
        }

        // Auto-increment pagination parameters
        start += (fnArgs.params?.page_size || 100);
      }
    },
  },
};
