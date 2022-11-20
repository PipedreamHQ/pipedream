import updateIssue from "../../../linear_app/actions/update-issue/update-issue.mjs";
import utils from "../../common/utils.mjs";
import additionalProps from "../../common/additionalProps.mjs";

const appProps = utils.getAppProps(updateIssue).props;
const { linearApp } = appProps;

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...updateIssue,
  key: "linear-update-issue",
  description:
    "Update an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.0.6",
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
      issueId,
      title,
      description,
      teamId,
      assigneeId,
      useOwnUser,
      createAsUser,
      displayIconUrl,
    } = this;

    const params = {
      issueId,
      input: {
        teamId,
        title,
        description,
        assigneeId,
        createAsUser,
        displayIconUrl,
      },
    };

    if (useOwnUser) {
      const {
        avatarUrl, displayName,
      } = await this.linearApp.getOwnUserInfo();
      params.createAsUser = displayName;
      if (avatarUrl) params.displayIconUrl = avatarUrl;
    }

    const response =
      await this.linearApp.updateIssue(params);

    const summary = response.success
      ? `Updated issue ${response._issue.id}`
      : "Failed to update issue";
    $.export("$summary", summary);

    return response;
  },
};
