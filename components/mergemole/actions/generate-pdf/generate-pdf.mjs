import mergemole from "../../mergemole.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "mergemole-generate-pdf",
  name: "Generate PDF",
  description: "Generate a PDF document based on the specified template. [See the documentation](https://documenter.getpostman.com/view/41321603/2sB2j3AWqz#a389449f-ada9-4e2e-9d8a-f1bde20da980)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mergemole,
    templateId: {
      propDefinition: [
        mergemole,
        "templateId",
      ],
      reloadProps: true,
    },
    documentName: {
      type: "string",
      label: "Document Name",
      description: "The name of the generated PDF document",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.templateId) {
      return props;
    }
    const templateVariables = await this.mergemole.getTemplateVariables({
      templateId: this.templateId,
    });
    if (!templateVariables?.length) {
      throw new ConfigurationError(`No template variables found for template \`${this.templateId}\``);
    }
    for (const variable of templateVariables) {
      props[variable.key] = {
        type: "string",
        label: variable.label,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      mergemole,
      templateId,
      documentName,
      ...templateVariables
    } = this;

    const data = [];
    for (const [
      key,
      value,
    ] of Object.entries(templateVariables)) {
      data.push({
        placeholder: key,
        value,
      });
    }

    const response = await mergemole.generatePdf({
      $,
      data: {
        data,
        template_id: templateId,
        document_name: documentName,
      },
      responseType: "arraybuffer",
    });

    const filePath = `${process.env.STASH_DIR || "/tmp"}/${documentName}`;
    fs.writeFileSync(filePath, Buffer.from(response));

    $.export("$summary", "Successfully generated PDF");

    return {
      filename: documentName,
      downloadedFilepath: filePath,
    };
  },
};
