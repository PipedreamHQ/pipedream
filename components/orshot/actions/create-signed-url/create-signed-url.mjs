import orshot from "../../orshot.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "orshot-create-signed-url",
  name: "Create Signed URL",
  description: "Create a signed URL that renders a library template with your modifications when opened, without exposing your API key. Each open that renders counts against your plan. [See the documentation](https://orshot.com/docs/api-reference/generate-signed-url)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    orshot,
    templateId: {
      propDefinition: [
        orshot,
        "templateId",
      ],
    },
    modifications: {
      propDefinition: [
        orshot,
        "modifications",
      ],
      optional: true,
    },
    renderType: {
      type: "string",
      label: "Render Type",
      description: "The kind of output the URL renders",
      options: [
        "images",
        "pdfs",
      ],
      default: "images",
    },
    expiresAt: {
      type: "string",
      label: "Expires At",
      description: "UNIX timestamp in seconds when the URL stops working, e.g. `1744550160`, or `never`",
      default: "never",
    },
  },
  async run({ $ }) {
    const expiresAt = this.expiresAt === "never"
      ? "never"
      : Number(this.expiresAt);
    const response = await this.orshot.createSignedUrl({
      $,
      data: {
        templateId: this.templateId,
        expiresAt,
        renderType: this.renderType,
        modifications: parseObject(this.modifications),
      },
    });
    $.export("$summary", `Created signed URL for template ${this.templateId}`);
    return response;
  },
};
