// x-pd-ai: optimized
import {
  axios, ConfigurationError,
} from "@pipedream/platform";

const BASE_URL = "https://bonus.ly";

export default {
  type: "app",
  app: "bonusly",
  propDefinitions: {
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start of the date range, in `YYYY-MM-DD` format, e.g. `2026-01-01`.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End of the date range, in `YYYY-MM-DD` format, e.g. `2026-06-30`.",
      optional: true,
    },
  },
  methods: {
    _accessToken() {
      const token = this.$auth.api_key;
      if (!token) {
        throw new ConfigurationError(
          "No Bonusly access token found on the connected account. Reconnect your Bonusly account and try again.",
        );
      }
      return token;
    },
    async _callTool({
      $ = this, name, arguments: toolArgs = {},
    }) {
      let response;
      try {
        response = await axios($, {
          method: "POST",
          url: `${BASE_URL}/mcp`,
          headers: {
            "Authorization": `Bearer ${this._accessToken()}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          data: {
            jsonrpc: "2.0",
            method: "tools/call",
            id: "1",
            params: {
              name,
              arguments: toolArgs,
            },
          },
        });
      } catch (error) {
        if (error.response?.status === 401) {
          throw new ConfigurationError(
            "Bonusly rejected this API key. Check that the key is still valid in Bonusly under"
            + " **Admin settings > Company > Integrations > Custom development**, then reconnect your account.",
          );
        }
        if (error.response?.status === 403) {
          throw new ConfigurationError(
            `Your Bonusly account is not permitted to use the \`${name}\` tool. The admin reports require`
            + " global admin or reports admin access in Bonusly — ask a Bonusly admin to grant it, or use an"
            + " account that already has it.",
          );
        }
        throw error;
      }
      if (response.error) {
        throw new Error(response.error.message);
      }
      const [
        content,
      ] = response.result?.content ?? [];
      if (!content?.text) {
        throw new Error(`Bonusly returned an empty response for the \`${name}\` tool.`);
      }
      if (response.result.isError) {
        throw new Error(content.text);
      }
      return JSON.parse(content.text);
    },
    giveRecognition({
      recipients, amount, reason, hashtag, ...opts
    }) {
      return this._callTool({
        name: "giveRecognition",
        arguments: {
          recipients,
          amount,
          reason,
          hashtag,
        },
        ...opts,
      });
    },
    searchUsers({
      searchTerm, pageSize, cursor, ...opts
    }) {
      return this._callTool({
        name: "searchUsers",
        arguments: {
          search_term: searchTerm,
          page_size: pageSize,
          cursor,
        },
        ...opts,
      });
    },
    getAdminRewardsRedemptionsReport({
      userEmail, startDate, endDate, unfulfilled, aasmState, range, page, perPage, sort, direction,
      ...opts
    }) {
      return this._callTool({
        name: "adminRewardsRedemptionsReport",
        arguments: {
          user_email: userEmail,
          start_date: startDate,
          end_date: endDate,
          unfulfilled,
          aasm_state: aasmState,
          range,
          page,
          per_page: perPage,
          sort,
          direction,
        },
        ...opts,
      });
    },
    getAdminParticipationReport({
      reportView, startDate, endDate, customPropertyGroup, includeTrend, ...opts
    }) {
      return this._callTool({
        name: "adminParticipationReport",
        arguments: {
          report_view: reportView,
          start_date: startDate,
          end_date: endDate,
          custom_property_group: customPropertyGroup,
          include_trend: includeTrend,
        },
        ...opts,
      });
    },
  },
};
