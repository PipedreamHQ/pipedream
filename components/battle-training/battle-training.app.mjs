import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "battle_training",
  propDefinitions: {
    bot: {
      type: "string",
      label: "Bot",
      description: "The name of the bot, e.g. `ajuk`. Find your bots with **List My Bots** — it returns the `bots` array, and the bot name is the `name` field of each item.",
    },
    handle: {
      type: "string",
      label: "Handle",
      description: "The handle for the new battle.training account, e.g. `arena-operator`. It must be unique across the arena.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Your email address, e.g. `operator@example.com`. battle.training emails you a link that confirms the address and claims the account.",
    },
    label: {
      type: "string",
      label: "Version Label",
      description: "A label for the bot version, e.g. `v1`.",
    },
    source: {
      type: "string",
      label: "Controller Source",
      description: "The JavaScript controller source to upload. The upload runs a 400-tick smoke test and, if it passes, the version becomes the active ranked controller. Start from the starter controller at https://api.battle.training/starters/controller.js and test it locally with the SDK before uploading.",
    },
    ladder: {
      type: "string",
      label: "Ladder",
      description: "The slug of the ladder or cup, e.g. `promotedby-cup-nov-2026` for the promotedby.ai November Cup. Find slugs with **List Ladders** — it returns the `ladders` array, and the slug is the `slug` field of each item.",
      optional: true,
      default: "promotedby-cup-nov-2026",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of matches to return, e.g. `10`.",
      optional: true,
      default: 10,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.battle.training/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth = true,
        headers = {},
        ...otherOpts
      } = opts;

      if (auth && this.$auth?.api_key) {
        headers.Authorization = `Bearer ${this.$auth.api_key}`;
      }

      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers,
      });
    },
    async createAccount({
      $ = this, handle, email,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/accounts",
        auth: false,
        data: {
          handle,
          email,
        },
      });
    },
    async uploadBotVersion({
      $ = this, bot, label, source,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/bots/${bot}/versions`,
        data: {
          label,
          source,
        },
      });
    },
    async getLadder({ $ = this } = {}) {
      return this._makeRequest({
        $,
        path: "/ladder",
        auth: false,
      });
    },
    async getMyBots({ $ = this } = {}) {
      return this._makeRequest({
        $,
        path: "/me",
      });
    },
    async listLadders({ $ = this } = {}) {
      return this._makeRequest({
        $,
        path: "/ladders",
        auth: false,
      });
    },
    async getCupStandings({
      $ = this, ladder,
    }) {
      return this._makeRequest({
        $,
        path: `/ladders/${ladder}`,
        auth: false,
      });
    },
    async listMatches({
      $ = this, bot, limit,
    }) {
      return this._makeRequest({
        $,
        path: "/matches",
        auth: false,
        params: {
          bot,
          limit,
        },
      });
    },
  },
};
