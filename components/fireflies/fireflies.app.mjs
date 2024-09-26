import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "fireflies",
  propDefinitions: {
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The unique identifier for the meeting.",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data: { transcripts } } = await this.query({
          data: {
            query: queries.listTranscripts,
            variables: {
              limit,
              skip: page * limit,
            },
          },
        });
        return transcripts?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user.",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data: { users } } = await this.query({
          data: {
            query: queries.listUsers,
            variables: {
              limit,
              skip: page * limit,
            },
          },
        });
        return users?.map(({
          user_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fireflies.ai/graphql";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    query(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
  },
};
