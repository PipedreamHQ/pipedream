import mural from "../../mural.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import path from "path";

export default {
  key: "mural-create-image",
  name: "Create Image",
  description: "Upload an image and create an image widget on a mural. [See the documentation](https://developers.mural.co/public/reference/createimage)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mural,
    workspaceId: {
      propDefinition: [
        mural,
        "workspaceId",
      ],
    },
    muralId: {
      propDefinition: [
        mural,
        "muralId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The image to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myImage.png`). Supported formats: bmp, ico, gif, jpeg, jpg, png, webp.",
      format: "file-ref",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
    xPosition: {
      type: "integer",
      label: "X Position",
      description: "The horizontal position of the widget in px. This is the distance from the left of the parent widget, such as an area. If the widget has no parent widget, this is the distance from the left of the mural.",
    },
    yPosition: {
      type: "integer",
      label: "Y Position",
      description: "The vertical position of the widget in px. This is the distance from the top of the parent widget, such as an area. If the widget has no parent widget, this is the distance from the top of the mural.",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the widget in px",
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the widget in px",
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "The caption and outline title of the image widget",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The caption description text of the image widget",
      optional: true,
    },
    border: {
      type: "boolean",
      label: "Border",
      description: "If `true`, a black border is displayed around the widget",
      optional: true,
    },
    showCaption: {
      type: "boolean",
      label: "Show Caption",
      description: "When `true`, captions will be displayed for the image widget",
      optional: true,
    },
    hidden: {
      type: "boolean",
      label: "Hidden",
      description: "If `true`, the widget is hidden from non-facilitators. Applies only when the widget is in the outline",
      optional: true,
    },
    parentId: {
      propDefinition: [
        mural,
        "widgetId",
        (c) => ({
          muralId: c.muralId,
          type: "areas",
        }),
      ],
      label: "Parent ID",
      description: "The ID of the area widget that contains the widget",
      optional: true,
    },
  },
  methods: {
    getFileExtension(filePath, metadata) {
      const ext = path.extname(metadata?.name || filePath || "")
        .replace(/^\./, "")
        .toLowerCase();
      const allowed = [
        "bmp",
        "ico",
        "gif",
        "jpeg",
        "jpg",
        "png",
        "webp",
      ];
      if (allowed.includes(ext)) {
        return ext === "jpeg"
          ? "jpeg"
          : ext;
      }
      const contentType = metadata?.contentType || "";
      const typeMap = {
        "image/png": "png",
        "image/jpeg": "jpeg",
        "image/jpg": "jpg",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/bmp": "bmp",
        "image/x-icon": "ico",
        "image/vnd.microsoft.icon": "ico",
      };
      return typeMap[contentType] || "png";
    },
  },
  async run({ $ }) {
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const fileExtension = this.getFileExtension(this.filePath, metadata);

    const assetResponse = await this.mural.createAssetUrl({
      $,
      muralId: this.muralId,
      data: {
        fileExtension,
      },
    });

    const {
      url,
      name,
      headers,
    } = assetResponse.value;

    await this.mural.uploadAsset({
      $,
      url,
      headers,
      data: stream,
    });

    const response = await this.mural.createImage({
      $,
      muralId: this.muralId,
      data: {
        name,
        x: this.xPosition,
        y: this.yPosition,
        width: this.width,
        height: this.height,
        caption: this.caption,
        description: this.description,
        border: this.border,
        showCaption: this.showCaption,
        hidden: this.hidden,
        parentId: this.parentId,
      },
    });

    $.export("$summary", `Successfully created image widget with ID: ${response.value.id}`);
    return response;
  },
};
