import app from "../../papyrs.app.mjs";

export default {
  name: "Update Heading",
  description: "Update Heading. [See the docs here](https://about.papyrs.com/@docs/API#Update-Text-box/Heading)",
  key: "papyrs-update-heading",
  version: "0.0.14",
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
          className: "Heading",
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
    const res = await this.app.updateHeading(
      data,
      this.widget,
      this.page,
      this.subsite,
      $,
    );
    $.export("$summary", "Heading successfully updated");
    return res;
  },
};
