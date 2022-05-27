import base from "../common/base.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-get-user",
  name: "Get User",
  description: "Gets details of user. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-user-get)",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    accountId: {
      propDefinition: [
        jira,
        "accountId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jira.getUser({
      $,
      cloudId: this.cloudId,
      params: {
        accountId: this.accountId,
        expand: this.expand,
      },
    });

    $.export("$summary", "Successfully retrieved user");

    return response;
  },
};
