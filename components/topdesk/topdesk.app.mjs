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
            start: start + (fnArgs.params?.page_size || 100),
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
