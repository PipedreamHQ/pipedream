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
      ],
    },
    webPropertyId: {
      propDefinition: [
        analytics,
        "webPropertyId",
      ],
    },
    profileId: {
      propDefinition: [
        analytics,
        "profileId",
      ],
    },
    goalId: {
      propDefinition: [
        analytics,
        "goalId",
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
