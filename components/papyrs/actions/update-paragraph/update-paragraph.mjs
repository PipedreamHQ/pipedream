import app from "../../papyrs.app.mjs";
import options from "../../common/enums.mjs";

export default {
  name: "Update Paragraph",
  description: "Update Paragraph. [See the docs here](https://about.papyrs.com/@docs/API#Update-Text-box/Heading)",
  key: "papyrs-update-paragraph",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    subsite: {
      propDefinition: [
        app,
        "subsite",
      ],
      optional: false,
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    widget: {
      propDefinition: [
        app,
        "widget",
        ({
          page,
          subsite,
        }) => ({
          pageId: page,
          subsite,
          className: "Paragraph",
        }),
      ],
    },
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
    styleClass: {
      type: "string",
      label: "Style Class",
      description: "The style class of the paragraph.",
      options: options.CREATE_PARAGRAPH_STYLE_CLASS,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      widget: {
        val: this.value,
        format: this.format,
        styleclass: this.styleClass,
      },
    };
    const res = await this.app.updateParagraph(
      data,
      this.widget,
      this.page,
      this.subsite,
      $,
    );
    $.export("$summary", "Paragraph successfully updated");
    return res;
  },
};
