import app from "../../beanstalkapp.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "beanstalkapp-create-code-review",
  name: "Create Code Review",
  description: "Creates a new code review. This action is essentially the same as clicking the “Request review” button in the app. [See the docs](https://api.beanstalkapp.com/code_review.html).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    repositoryId: {
      propDefinition: [
        app,
        "repositoryId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the **Target Branch**.",
      optional: true,
    },
    targetBranch: {
      label: "Target Branch",
      description: "Name of the branch that’s being reviewed.",
      propDefinition: [
        app,
        "branch",
        ({ repositoryId }) => ({
          repositoryId,
        }),
      ],
    },
    sourceBranch: {
      label: "Source Branch",
      description: "Name of the branch to which **Target Branch** should be compared to.",
      propDefinition: [
        app,
        "branch",
        ({ repositoryId }) => ({
          repositoryId,
        }),
      ],
    },
    merge: {
      type: "boolean",
      label: "Merge",
      description: "Merge branches when review gets approved. `False` by default.",
      optional: true,
    },
    assigneeIds: {
      type: "string[]",
      label: "Assignee IDs",
      description: "IDs of the users who will be assigned to the code review.",
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  methods: {
    createCodeReview({
      repositoryId, ...args
    } = {}) {
      return this.app.create({
        path: `/${repositoryId}/code_reviews`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      repositoryId,
      description,
      targetBranch,
      sourceBranch,
      merge,
      assigneeIds,
    } = this;

    const response = await this.createCodeReview({
      step,
      repositoryId,
      data: {
        code_review: {
          description,
          target_branch: targetBranch,
          source_branch: sourceBranch,
          merge,
          assignee_ids: utils.parseArray(assigneeIds),
        },
      },
    });

    step.export("$summary", `Successfully created code review with ID ${response.id}`);

    return response;
  },
};
