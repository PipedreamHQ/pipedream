import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";
import { POINTS } from "../../common/constants.mjs";

export default {
  key: "google_docs-insert-image",
  name: "Insert Image",
  description: "Insert an inline image into a Google Doc from a publicly reachable image URL. The URL must be publicly accessible (Google fetches it server-side) and point to a PNG, JPEG, or GIF. Set **Width** and/or **Height** to control the display size. Docs preserves the image's aspect ratio, so setting one scales the other, and setting both may adjust one of them to fit (a 272x92 image asked for 150x51 PT comes back 150x50.7). An image already in the document cannot be resized in place - delete it and insert it again at the size you want. Use **Find Document** to resolve a document's name to its ID. In a multi-tab document, set **Tab ID** to choose which tab receives the image - without it the image goes into the document's first tab; use **List Tabs** to get the IDs. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest)",
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    imageUri: {
      type: "string",
      label: "Image URL",
      description: "A publicly reachable URL of the image to insert (PNG, JPEG, or GIF). Example: `https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png`.",
    },
    position: {
      propDefinition: [
        googleDocs,
        "position",
      ],
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Optional display width in points (1 inch = 72 PT), e.g. `200`. Docs keeps the image's aspect ratio, so **Height** scales with this unless it is also set - and when both are set one may be adjusted slightly to fit. Omit both to insert at the image's natural size.",
      min: 1,
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Optional display height in points (1 inch = 72 PT), e.g. `150`. Docs keeps the image's aspect ratio, so **Width** scales with this unless it is also set - and when both are set one may be adjusted slightly to fit. Omit both to insert at the image's natural size.",
      min: 1,
      optional: true,
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "contentTabId",
      ],
    },
    fields: {
      propDefinition: [
        googleDocs,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    if (this.tabId && this.fields) {
      throw new ConfigurationError("Tab ID cannot be combined with a Fields mask: a mask selects top-level document fields, while a tab response is assembled separately. Remove the Fields mask or omit the Tab ID.");
    }
    await utils.validateFieldMask(this.googleDocs, this.documentId, this.fields);

    const objectSize = {
      ...(this.width && {
        width: {
          magnitude: this.width,
          unit: POINTS,
        },
      }),
      ...(this.height && {
        height: {
          magnitude: this.height,
          unit: POINTS,
        },
      }),
    };
    const request = this.googleDocs._buildRequestForPosition({
      uri: this.imageUri,
      ...(Object.keys(objectSize).length && {
        objectSize,
      }),
    }, this.position, this.tabId);
    await this.googleDocs._batchUpdate(this.documentId, "insertInlineImage", request);
    const target = this.tabId
      ? `tab ${this.tabId} of document ${this.documentId}`
      : `document ${this.documentId}`;
    $.export("$summary", `Inserted image into ${target}`);
    return this.googleDocs.getWriteResult(this.documentId, this.tabId, this.fields);
  },
};
