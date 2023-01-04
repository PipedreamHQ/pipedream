import app from "../../papyrs.app.mjs";
import options from "../common/enums.mjs";

export default {
  name: "Create Text Box",
  description: "Create Text Box. [See the docs here](https://papyrs.com/docs/api)",
  key: "papyrs-create-text-box",
  version: "0.0.1",
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
      type: "string",
      label: "Value",
      description: "The value of the text box.",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the text box. Defaults to `html`.",
      options: options.CREATE_TEXT_BOX_FORMAT,
      optional: true,
    },
    styleClass: {
      type: "string",
      label: "Style Class",
      description: "The style class of the text box.",
      options: options.CREATE_TEXT_BOX_STYLE_CLASS,
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
    const res = await this.app.createTextBox(
      data,
      this.page,
      this.subsite,
      $,
    );
    console.log(res);
    $.export("$summary", "Text Box successfully created");
    return res;
  },
};
