import analytics from "../../google_analytics.app.mjs";
import common from "../common.mjs";

export default {
  key: "google_analytics-update-goal",
  name: "Update Goal",
  description: "Updates an existing goal. [See the docs](https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/goals/update)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The goal name",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The monetary value conversion for the goal. This field is a floating number value",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Determines whether this goal is active",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "One of the four goal type categories",
      optional: true,
      reloadProps: true,
      options: Object.keys(common.goalTypes),
    },
  },
  async additionalProps() {
    const destinationUrl = {
      type: "string",
      label: "Destination URL",
      description: "The request URI, which is the part of the URL that comes after the domain address",
    };
    const matchType = {
      type: "string",
      label: "Match Type",
      description: "Type of the match to be performed",
      options: Object.values(common.matchTypes),
    };
    const comparisonType = {
      type: "string",
      label: "Comparison Type",
      description: "Type of comparison",
      options: Object.values(common.comparisonTypes),
    };
    const comparisonValue = {
      type: "integer",
      label: "Comparison Value",
      description: "Value used for this comparison",
    };
    const expression = {
      type: "string",
      label: "Expression",
      description: "Expression used for this match",
    };
    const eventType = {
      type: "string",
      label: "Event Type",
      description: "Type of event condition",
      options: Object.values(common.eventTypes),
    };

    let props = {};
    if (this.type === common.goalTypes.URL_DESTINATION) {
      props = {
        destinationUrl,
      };
    }
    else if (this.type === common.goalTypes.VISIT_TIME_ON_SITE) {
      props = {
        comparisonType,
        comparisonValue,
      };
      props.comparisonType.options = [
        common.comparisonTypes.LESS_THAN,
        common.comparisonTypes.GREATER_THAN,
      ];
    }
    else if (this.type === common.goalTypes.VISIT_NUM_PAGES) {
      props = {
        comparisonType,
        comparisonValue,
      };
    }
    else if (this.type === common.goalTypes.EVENT) {
      props = {
        matchType,
        eventType,
        expression,
        comparisonType,
        comparisonValue,
      };
    }
    return props;
  },
  async run({ $ }) {
    let params = {
      accountId: this.accountId,
      webPropertyId: this.webPropertyId,
      profileId: this.profileId,
      goalId: this.goalId,
      urlDestinationDetails: {
        url: this.desinationUrl,
        matchType: this.matchType,
      },
      visitTimeOnSiteDetails: {
        comparisonType: this.comparisonType,
        comparisonValue: this.comparisonValue,
      },
      visitNumPagesDetails: {
        comparisonType: this.comparisonType,
        comparisonValue: this.comparisonValue,
      },
      eventDetails: {
        eventConditions: [
          {
            type: this.eventType,
            matchType: this.matchType,
            expression: this.expression,
            comparisonType: this.comparisonType,
            comparisonValue: this.comparisonValue,
          },
        ],
      },
    };
    let response = await this.analytics.updateGoal(
      this.token,
      params,
    );
    $.export("$summary", `Updated ${response.name} with id ${response.id}`);
    return response;
  },
};
