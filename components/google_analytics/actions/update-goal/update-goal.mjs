import analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-update-goal",
  name: "Update Goal",
  description: "Updates an existing goal",
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
    goal: {
      type: "object",
      label: "Goal Patch",
      description: `The relevant portions of a management.goal resource, according to the rules of patch semantics
        More information at [Google Analytics Management API](https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/goals/patch)`,
    },
  },
  async run({ $ }) {
    let params = {
      accountId: this.accountId,
      webPropertyId: this.webPropertyId,
      profileId: this.profileId,
      goalId: this.goalId,
      resource: this.goal,
    };
    let response = await this.analytics.updateGoal(
      this.token,
      params,
    );
    $.export("$summary", `Updated ${response.name} with id ${response.id}`);
    return response;
  },
};
