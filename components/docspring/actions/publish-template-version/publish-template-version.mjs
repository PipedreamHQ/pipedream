import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-publish-template-version",
  name: "Publish Template Version",
  description: "Publish the template's draft as a new version, so new PDFs use it by default. Returns the version, with its number."
    + " Use **Generate PDF** with **Template Version** to use another version."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/post/templates/{template_id}/publish_version)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
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
    versionType: {
      type: "string",
      label: "Version Type",
      description: "Which part of the latest version number to increase: `patch` (1.2.3 to 1.2.4), `minor` (1.2.3 to 1.3.0) or `major` (1.2.3 to 2.0.0). e.g. `minor`.",
      options: [
        "patch",
        "minor",
        "major",
      ],
      default: "patch",
    },
    description: {
      type: "string",
      label: "Description",
      description: "What changed in this version, shown with it in DocSpring, e.g. `Added a second signer`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const version = await this.docspring.publishTemplateVersion({
      $,
      templateId: this.templateId,
      data: utils.compact({
        version_type: this.versionType,
        description: this.description,
      }),
    });
    $.export("$summary", `Published version ${version.version} of template ${this.templateId}`);
    return version;
  },
};
