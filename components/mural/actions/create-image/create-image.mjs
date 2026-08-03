import mural from "../../mural.app.mjs";
import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import path from "path";
import {
  CONTENT_TYPE_EXTENSIONS,
  IMAGE_EXTENSIONS,
} from "../../common/constants.mjs";

export default {
  key: "mural-create-image",
  name: "Create Image",
  description: "Upload an image and create an image widget on a mural. The image is uploaded to Mural's storage first and the widget is created from the uploaded asset, so the file must be reachable when the action runs. Only `bmp`, `ico`, `gif`, `jpeg`, `jpg`, `png`, and `webp` files are accepted; the format is detected from the file extension, falling back to the content type. [See the documentation](https://developers.mural.co/public/reference/createimage)",
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
      propDefinition: [
        mural,
        "xPosition",
      ],
    },
    yPosition: {
      propDefinition: [
        mural,
        "yPosition",
      ],
    },
    width: {
      propDefinition: [
        mural,
        "width",
      ],
      optional: false,
    },
    height: {
      propDefinition: [
        mural,
        "height",
      ],
      optional: false,
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
      propDefinition: [
        mural,
        "hidden",
      ],
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
      description: "The ID of the area widget that should contain this image, for example `0-12345`. When set, **X Position** and **Y Position** are measured from the area's top-left corner instead of the mural's.",
      optional: true,
    },
  },
  methods: {
    getFileExtension(filePath, metadata) {
      const ext = path.extname(metadata?.name || filePath || "")
        .replace(/^\./, "")
        .toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        return ext;
      }
      const mappedExtension = CONTENT_TYPE_EXTENSIONS[metadata?.contentType];
      if (mappedExtension) {
        return mappedExtension;
      }
      throw new ConfigurationError(`Unsupported image format. Mural accepts ${IMAGE_EXTENSIONS.join(", ")}, but the file "${metadata?.name || filePath}" resolved to extension "${ext || "none"}" and content type "${metadata?.contentType || "none"}".`);
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

    if (!assetResponse?.value) {
      throw new ConfigurationError("Mural did not return the asset upload details.");
    }

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
