import { axios } from "@pipedream/platform";

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
        return teams.map((team) => ({
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
        return bots.map((bot) => ({
          label: bot.name,
          value: bot.id,
        }));
      },
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question to ask the bot",
    },
    fullSource: {
      type: "boolean",
      label: "Full Source",
      description: "Whether the full source content should be returned",
    },
    format: {
      type: "string",
      label: "Format",
      description: "How to format the answer. Can be markdown or text",
    },
    history: {
      type: "string[]",
      label: "Chat History",
      description: "The chat history array",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A user identification object with arbitrary metadata about the user",
    },
    type: {
      type: "string",
      label: "Source Type",
      description: "The source type. Can be url, rss, sitemap, urls, csv, document, qa or wp",
    },
    title: {
      type: "string",
      label: "Source Title",
      description: "The source title. Required only for document type",
    },
    url: {
      type: "string",
      label: "Source URL",
      description: "The source URL. Required if type is url, sitemap, or rss",
    },
    file: {
      type: "string",
      label: "Source File Path",
      description: "The source file path. Required if type is urls, csv, document, or wp",
    },
    faqs: {
      type: "string[]",
      label: "FAQs",
      description: "Required if type is qa. An array of objects like [{\"question\":\"Question text\", \"answer\":\"The answer.\"}]",
    },
    scheduleInterval: {
      type: "string",
      label: "Schedule Interval",
      description: "The source refresh scheduled interval. Can be daily, weekly, monthly, or none depending on your plan",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.docsbot.ai";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listTeams() {
      return this._makeRequest({
        path: "/api/teams",
      });
    },
    async listBots({ teamId }) {
      return this._makeRequest({
        path: `/api/teams/${teamId}/bots`,
      });
    },
    async askQuestion({
      teamId, botId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/teams/${teamId}/bots/${botId}/chat`,
        ...args,
      });
    },
    async createSource({
      teamId, botId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/teams/${teamId}/bots/${botId}/sources`,
        ...args,
      });
    },
  },
};
