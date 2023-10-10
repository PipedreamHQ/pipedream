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
          value: team.id,
          label: team.name,
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
          value: bot.id,
          label: bot.name,
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
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "How to format the answer. Can be markdown or text",
      optional: true,
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
      description: "A user identification object with arbitrary metadata about the user",
      optional: true,
    },
    type: {
      type: "string",
      label: "Source Type",
      description: "The source type. Can be url, rss, sitemap, urls, csv, document, qa, or wp",
    },
    title: {
      type: "string",
      label: "Source Title",
      description: "The source title",
      optional: true,
    },
    url: {
      type: "string",
      label: "Source URL",
      description: "The source URL",
      optional: true,
    },
    file: {
      type: "string",
      label: "Source File Path",
      description: "The source file path",
      optional: true,
    },
    faqs: {
      type: "string[]",
      label: "FAQs",
      description: "Required if type is qa. An array of objects like [{'question':'Question text', 'answer':'The answer.'}]",
      optional: true,
    },
    scheduleInterval: {
      type: "string",
      label: "Schedule Interval",
      description: "The source refresh scheduled interval. Can be daily, weekly, monthly, or none depending on your plan",
      optional: true,
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listTeams() {
      return this._makeRequest({
        path: "/teams",
      });
    },
    async listBots({ teamId }) {
      return this._makeRequest({
        path: `/teams/${teamId}/bots`,
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
        path: `/teams/${teamId}/bots/${botId}/sources`,
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
