import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-replace-template-pdf",
  name: "Replace Template PDF",
  description: "Replace a PDF template's PDF with a new one (a public URL or a file in `/tmp`), keeping its fields where they are,"
    + " or replacing them with the new PDF's form fields with **Reimport Fields**. Published versions keep their PDF; this changes the draft."
    + " Returns the template; `document.state` says how the new PDF is processing. Use **Publish Template Version** to publish the change."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/put/templates/{template_id}/document)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
    document: {
      propDefinition: [
        docspring,
        "document",
      ],
    },
    filename: {
      propDefinition: [
        docspring,
        "filename",
      ],
    },
    reimportFields: {
      type: "boolean",
      label: "Reimport Fields",
      description: "`true` replaces all of the template's fields with the new PDF's fillable form fields. `false` (the default) keeps the template's fields. e.g. `false`.",
      optional: true,
    },
    wait: {
      propDefinition: [
        docspring,
        "wait",
      ],
      description: "`true` (the default) waits until the new PDF has been downloaded and processed. `false` returns at once:"
        + " check `document.state` later with **Get Template**. e.g. `true`.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const wait = utils.toBoolean(this.wait, "Wait for the PDF") ?? true;
    const template = await this.docspring.updateTemplateDocument({
      $,
      templateId: this.templateId,
      params: {
        wait,
      },
      data: utils.compact({
        ...(await utils.documentParams(this.document, this.filename)),
        reimport_fields: utils.toBoolean(this.reimportFields, "Reimport Fields"),
      }),
    });
    const failure = utils.failureMessage("template", template);
    if (failure) {
      throw new Error(failure);
    }
    $.export("$summary", `Replaced the PDF of template ${template.id}: ${template.name}`);
    return template;
  },
};
