import clickup from "../../clickup.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "clickup-create-list",
  name: "Create List",
  description: "Creates a new list. [See the documentation](https://clickup.com/api) in **Lists / Create List** section.",
  version: "0.0.18",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
    },
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of list",
    },
    content: {
      label: "Content",
      type: "string",
      description: "The content of list",
      optional: true,
    },
    priority: {
      propDefinition: [
        clickup,
        "priorities",
      ],
      optional: true,
    },
    assignee: {
      propDefinition: [
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spaceId,
      folderId,
      name,
      content,
      priority,
      assignee,
    } = this;

    let response;

    if (!folderId) {
      response = await this.clickup.createFolderlessList({
        $,
        spaceId,
        data: {
          name,
          content,
          priority: constants.PRIORITIES[priority] || constants.PRIORITIES["Normal"],
          assignee,
        },
      });
    } else {
      response = await this.clickup.createList({
        $,
        folderId,
        data: {
          name,
          content,
          priority: constants.PRIORITIES[priority] || constants.PRIORITIES["Normal"],
          assignee,
        },
      });
    }

    $.export("$summary", "Successfully created list");

    return response;
  },
};
