import { writeFileSync } from "fs";
import {
  basename, resolve,
} from "path";
import app from "../../templatedocs.app.mjs";

export default {
  key: "templatedocs-generate-document",
  name: "Generate Document",
  description: "Generate a document by merging data with a template's placeholders. Returns the document as a file saved to `/tmp`. [See the documentation](https://templatedocs.io/docs/api/templates/generate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
      reloadProps: true,
    },
    format: {
      type: "string",
      label: "Output Format",
      description: "The output format of the generated document. Defaults to `docx`.",
      options: [
        "docx",
        "pdf",
      ],
      optional: true,
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "Custom filename for the generated file (e.g. `invoice.pdf`). If not specified, defaults to `generated-document.docx` or `generated-document.pdf`. The file is saved to the `/tmp` directory.",
      optional: true,
    },
    emailTo: {
      type: "string[]",
      label: "Email To",
      description: "Primary recipients to email the generated document to.",
      optional: true,
    },
    emailCc: {
      type: "string[]",
      label: "Email CC",
      description: "Carbon copy recipients for email delivery.",
      optional: true,
    },
    emailBcc: {
      type: "string[]",
      label: "Email BCC",
      description: "Blind carbon copy recipients for email delivery.",
      optional: true,
    },
    emailSubject: {
      type: "string",
      label: "Email Subject",
      description: "Custom subject line for email delivery.",
      optional: true,
    },
    emailBody: {
      type: "string",
      label: "Email Body",
      description: "Text or HTML body content for email delivery.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    getTagPropKey(name) {
      return `tag_${name.replace(/[^a-zA-Z0-9_]/g, "_")}`;
    },
  },
  async additionalProps() {
    if (!this.templateId) return {};

    const { tags } = await this.app.getTemplate({
      templateId: this.templateId,
    });

    if (!tags?.length) return {};

    return tags.reduce((props, tag) => {
      const key = this.getTagPropKey(tag.name);
      const isContainer = tag.shape === "container";
      const childrenList = tag.children?.length
        ? ` Expected keys per item: ${tag.children.map(({ name }) => `\`${name}\``).join(", ")}.`
        : "";

      props[key] = {
        type: "string",
        label: tag.name,
        description: isContainer
          ? `JSON array of objects for the \`${tag.name}\` repeating section.${childrenList} Example: \`[{"key": "value"}]\``
          : `Value for the \`${tag.name}\` placeholder.`,
        optional: true,
      };
      return props;
    }, {});
  },
  async run({ $ }) {
    const { tags } = await this.app.getTemplate({
      $,
      templateId: this.templateId,
    });

    const data = (tags ?? []).reduce((acc, {
      name, shape,
    }) => {
      const value = this[this.getTagPropKey(name)];
      if (value === undefined || value === null || value === "") return acc;
      if (shape === "container") {
        try {
          acc[name] = JSON.parse(value);
        } catch (err) {
          throw new Error(`Invalid JSON for tag "${name}": ${err.message}`);
        }
      } else {
        acc[name] = value;
      }
      return acc;
    }, {});

    const output = {};
    if (this.format) {
      output.format = this.format;
    }
    if (this.outputFilename) {
      output.filename = this.outputFilename;
    }
    if (this.emailTo?.length) {
      output.email = {
        to: this.emailTo,
      };
      if (this.emailCc) {
        output.email.cc = this.emailCc;
      }
      if (this.emailBcc) {
        output.email.bcc = this.emailBcc;
      }
      if (this.emailSubject) {
        output.email.subject = this.emailSubject;
      }
      if (this.emailBody) {
        output.email.body = this.emailBody;
      }
    }

    const requestBody = {
      data,
    };
    if (Object.keys(output).length) {
      requestBody.output = output;
    }

    let response;
    try {
      response = await this.app.generateDocument({
        $,
        templateId: this.templateId,
        responseType: "arraybuffer",
        data: requestBody,
      });
    } catch (err) {
      const raw = err?.response?.data;
      if (raw) {
        const text = Buffer.from(raw).toString("utf-8");
        try {
          const parsed = JSON.parse(text);
          throw new Error(parsed.message || text);
        } catch (parseErr) {
          if (parseErr === err) throw err;
          throw new Error(text);
        }
      }
      throw err;
    }

    const ext = this.format || "docx";
    const rawName = this.outputFilename
      ? basename(this.outputFilename)
      : `generated-document.${ext}`;
    const dotIndex = rawName.lastIndexOf(".");
    const stem = dotIndex !== -1
      ? rawName.slice(0, dotIndex)
      : rawName;
    const filename = `${stem}.${ext}`;
    const filePath = resolve("/tmp", filename);
    if (!filePath.startsWith("/tmp/")) {
      throw new Error(`Invalid output filename: resolved path "${filePath}" is outside /tmp`);
    }

    writeFileSync(filePath, Buffer.from(response));

    $.export("$summary", `Successfully generated document saved to \`${filePath}\``);
    return {
      filePath,
      filename,
    };
  },
};
