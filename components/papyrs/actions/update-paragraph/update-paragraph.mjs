import app from "../../papyrs.app.mjs";

export default {
  name: "Update Paragraph",
  description: "Update Paragraph. [See the docs here](https://about.papyrs.com/@docs/API#Update-Text-box/Heading)",
  key: "papyrs-update-paragraph",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const data = {
      widget: {
        val: this.value,
        format: this.format,
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
