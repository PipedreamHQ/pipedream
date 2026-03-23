import { getFileStream } from "@pipedream/platform";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import templatefox from "../../templatefox.app.mjs";

export default {
  key: "templatefox-generate-pdf",
  name: "Generate PDF",
  description: "Generate a PDF document from a template with dynamic data. The PDF is saved to `/tmp` for use in downstream steps (Google Drive, Gmail, Slack, etc.). [See the documentation](https://pdftemplateapi.com/docs/api/generate-pdf)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    templatefox,
    templateId: {
      type: "string",
      label: "Template",
      description: "Select a template for PDF generation",
      reloadProps: true,
      async options() {
        try {
          const { templates } = await this.templatefox.listTemplates();
          return templates.map((t) => ({
            label: t.name,
            value: t.id,
          }));
        } catch {
          return [];
        }
      },
    },
    useJsonMode: {
      type: "boolean",
      label: "Use JSON Mode",
      description: "Pass all template data as a single JSON object instead of individual fields",
      default: false,
      reloadProps: true,
    },
    expiration: {
      propDefinition: [
        templatefox,
        "expiration",
      ],
    },
    filename: {
      propDefinition: [
        templatefox,
        "filename",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.useJsonMode) {
      props.data = {
        type: "object",
        label: "Template Data (JSON)",
        description: "Key-value pairs to populate the template. Keys must match the template's variable names.",
      };
      return props;
    }
    if (!this.templateId) return props;
    try {
      const fields = await this.templatefox.getTemplateFields({
        templateId: this.templateId,
      });
      for (const field of fields) {
        if (field.type === "array" && field.spec?.length) {
          const toggleKey = `arrayMode_${field.key}`;
          props[toggleKey] = {
            type: "boolean",
            label: `${field.label || field.key} — Use JSON`,
            description: "Toggle on to pass this list as a JSON array, or keep off to map each column individually",
            default: false,
            reloadProps: true,
          };
          if (this[toggleKey]) {
            props[`field_${field.key}`] = {
              type: "string",
              label: field.label || field.key,
              description: `JSON array — e.g. [${JSON.stringify(Object.fromEntries(field.spec.map((s) => [
                s.name,
                s.type === "number"
                  ? 0
                  : "...",
              ])))}]`,
              optional: !field.required,
            };
          } else {
            for (const col of field.spec) {
              props[`array_${field.key}__${col.name}`] = {
                type: "string[]",
                label: `${field.label || field.key} → ${col.label || col.name}`,
                description: col.type === "number"
                  ? "Numeric values for each row"
                  : "Values for each row",
                optional: !field.required,
              };
            }
          }
        } else if (field.type === "boolean") {
          props[`field_${field.key}`] = {
            type: "boolean",
            label: field.label || field.key,
            description: field.helpText || "",
            optional: !field.required,
          };
        } else {
          props[`field_${field.key}`] = {
            type: "string",
            label: field.label || field.key,
            description: field.helpText || "",
            optional: !field.required,
          };
        }
      }
    } catch {
      // Field discovery failed — user can switch to JSON mode
    }
    return props;
  },
  async run({ $ }) {
    let data;
    if (this.useJsonMode) {
      data = this.data;
    } else {
      data = {};
      for (const [
        key,
        value,
      ] of Object.entries(this)) {
        if (key.startsWith("field_")) {
          const fieldName = key.slice(6);
          if (typeof value === "string" && value.startsWith("[")) {
            try {
              data[fieldName] = JSON.parse(value);
            } catch (e) {
              throw new Error(`Invalid JSON for field "${fieldName}": ${e.message}`);
            }
          } else {
            data[fieldName] = value;
          }
        }
      }
      // Zip mapped array columns into row objects
      const arrayFields = {};
      for (const [
        key,
        value,
      ] of Object.entries(this)) {
        if (key.startsWith("array_")) {
          const rest = key.slice(6);
          const sepIdx = rest.indexOf("__");
          if (sepIdx === -1) continue;
          const fieldKey = rest.slice(0, sepIdx);
          const colName = rest.slice(sepIdx + 2);
          if (!arrayFields[fieldKey]) arrayFields[fieldKey] = {};
          arrayFields[fieldKey][colName] = Array.isArray(value)
            ? value
            : [
              value,
            ];
        }
      }
      for (const [
        fieldKey,
        columns,
      ] of Object.entries(arrayFields)) {
        const colNames = Object.keys(columns);
        const maxLen = Math.max(...colNames.map((c) => columns[c].length));
        const rows = [];
        for (let i = 0; i < maxLen; i++) {
          const row = {};
          for (const col of colNames) {
            row[col] = columns[col][i] ?? "";
          }
          rows.push(row);
        }
        data[fieldKey] = rows;
      }
    }

    const pdfFilename = this.filename?.endsWith(".pdf")
      ? this.filename
      : `${this.filename || "output"}.pdf`;

    const body = {
      template_id: this.templateId,
      data,
      export_type: "url",
    };
    if (this.expiration) body.expiration = this.expiration;
    if (this.filename) body.filename = this.filename;

    const response = await this.templatefox.generatePDF({
      $,
      body,
    });

    // Download PDF to /tmp for downstream steps (Google Drive, Gmail, Slack, etc.)
    const filePath = `/tmp/${pdfFilename}`;
    try {
      const stream = await getFileStream(response.url);
      await pipeline(stream, createWriteStream(filePath));
    } catch {
      $.export("$summary", `PDF generated (${response.credits_remaining} credits remaining) — download to /tmp failed, use the URL instead`);
      return response;
    }

    $.export("$summary", `PDF generated and saved to ${filePath} (${response.credits_remaining} credits remaining)`);
    return {
      ...response,
      filePath,
      fileName: pdfFilename,
    };
  },
};
