// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "box-create-shared-link",
  name: "Create Shared Link",
  description: "Creates or updates a shared link for a file or folder. Access levels: `open`, `company`, or `collaborators`. Password and download permission apply only when access is `open` or `company`. A resource can have only one shared link at a time. [See the documentation](https://developer.box.com/guides/shared-links/create-or-update/).",
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
      description: "The type of item to create a shared link for. Valid values: `file` or `folder`.",
      options: constants.itemTypes,
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder containing the file, or the folder to share (when item type is Folder)",
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
      description: "The file to share (e.g. `123456789`). Only used when item type is File.",
      optional: true,
    },
    access: {
      type: "string",
      label: "Access Level",
      description: "The access level for the shared link. If not set, the enterprise default is used. Valid values: `open`, `company`, `collaborators`.",
      optional: true,
      options: constants.sharedLinkAccessLevels,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to access the shared link. Can only be set when access is `open` or `company`.",
      optional: true,
      secret: true,
    },
    unsharedAt: {
      type: "string",
      label: "Unshared At",
      description: "The timestamp at which the shared link will expire. Must be in RFC3339 format, e.g. `2022-07-20T10:53:43-08:00`",
      optional: true,
    },
    canDownload: {
      type: "boolean",
      label: "Can Download",
      description: "Whether the shared link allows downloads. Only applicable when access is `open` or `company`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const sharedLink = {};
    if (this.access) {
      sharedLink.access = this.access;
    }
    if (this.password) {
      sharedLink.password = this.password;
    }
    if (this.unsharedAt) {
      sharedLink.unshared_at = this.unsharedAt;
    }
    if (this.canDownload !== undefined) {
      sharedLink.permissions = {
        can_download: this.canDownload,
      };
    }

    const params = {
      fields: "shared_link",
    };

    let response;
    if (this.itemType === "file") {
      if (!this.fileId) {
        throw new ConfigurationError("File ID is required when item type is File.");
      }
      response = await this.app.updateFile({
        $,
        fileId: this.fileId,
        params,
        data: {
          shared_link: sharedLink,
        },
      });
    } else {
      if (!this.folderId) {
        throw new ConfigurationError("Folder ID is required when item type is Folder.");
      }
      response = await this.app.updateFolder({
        $,
        folderId: this.folderId,
        params,
        data: {
          shared_link: sharedLink,
        },
      });
    }

    const url = response.shared_link?.url;
    $.export("$summary", url
      ? `Successfully created shared link: ${url}`
      : "Successfully created shared link");

    return response;
  },
};
