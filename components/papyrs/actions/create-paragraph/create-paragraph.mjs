import app from "../../papyrs.app.mjs";
import options from "../../common/enums.mjs";

export default {
  name: "Create Paragraph",
  description: "Create a new Paragraph in a page. [See the docs here](https://about.papyrs.com/@docs/API#Create-Text-box/Heading)",
  key: "papyrs-create-paragraph",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    },
    page: {
      propDefinition: [
        app,
        "page",
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
    const res = await this.app.createParagraph(
      data,
      this.page,
      this.subsite,
      $,
    );
    $.export("$summary", "Pargraph successfully created");
    return res;
  },
};
