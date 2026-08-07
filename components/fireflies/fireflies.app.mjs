// x-pd-ai: optimized
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
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
        // The Fireflies `users` query doesn't accept limit/skip arguments —
        // the full list is always returned in one call.
        if (page > 0) {
          return [];
        }
        const { data: { users } } = await this.query({
          data: {
            query: queries.listUsers,
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
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The unique identifier for a Fireflies channel, used to group meetings by team or topic. Use **List Channel ID Options** to browse available channels.",
      async options({ page }) {
        // The Fireflies `channels` query doesn't accept limit/skip arguments —
        // the full list is always returned in one call.
        if (page > 0) {
          return [];
        }
        const { data: { channels } } = await this.query({
          data: {
            query: queries.channels,
          },
        });
        return channels?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    askfredThreadId: {
      type: "string",
      label: "AskFred Thread ID",
      description: "The unique identifier of an existing AskFred conversation thread. Returned as `thread_id` by **Ask Question About Meeting**, or browsable via **List AskFred Thread ID Options**.",
      async options({ page }) {
        // The Fireflies `askfred_threads` query doesn't accept limit/skip arguments.
        if (page > 0) {
          return [];
        }
        const { data: { askfred_threads: askfredThreads } } = await this.query({
          data: {
            query: queries.askfredThreads,
          },
        });
        return askfredThreads?.map(({
          id: value, title: label,
        }) => ({
          value,
          label: label || value,
        })) || [];
      },
    },
    responseLanguage: {
      type: "string",
      label: "Response Language",
      description: "Language code for the AI's response, e.g. `en` or `es`. Defaults to English.",
      optional: true,
      options: constants.RESPONSE_LANGUAGE_OPTIONS,
    },
    formatMode: {
      type: "string",
      label: "Format Mode",
      description: "How the answer should be formatted. Accepted values are `markdown` or `plaintext`.",
      optional: true,
      options: [
        "markdown",
        "plaintext",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: `The page of results to retrieve, starting at \`0\`. Each page returns up to ${constants.DEFAULT_LIMIT} results.`,
      min: 0,
      default: 0,
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
    async query(opts = {}) {
      const response = await this._makeRequest({
        method: "POST",
        ...opts,
      });
      if (response.errors?.length) {
        throw new ConfigurationError(`Error: ${response.errors[0].message}`);
      }
      return response;
    },
  },
};
