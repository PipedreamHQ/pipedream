import createIssue from "../../../linear_app/actions/create-issue/create-issue.mjs";
import utils from "../../common/utils.mjs";
import additionalProps from "../../common/additionalProps.mjs";

const appProps = utils.getAppProps(createIssue).props;
const { linearApp } = appProps;

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createIssue,
  key: "linear-create-issue",
  description:
    "Create an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.3.11",
  props: {
    ...appProps,
    useOwnUser: {
      propDefinition: [
        linearApp,
        "useOwnUser",
      ],
    },
  },
  additionalProps,
  async run({ $ }) {
    const {
      title,
      description,
      teamId,
      assigneeId,
      useOwnUser,
      createAsUser,
      displayIconUrl,
    } = this;

    const params = {
      teamId,
      title,
      description,
      assigneeId,
      createAsUser,
      displayIconUrl,
    };

    if (useOwnUser) {
      const {
        avatarUrl, displayName,
      } = await this.linearApp.getOwnUserInfo();
      params.createAsUser = displayName;
      if (avatarUrl) params.displayIconUrl = avatarUrl;
    }

    const response =
      await this.linearApp.createIssue(params);

    const summary = response.success
      ? `Created issue ${response._issue.id}`
      : "Failed to create issue";
    $.export("$summary", summary);

    return response;
  },
};
