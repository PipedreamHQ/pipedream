import app from "../../redmine.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "redmine-create-issue",
  name: "Create Issue",
  description: "Creates a new issue in Redmine. [See the documentation](https://www.redmine.org/projects/redmine/wiki/rest_issues#creating-an-issue)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    trackerId: {
      propDefinition: [
        app,
        "trackerId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the issue",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the issue",
    },
    statusId: {
      propDefinition: [
        app,
        "statusId",
      ],
    },
    priorityId: {
      propDefinition: [
        app,
        "priorityId",
      ],
    },
  },
  methods: {
    createIssue(args = {}) {
      return this.app.post({
        path: "/issues.json",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      createIssue,
      ...issue
    } = this;

    return createIssue({
      step,
      data: {
        issue: utils.transformProps(issue),
      },
      summary: (response) => `Successfully created issue with ID: \`${response.issue?.id}\``,
    });
  },
};
