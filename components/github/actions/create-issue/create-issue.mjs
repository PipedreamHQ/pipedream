import { checkPushPermission } from "../../common/utils.mjs";
import github from "../../github.app.mjs";

export default {
  key: "github-create-issue",
  name: "Create Issue",
  description: "Create a new issue in a Gihub repo. [See docs here](https://docs.github.com/en/rest/issues/issues#create-an-issue)",
  version: "0.2.16",
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
      description: "The contents of the issue",
      type: "string",
      optional: true,
    },
    labels: {
      label: "Labels",
      description: "Labels to associate with this issue. NOTE: Only users with push access can set labels for new issues",
      optional: true,
      propDefinition: [
        github,
        "labels",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
    assignees: {
      label: "Assignees",
      description: "Logins for Users to assign to this issue. NOTE: Only users with push access can set assignees for new issues",
      optional: true,
      propDefinition: [
        github,
        "collaborators",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
    milestone: {
      propDefinition: [
        github,
        "milestoneNumber",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  methods: {
    checkPushPermission,
  },
  async additionalProps() {
    const canPush = await this.checkPushPermission();
    return canPush
      ? {}
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
