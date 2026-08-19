// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bonusly",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://bonus.ly";
    },
    async _callTool({
      $ = this, name, arguments: toolArgs = {},
    }) {
      const response = await axios($, {
        method: "POST",
        url: `${this._baseUrl()}/mcp`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
      const [
        content,
      ] = response.result.content;
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
    adminRewardsRedemptionsReport({
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
    adminParticipationReport({
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
