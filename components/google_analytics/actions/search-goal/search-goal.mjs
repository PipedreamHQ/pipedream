import analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-search-goal",
  name: "Search Goal",
  description: "Finds a specific goal",
  version: "0.0.1",
  type: "action",
  props: {
    analytics,
    token: {
      propDefinition: [
        analytics,
        "token",
      ],
    },
    accountId: {
      propDefinition: [
        analytics,
        "accountId",
        (c) => ({
          token: c.token,
        }),
      ],
    },
    webPropertyId: {
      propDefinition: [
        analytics,
        "webPropertyId",
        (c) => ({
          token: c.token,
          accountId: c.accountId,
        }),
      ],
    },
    profileId: {
      propDefinition: [
        analytics,
        "profileId",
        (c) => ({
          token: c.token,
          accountId: c.accountId,
          webPropertyId: c.webPropertyId,
        }),
      ],
    },
    goalId: {
      propDefinition: [
        analytics,
        "goalId",
        (c) => ({
          token: c.token,
          accountId: c.accountId,
          webPropertyId: c.webPropertyId,
          profileId: c.profileId,
        }),
      ],
    },
  },
  async run({ $ }) {
    let params = {
      accountId: this.accountId,
      webPropertyId: this.webPropertyId,
      profileId: this.profileId,
      goalId: this.goalId,
    };
    let response = await this.analytics.searchGoal(
      this.token,
      params,
    );
    $.export("$summary", `Found ${response.name} with id ${response.id}`);
    return response;
  },
};
