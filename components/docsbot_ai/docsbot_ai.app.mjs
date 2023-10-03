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
        const { data } = await this.listTeams();
        return data.map((team) => ({
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
        const { data } = await this.listBots({
          teamId,
        });
        return data.map((bot) => ({
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
    full_source: {
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
      label: "History",
      description: "The chat history array",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A user identification object with arbitrary metadata about the the user",
    },
    type: {
      type: "string",
      label: "Source Type",
      description: "The type of the source. Can be url, rss, sitemap, urls, csv, document, qa or wp",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the source",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the source",
    },
    file: {
      type: "string",
      label: "File",
      description: "The file path of the source",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
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
      teamId, botId, question, full_source, format, history, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/teams/${teamId}/bots/${botId}/chat`,
        data: {
          question,
          full_source,
          format,
          history,
          metadata,
        },
      });
    },
    async createSource({
      teamId, botId, type, title, url, file, faqs, scheduleInterval,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/teams/${teamId}/bots/${botId}/sources`,
        data: {
          type,
          title,
          url,
          file,
          faqs,
          scheduleInterval,
        },
      });
    },
  },
};
