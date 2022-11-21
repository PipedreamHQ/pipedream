import createIssue from "../../../linear_app/actions/create-issue/create-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createIssue,
  ...utils.getAppProps(createIssue),
  key: "linear-create-issue",
  description: "Create an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.3.7",
  props: {
    ...createIssue.props,
    createAsUser: {
      type: "boolean",
      label: "Create As User",
      description: "The user to create the issue as. If not provided, the issue will be created as the authenticated user.",
      default: true,
    },
  },
  additionalProps: async() => {
    const { createAsUser } = this;
    if (createAsUser === false) {
      return [
        {
          username: {
            type: "string",
            label: "Username",
            description: "The username of the user to create the issue as.",
          },
          userDisplayIconURL: {
            type: "string",
            label: "User Display Icon URL",
            description: "The display icon URL of the user to create the issue as.",
            optional: true,
          },
        },
      ];
    } else {
      return [];
    }
  },
  async run({ $ }) {
    const {
      title,
      description,
      teamId,
      assigneeId,
      createAsUser,
      username,
      userDisplayIconURL,
    } = this;

    const response =
      await this.linearApp.createIssue({
        teamId,
        title,
        description,
        assigneeId,
        createAsUser: createAsUser === true
          ? username
          : undefined,
        userDisplayIconURL,
      });

    const summary = response.success
      ? `Created issue ${response._issue.id}`
      : "Failed to create issue";
    $.export("$summary", summary);

    return response;
  },
};

