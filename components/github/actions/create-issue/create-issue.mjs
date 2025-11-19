import { checkPushPermission } from "../../common/utils.mjs";
import github from "../../github.app.mjs";
import asyncProps from "../common/asyncProps.mjs";

export default {
  key: "github-create-issue",
  name: "Create Issue",
  description: "Create a new issue in a GitHub repo. [See the documentation](https://docs.github.com/en/rest/issues/issues#create-an-issue)",
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      reloadProps: true,
    },
    title: {
      label: "Title",
      description: "The title of the issue",
      type: "string",
    },
    body: {
      label: "Body",
      description: "The text body of the issue",
      type: "string",
      optional: true,
    },
  },
  methods: {
    checkPushPermission,
  },
  async additionalProps() {
    const canPush = await this.checkPushPermission();
    return canPush
      ? {
        assignees: asyncProps.assignees,
        labels: asyncProps.labels,
        milestoneNumber: asyncProps.milestoneNumber,
      }
      : {
        infoBox: {
          type: "alert",
          alertType: "info",
          content: "Labels, assignees and milestones can only be set by users with push access to the repository.",
        },
      };
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      github, repoFullname, infoBox, ...data
    } = this;

    const response = await github.createIssue({
      repoFullname,
      data,
    });

    $.export("$summary", `Successfully created issue (ID: ${response.id})`);

    return response;
  },
};
