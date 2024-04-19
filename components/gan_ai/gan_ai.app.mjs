import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gan_ai",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier for the user's project in the GAN AI systems.",
      async options({ prevContext }) {
        const { data } = await this.getProjects({
          page: prevContext.page || 1,
        });
        return {
          options: data.map((project) => ({
            label: project.title,
            value: project.project_id,
          })),
          context: {
            page: prevContext.page
              ? prevContext.page + 1
              : 2,
          },
        };
      },
    },
    tagsAndValues: {
      type: "string[]",
      label: "Tags and Values",
      description: "List of dictionaries with tags and their corresponding values for video generation.",
    },
    queryset: {
      type: "string[]",
      label: "Query Set",
      description: "The payload is a list of dictionaries, where all the parameters required for video generation have to be provided along with a `unique_id`.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.gan.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getProjects({ page }) {
      return this._makeRequest({
        method: "GET",
        path: `/projects/v2?page=${page}`,
      });
    },
    async createVideosBulk({
      projectId, tagsAndValues, queryset,
    }) {
      const payload = tagsAndValues
        ? tagsAndValues.map(JSON.parse)
        : queryset.map(JSON.parse);
      return this._makeRequest({
        method: "POST",
        path: "/create_video/bulk",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          project_id: projectId,
          create_video_bulk_query_set: payload,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
