import analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-list-goals",
  name: "List Goals",
  description: "Lists goals to which the user has access",
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
      description: `${analytics.propDefinitions.accountId.description}
        Can either be a specific account ID or \`~all\`, which refers to all the accounts that user has access to`,
    },
    webPropertyId: {
      propDefinition: [
        analytics,
        "webPropertyId",
      ],
      description: `${analytics.propDefinitions.webPropertyId.description}
        Can either be a specific web property ID or \`~all\`, which refers to all the web properties that user has access to`,
    },
    profileId: {
      propDefinition: [
        analytics,
        "profileId",
      ],
      description: `${analytics.propDefinitions.profileId.description}
        Can either be a specific view (profile) ID or \`~all\`, which refers to all the views (profiles) that user has access to`,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of goals to include in this response",
      optional: true,
    },
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: `An index of the first goal to retrieve
        Use this parameter as a pagination mechanism along with the max-results parameter`,
      optional: true,
    },
  },
  async run({ $ }) {
    let params = {
      "accountId": this.accountId,
      "webPropertyId": this.webPropertyId,
      "profileId": this.profileId,
      "max-results": this.maxResults,
      "start-index": this.startIndex,
    };
    let response = await this.analytics.listGoals(
      this.token,
      params,
    );
    $.export("$summary", `Found ${response.items.length} goal(s) for ${response.username}`);
    return response;
  },
};
