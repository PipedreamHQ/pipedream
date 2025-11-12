import clickhelp from "../../clickhelp.app.mjs";
import { pollTaskStatus } from "../../common/utils.mjs";

export default {
  key: "clickhelp-create-publication",
  name: "Create Publication",
  description: "Creates a new publication from the designated project. This action allows you to share your content with others in various formats. [See the documentation](https://clickhelp.com/software-documentation-tool/user-manual/api-publish-project.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clickhelp,
    projectId: {
      propDefinition: [
        clickhelp,
        "projectId",
      ],
    },
    pubId: {
      type: "string",
      label: "Pub ID",
      description: "The ID of the publication to create",
    },
    pubName: {
      type: "string",
      label: "Pub Name",
      description: "The name of the publication to create",
    },
    isPublishOnlyReadyTopics: {
      type: "boolean",
      label: "Publish Only Ready Topics?",
      description: "Whether to publish only topics in the Ready status",
      optional: true,
    },
    pubVisibility: {
      type: "string",
      label: "Pub Visibility",
      description: "The target publication visibility. Defalts to `Public`.",
      optional: true,
      options: [
        "Public",
        "Private",
        "Restricted",
      ],
      default: "Public",
    },
    nodeIds: {
      propDefinition: [
        clickhelp,
        "nodeIds",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    waitForCompletion: {
      propDefinition: [
        clickhelp,
        "waitForCompletion",
      ],
    },
  },
  async run({ $ }) {
    let response = await this.clickhelp.createPublication({
      $,
      projectId: this.projectId,
      data: {
        pubId: this.pubId,
        pubName: this.pubName,
        isPublishOnlyReadyTopics: this.isPublishOnlyReadyTopics,
        pubVisibility: this.pubVisibility,
        publishedTocNodeIds: this.nodeIds,
      },
    });

    const { taskKey } = response;
    if (this.waitForCompletion) {
      response = await pollTaskStatus($, this, taskKey);
    }

    $.export("$summary", "Successfully created publication.");
    return response;
  },
};
