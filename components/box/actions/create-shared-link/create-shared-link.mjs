// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "box-create-shared-link",
  name: "Create Shared Link",
  description: "Creates or updates a shared link for a file or folder. Access levels: `open`, `company`, or `collaborators`. A password can only be set when access is `open`; download permission applies only when access is `open` or `company`. A resource can have only one shared link at a time. [See the documentation](https://developer.box.com/guides/shared-links/create-or-update/).",
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
    },
    item: {
      propDefinition: [
        app,
        "webhookTarget",
        (c) => ({
          type: c.itemType,
        }),
      ],
      label: "File or Folder",
      description: "The Box file or folder to share. The available items are filtered by Item Type (e.g. `123456789`).",
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
      description: "The password required to access the shared link. Can only be set when access is `open`.",
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
    let selectedItem;
    try {
      const parsedItem = JSON.parse(this.item);
      selectedItem = typeof parsedItem === "object"
        ? parsedItem
        : {
          id: String(parsedItem),
          type: this.itemType,
        };
    } catch {
      selectedItem = {
        id: this.item,
        type: this.itemType,
      };
    }

    if (!selectedItem?.id) {
      throw new ConfigurationError("A file or folder is required.");
    }
    if (selectedItem.type && selectedItem.type !== this.itemType) {
      throw new ConfigurationError("The selected item must match Item Type.");
    }

    const sharedLink = {
      access: this.access,
      password: this.password,
      unshared_at: this.unsharedAt,
      ...(this.canDownload !== undefined && {
        permissions: {
          can_download: this.canDownload,
        },
      }),
    };

    const params = {
      fields: "shared_link",
    };

    let response;
    if (this.itemType === "file") {
      response = await this.app.updateFile({
        $,
        fileId: selectedItem.id,
        params,
        data: {
          shared_link: sharedLink,
        },
      });
    } else {
      response = await this.app.updateFolder({
        $,
        folderId: selectedItem.id,
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
