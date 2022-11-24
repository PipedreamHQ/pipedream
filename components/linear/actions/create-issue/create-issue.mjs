import createIssue from "../../../linear_app/actions/create-issue/create-issue.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

const appProps = utils.getAppProps(createIssue).props;
const { linearApp } = appProps;

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...createIssue,
  key: "linear-create-issue",
  description:
    "Create an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.4.0",
  props: {
    ...appProps,
    createAs: {
      propDefinition: [
        linearApp,
        "createAs",
      ],
    },
  },
  methods: {
    checkOutdatedAuthError(err) {
      if (
        err.message ===
        "`createAsUser` used without OAuth `actor=application` mode"
      ) {
        throw new ConfigurationError(
          "**Update required** - please reconnect your Linear app account.",
        );
      } else throw err;
    },
  },
  async additionalProps() {
    const props = {
      customUsername: {
        type: "string",
        label: "Custom Username",
        description: "The user that is performing this action.",
      },
      displayIconUrl: {
        type: "string",
        label: "Display Icon URL",
        description:
          "The URL of the avatar for the user performing this action.",
      },
    };

    return this.createAs === "custom"
      ? props
      : {};
  },
  async run({ $ }) {
    const {
      title, description, teamId, assigneeId, createAs,
    } = this;

    const params = {
      teamId,
      title,
      description,
      assigneeId,
    };

    let {
      customUsername, displayIconUrl,
    } = this;

    if (createAs !== "app") {
      if (createAs === "me") {
        const {
          avatarUrl, displayName,
        } =
          await this.linearApp.getOwnUserInfo();
        customUsername = displayName;
        displayIconUrl = avatarUrl;
      }

      params.createAsUser = customUsername;
      if (displayIconUrl) params.displayIconUrl = displayIconUrl;
    }

    try {
      const response = await this.linearApp.createIssue(params);

      const summary = response.success
        ? `Created issue ${response._issue.id}`
        : "Failed to create issue";
      $.export("$summary", summary);

      return response;
    } catch (err) {
      this.checkOutdatedAuthError(err);
    }
  },
};
