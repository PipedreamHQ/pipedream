import { axios } from "@pipedream/platform";

const BASE_URL_CHAT = "https://api.docsbot.ai";
const BASE_URL_OTHERS = "https://docsbot.ai/api";

export default {
  type: "app",
  app: "docsbot_ai",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team",
      async options() {
        const teams = await this.listTeams();
        return teams?.map?.((team) => ({
          label: team.name,
          value: team.id,
        }));
      },
    },
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot",
      async options({ teamId }) {
        const bots = await this.listBots({
          teamId,
        });
        return bots?.map?.((bot) => ({
          label: bot.name,
          value: bot.id,
        }));
      },
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question to ask the bot (2 to 2000 characters)",
    },
    fullSource: {
      type: "boolean",
      label: "Full Source",
      description: "Whether the full source content should be returned",
      optional: true,
      default: false,
    },
    format: {
      type: "string",
      label: "Format",
      description: "How to format the answer",
      optional: true,
      options: [
        "markdown",
        "text",
      ],
      default: "markdown",
    },
    history: {
      type: "string[]",
      label: "Chat History",
      description: "The chat history array",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A user identification object with arbitrary metadata about the the user. Will be saved to the question history log. Keys `referrer`, `email`, and `name` are shown in question history logs",
      optional: true,
    },
    type: {
      type: "string",
      label: "Source Type",
      description: "The source type",
      options: [
        "url",
        "sitemap",
        "rss",
        "urls",
        "csv",
        "document",
        "qa",
        "wp",
      ],
    },
    title: {
      type: "string",
      label: "Source Title",
      description: "The source title. Required if type is `document`",
      optional: true,
    },
    url: {
      type: "string",
      label: "Source URL",
      description: "The source URL. Required if type is `url`, `sitemap`, or `rss`",
      optional: true,
    },
    file: {
      type: "string",
      label: "Source File Path",
      description: "The source file path. Required if type is `urls`, `csv`, `document`, or `wp`. You can upload a file using the **Upload Source File** action and use the returned `file` property here",
      optional: true,
    },
    faqs: {
      type: "string[]",
      label: "FAQs",
      description: "Required if type is `qa`. An array of objects like `{ \"question\": \"Question text\", \"answer\":\"The answer.\" }`",
      optional: true,
    },
    scheduleInterval: {
      type: "string",
      label: "Schedule Interval",
      description: "The source refresh scheduled interval. Can be `daily`, `weekly`, `monthly`, or `none` depending on your plan",
      optional: true,
      options: [
        "daily",
        "weekly",
        "monthly",
        "none",
      ],
      default: "none",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "A file path in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/)",
    },
  },
  methods: {
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listTeams() {
      return this._makeRequest({
        url: `${BASE_URL_OTHERS}/teams`,
      });
    },
    async listBots({ teamId }) {
      return this._makeRequest({
        url: `${BASE_URL_OTHERS}/teams/${teamId}/bots`,
      });
    },
    async askQuestion({
      teamId, botId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `${BASE_URL_CHAT}/teams/${teamId}/bots/${botId}/chat`,
        ...args,
      });
    },
    async createSource({
      teamId, botId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `${BASE_URL_OTHERS}/teams/${teamId}/bots/${botId}/sources`,
        ...args,
      });
    },
    async getFileUploadUrl({
      teamId, botId, ...args
    }) {
      return this._makeRequest({
        url: `${BASE_URL_OTHERS}/teams/${teamId}/bots/${botId}/upload-url`,
        ...args,
      });
    },

    async uploadSourceFile(
      args,
    ) {
      return this._makeRequest({
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        ...args,
      });
    },
  },
};
