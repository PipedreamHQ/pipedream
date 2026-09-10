import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-generate-pdf",
  name: "Generate PDF",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Fill out a template and generate a PDF. [See the documentation](https://docspring.com/docs).",
  type: "action",
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
    data: {
      propDefinition: [
        docspring,
        "data",
      ],
    },
    test: {
      propDefinition: [
        docspring,
        "test",
      ],
    },
    password: {
      type: "string",
      label: "Encrypt PDF With Passphrase",
      description: "Password used to encrypt and open the generated PDF.",
      optional: true,
      secret: true,
    },
    expiresIn: {
      type: "integer",
      label: "Expires In (Seconds)",
      description: "Seconds until the submission data and PDF are deleted.",
      optional: true,
    },
    version: {
      type: "string",
      label: "Template Version",
      description: "A specific published version, or \"draft\".",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata to store with the submission, as a JSON object — e.g. `{\"caseId\":\"123\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = {
      data: this.data || {},
      test: this.test ?? false,
    };
    if (this.password) body.password = this.password;
    if (this.expiresIn) body.expires_in = this.expiresIn;
    if (this.version) body.version = this.version;
    if (this.metadata) body.metadata = this.metadata;

    const response = await this.docspring.generatePdf({
      $,
      templateId: this.templateId,
      data: body,
    });
    const submission = response.submission || response;
    $.export("$summary", `Generated PDF submission \`${submission.id}\` (${submission.state})`);
    return submission;
  },
};
