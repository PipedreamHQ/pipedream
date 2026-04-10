import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../docugenerate.app.mjs";

export default {
  key: "docugenerate-create-template",
  name: "New Template",
  description: "Creates a new document template from a file. [See the documentation](https://api.docugenerate.com/#/Template/createTemplate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    filePath: {
      type: "string",
      label: "Template File",
      description: "Template file (`.docx`, `.doc`, `.odt`, `.txt`, or `.sql`). Provide a file URL or a path under `/tmp`.",
      format: "file-ref",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The template`s name. If not provided, it will be initialized with the name of the uploaded template file.",
      optional: true,
    },
    delimiters: {
      type: "object",
      label: "Delimiters",
      description: `Delimiters used to detect the tags. If not provided, they will be determined automatically.
        \nFor example, if the tags defined in the template are [Name], [Address], etc., then the left delimiter is [ and the right delimiter is ], e.g. \`{ "left": "[", "right": "]" }\``,
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: `The physical location where the template and its generated documents are stored.
      \nThis value is optional. If omitted, the account's default region will be used.
      \nPossible values are \`us\` (United States), \`eu\` (European Union), \`uk\` (United Kingdom), and \`au\` (Australia).`,
      optional: true,
    },
    enhancedSyntax: {
      type: "boolean",
      label: "Enhanced Syntax",
      description: `Flag to determine if nested properties of objects and logical & mathematical operators can be used for this template. The default value is false.
      \nEnabling this flag make it possible to use tags like \`[item.name]\` in the template, where \`item\` is an object containing the \`name\` property.`,
      optional: true,
    },
    versioningEnabled: {
      type: "boolean",
      label: "Versioning Enabled",
      description: `Flag to enable template file versioning, preserving previous versions when a new file is uploaded.
      \nThe default value is \`true\` if the versioning feature is available, otherwhise the default value is \`false\`.
      \nThe template versioning feature is available only with the Premium and Business plans.`,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: false,
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);

    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    if (this.name) formData.append("name", this.name);
    if (this.delimiters) formData.append("delimiters", JSON.stringify(this.delimiters));
    if (this.region) formData.append("region", this.region);
    if (this.enhancedSyntax !== undefined) formData.append("enhanced_syntax", String(this.enhancedSyntax));
    if (this.versioningEnabled !== undefined) formData.append("versioning_enabled", String(this.versioningEnabled));

    const response = await this.app.createTemplate(
      $,
      formData,
      formData.getHeaders(),
    );

    $.export("$summary", `Successfully created template with ID: ${response.id}`);
    return response;
  },
};
