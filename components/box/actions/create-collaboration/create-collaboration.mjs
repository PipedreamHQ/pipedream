import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "box-create-collaboration",
  name: "Create Collaboration",
  description: "Adds a collaboration for a user or group on a file or folder, granting them access with a role (editor, viewer, previewer, uploader, previewer uploader, viewer uploader, or co-owner). Item Type must be `file` or `folder`. Invite users by email or user ID; groups must be invited by group ID only. Can View Path applies only to folder collaborations. Use **Delete Collaboration** to revoke access. [See the documentation](https://developer.box.com/reference/post-collaborations/).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder to add a collaboration to when Item Type is `folder`. When Item Type is `file`, this instead scopes the File dropdown to a parent folder. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
      optional: false,
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
      label: "File",
      description: "The file to add a collaboration to (e.g. `123456789`). Required when Item Type is `file`. Use the **List Folder Items** action to retrieve file IDs.",
      optional: true,
    },
    canViewPath: {
      type: "boolean",
      label: "Can View Path",
      description: "Whether the collaborator can view the parent path to the folder. Only applicable when Item Type is `folder`.",
      optional: true,
    },
    accessibleByType: {
      type: "string",
      label: "Collaborator Type",
      description: "The type of collaborator to invite. Valid values: `user` or `group`. Groups must be identified by ID (not email).",
      options: constants.accessibleByTypes,
    },
    identifyBy: {
      type: "string",
      label: "Identify By",
      description: "How to identify the user collaborator: by email or by ID. Only applicable when Collaborator Type is `user` (groups are always identified by ID via Collaborator ID).",
      optional: true,
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
    },
    login: {
      type: "string",
      label: "Email",
      description: "The email address of the user to invite (e.g. `user@example.com`). Required when Collaborator Type is `user` and Identify By is `email`.",
      optional: true,
    },
    accessibleById: {
      type: "string",
      label: "Collaborator ID",
      description: "The ID of the user or group to invite (e.g. `123456789`). Required when Collaborator Type is `group`, or when Collaborator Type is `user` and Identify By is `id`.",
      optional: true,
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
  async run({ $ }) {
    const itemId = this.itemType === "file"
      ? this.fileId
      : this.folderId;
    if (!itemId) {
      throw new ConfigurationError(`${this.itemType === "file"
        ? "File"
        : "Folder"} ID is required.`);
    }

    let accessibleBy;
    if (this.accessibleByType === "group") {
      if (!this.accessibleById) {
        throw new ConfigurationError("Collaborator ID is required when Collaborator Type is `group`.");
      }
      accessibleBy = {
        type: "group",
        id: this.accessibleById,
      };
    } else if (this.accessibleByType === "user") {
      if (!this.identifyBy) {
        throw new ConfigurationError("Identify By is required when Collaborator Type is `user`.");
      }
      if (this.identifyBy === "email") {
        if (!this.login) {
          throw new ConfigurationError("Email is required when Identify By is `email`.");
        }
        accessibleBy = {
          type: "user",
          login: this.login,
        };
      } else {
        if (!this.accessibleById) {
          throw new ConfigurationError("Collaborator ID is required when Identify By is `id`.");
        }
        accessibleBy = {
          type: "user",
          id: this.accessibleById,
        };
      }
    } else {
      throw new ConfigurationError("Collaborator Type is required.");
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
