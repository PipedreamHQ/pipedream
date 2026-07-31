// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "box-create-collaboration",
  name: "Create Collaboration",
  description: "Adds a collaboration for a user or group on a file or folder, granting them access with a role (editor, viewer, previewer, uploader, previewer uploader, viewer uploader, or co-owner). Item Type must be `file` or `folder`. Invite users by email or user ID; groups must be invited by group ID only. Can View Path applies only to folder collaborations. Use **Delete Collaboration** to revoke access. [See the documentation](https://developer.box.com/reference/post-collaborations/).",
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
      propDefinition: [
        app,
        "itemType",
      ],
      reloadProps: true,
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      optional: false,
    },
    accessibleByType: {
      type: "string",
      label: "Collaborator Type",
      description: "The type of collaborator to invite. Valid values: `user` or `group`. Groups must be identified by ID (not email).",
      options: constants.accessibleByTypes,
      reloadProps: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The level of access granted. Valid values: `editor`, `viewer`, `previewer`, `uploader`, `previewer uploader`, `viewer uploader`, `co-owner`.",
      options: constants.collaborationRoles,
    },
    notify: {
      type: "boolean",
      label: "Notify",
      description: "Whether to notify the collaborator via email",
      optional: true,
      default: true,
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
      };
    }

    if (this.itemType === "folder") {
      props.canViewPath = {
        type: "boolean",
        label: "Can View Path",
        description: "Whether the collaborator can view the parent path to the folder. Only applicable for folder collaborations.",
        optional: true,
      };
    }

    if (this.accessibleByType === "group") {
      props.accessibleById = {
        type: "string",
        label: "Collaborator ID",
        description: "The ID of the group to invite (e.g. `123456789`). Groups cannot be invited by email.",
      };
    } else if (this.accessibleByType === "user") {
      props.identifyBy = {
        type: "string",
        label: "Identify By",
        description: "How to identify the user collaborator. Users can be invited by email or ID.",
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
      };

      if (this.identifyBy === "email") {
        props.login = {
          type: "string",
          label: "Email",
          description: "The email address of the user to invite (e.g. `user@example.com`)",
        };
      } else if (this.identifyBy === "id") {
        props.accessibleById = {
          type: "string",
          label: "Collaborator ID",
          description: "The ID of the user to invite (e.g. `123456789`)",
        };
      }
    }

    return props;
  },
  async run({ $ }) {
    const itemId = this.itemType === "file"
      ? this.fileId
      : this.folderId;
    if (!itemId) {
      throw new ConfigurationError(`${this.itemType === "file"
        ? "File"
        : "Folder"} ID is required.`);
    }

    if (this.accessibleByType === "group" && this.identifyBy === "email") {
      throw new ConfigurationError("Groups must be invited by Collaborator ID, not email.");
    }

    const accessibleBy = {
      type: this.accessibleByType,
    };
    if (this.accessibleByType === "group" || this.identifyBy === "id") {
      if (!this.accessibleById) {
        throw new ConfigurationError("Collaborator ID is required.");
      }
      accessibleBy.id = this.accessibleById;
    } else {
      if (!this.login) {
        throw new ConfigurationError("Email is required when identifying by email.");
      }
      accessibleBy.login = this.login;
    }

    const data = {
      item: {
        type: this.itemType,
        id: itemId,
      },
      accessible_by: accessibleBy,
      role: this.role,
    };
    if (this.itemType === "folder" && this.canViewPath !== undefined) {
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

    $.export("$summary", `Successfully created collaboration ${response.id} with role ${this.role}`);

    return response;
  },
};
