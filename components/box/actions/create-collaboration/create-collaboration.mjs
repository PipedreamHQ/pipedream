import app from "../../box.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "box-create-collaboration",
  name: "Create Collaboration",
  description: "Adds a collaboration for a user or group on a file or folder, granting them access. [See the documentation](https://developer.box.com/reference/post-collaborations/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    itemType: {
      type: "string",
      label: "Item Type",
      description: "The type of item to share",
      options: constants.itemTypes,
      reloadProps: true,
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder to share, or the parent folder used to select a file when Item Type is File",
      optional: false,
    },
    accessibleByType: {
      type: "string",
      label: "Collaborator Type",
      description: "The type of collaborator to invite",
      options: constants.accessibleByTypes,
      reloadProps: true,
    },
    identifyBy: {
      type: "string",
      label: "Identify By",
      description: "How to identify the collaborator. Users can be invited by email or ID; groups must be invited by ID.",
      options: [
        {
          label: "Email",
          value: "email",
        },
        {
          label: "ID",
          value: "id",
        },
      ],
      reloadProps: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The level of access granted",
      options: constants.collaborationRoles,
    },
    notify: {
      type: "boolean",
      label: "Notify",
      description: "Whether to notify the collaborator via email",
      optional: true,
      default: true,
    },
    canViewPath: {
      type: "boolean",
      label: "Can View Path",
      description: "Whether the collaborator can view the parent path to the item. Only applicable for folder collaborations.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};

    if (this.itemType === "file") {
      props.fileId = {
        propDefinition: [
          app,
          "fileId",
          (c) => ({
            folderId: c.folderId,
          }),
        ],
        label: "File",
        description: "The file to share",
      };
    }

    if (this.identifyBy === "email") {
      props.login = {
        type: "string",
        label: "Email",
        description: "The email address of the user to invite",
      };
    } else if (this.identifyBy === "id") {
      props.accessibleById = {
        type: "string",
        label: "Collaborator ID",
        description: `The ID of the ${this.accessibleByType || "user or group"} to invite`,
      };
    }

    return props;
  },
  async run({ $ }) {
    const itemId = this.itemType === "file"
      ? this.fileId
      : this.folderId;
    if (!itemId) {
      throw new Error(`${this.itemType === "file"
        ? "File"
        : "Folder"} ID is required.`);
    }

    const accessibleBy = {
      type: this.accessibleByType,
    };
    if (this.identifyBy === "email") {
      accessibleBy.login = this.login;
    } else {
      accessibleBy.id = this.accessibleById;
    }

    const data = {
      item: {
        type: this.itemType,
        id: itemId,
      },
      accessible_by: accessibleBy,
      role: this.role,
    };
    if (this.canViewPath !== undefined) {
      data.can_view_path = this.canViewPath;
    }

    const params = {};
    if (this.notify !== undefined) {
      params.notify = this.notify;
    }

    const response = await this.app.createCollaboration({
      $,
      params,
      data,
    });

    const target = this.login || this.accessibleById;
    $.export("$summary", `Successfully invited ${target} as ${this.role}`);

    return response;
  },
};
