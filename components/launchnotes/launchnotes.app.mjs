import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";
import mutations from "./common/mutations.mjs";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "launchnotes",
  propDefinitions: {
    categories: {
      type: "string[]",
      label: "Categories",
      description: "Associated categories of the announcement.",
      async options({ projectId }) {
        const { data: { project: { categories: { nodes } } } } = await this.getProject({
          projectId,
        });

        return nodes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    clientMutationId: {
      type: "string",
      label: "Client Mutation Id",
      description: "A unique identifier for the client performing the mutation.",
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Event types you would like receive notifications on.",
      async options({ projectId }) {
        const { data: { project: { eventTypes: { nodes } } } } = await this.getProject({
          projectId,
        });

        return nodes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const { data: { session: { projects: { nodes } } } } = await this.listProjects();

        return nodes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subscriber: {
      type: "string",
      label: "Subscriber",
      description: "The subscriber of the subscription.",
      withLabel: true,
      async options({
        projectId, workItemId,
      }) {
        let nodes = [];
        if (workItemId) {
          const { data: { project: { subscribers } } } = await this.getWorkItem({
            workItemId,
          });
          nodes = subscribers.nodes;
        } else {
          const { data: { project: { subscribers } } } = await this.getProject({
            projectId,
          });
          nodes = subscribers.nodes;
        }

        return nodes.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "Pre-fill the announcement with a template. If this is provided, all other input is ignored.",
      async options({ projectId }) {
        const { data: { project: { templates: { nodes } } } } = await this.getProject({
          projectId,
        });

        return nodes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.launchnotes.io/graphql";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, ...data
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: this._headers(),
        data,
      });
    },
    createAnnouncement({
      $, variables,
    }) {
      return this._makeRequest({
        $,
        query: mutations.createAnnouncement,
        variables,
      });
    },
    createSubscription({
      $, variables,
    }) {
      return this._makeRequest({
        $,
        query: mutations.createSubscription,
        variables,
      });
    },
    getProject(variables) {
      return this._makeRequest({
        query: queries.getProject,
        variables,
      });
    },
    getWorkItem(variables) {
      return this._makeRequest({
        query: queries.getWorkItem,
        variables,
      });
    },
    listAnnouncements(variables) {
      return this._makeRequest({
        query: queries.paginateAnnouncements,
        variables,
      });
    },
    listProjects() {
      return this._makeRequest({
        query: queries.listProjects,
      });
    },
    listSubscriptions(variables) {
      return this._makeRequest({
        query: queries.paginateSubscriptions,
        variables,
      });
    },
    async *paginate({
      fn, maxResults = null, type, ...variables
    }) {
      let hasMore = false;
      let count = 0;
      let cursor;

      do {
        variables.limit = LIMIT;
        variables.cursor = cursor;
        const { data: { project: { [type]: { edges } } } } = await fn(
          variables,
        );

        for (const { node } of edges) {
          yield node;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = edges.length;
        if (hasMore) {
          cursor = edges[0].cursor;
        }

      } while (hasMore);
    },
  },
};
