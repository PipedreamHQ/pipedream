import clickhelp from "../../clickhelp.app.mjs";

export default {
  key: "clickhelp-create-topic",
  name: "Create Topic",
  description: "Produces a new topic in the existing project. A useful action for starting a new chapter or section within your project. [See the documentation](https://clickhelp.com/software-documentation-tool/user-manual/api-create-topic.html)",
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
    assigneeUserName: {
      propDefinition: [
        clickhelp,
        "userName",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Assignee Username",
      description: "Topic assignee's login",
    },
    id: {
      type: "string",
      label: "ID",
      description: "The ID of the topic",
    },
    ownerUserName: {
      propDefinition: [
        clickhelp,
        "userName",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Owner Username",
      description: "Topic owner's login",
    },
    statusName: {
      type: "string",
      label: "Status Name",
      description: "Topic's workflow status",
      options: [
        "Draft",
        "Ready",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The HTML content of the topic",
      optional: true,
    },
    isShowInToc: {
      type: "boolean",
      label: "Show in TOC?",
      description: "Whether the topic's TOC node is shown in the table of contents in publications. Sets the corresponding option in the topic's properties. `false` by default",
      optional: true,
    },
    parentTocNodeId: {
      propDefinition: [
        clickhelp,
        "nodeIds",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      type: "string",
      label: "Parent Node ID",
      description: "The unique identifier of the parent TOC node. Specifying `null` will put the topic on the root level.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The topic title",
      optional: true,
    },
    tocNodeCaption: {
      type: "string",
      label: "TOC Node Caption",
      description: "Custom TOC node caption. If not specified, the topic title is used instead",
      optional: true,
    },
    tocNodeOrdinalNo: {
      type: "integer",
      label: "TOC Node Ordinal Number",
      description: "The number indicating the position of the topic's TOC node in the table of contents. If not specified, will create the topic on the last position on the respective level.",
      optional: true,
    },
    indexKeywords: {
      type: "string[]",
      label: "Index Keywords",
      description: "An array of strings containing Index Keywords to set when creating a topic",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clickhelp.createTopic({
      $,
      projectId: this.projectId,
      data: {
        assigneeUserName: this.assigneeUserName,
        id: this.id,
        ownerUserName: this.ownerUserName,
        statusName: this.statusName,
        body: this.body,
        isShownInToc: this.isShownInToc,
        parentToNodeId: this.parentToNodeId,
        title: this.title,
        tocNodeCaption: this.tocNodeCaption,
        tocNodeOrdinalNo: this.tocNodeOrdinalNo,
        indexKeywords: this.indexKeywords,
      },
    });
    $.export("$summary", `Successfully created topic with taskKey ${response.id}`);
    return response;
  },
};
