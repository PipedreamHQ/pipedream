import app from "../../papyrs.app.mjs";
import options from "../../common/enums.mjs";

export default {
  name: "Update Heading",
  description: "Update Heading. [See the docs here](https://about.papyrs.com/@docs/API#Update-Text-box/Heading)",
  key: "papyrs-update-heading",
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
    styleClass: {
      type: "string",
      label: "Style Class",
      description: "The style class of the heading.",
      options: options.CREATE_HEADING_STYLE_CLASS,
      optional: true,
    },
    heading: {
      type: "string",
      label: "Heading",
      description: "The size of the heading. `h0` is largest, `h4` is smallest.",
      options: options.CREATE_HEADING_HEADING,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      widget: {
        val: this.value,
        format: this.format,
        styleclass: this.styleClass,
        heading: this.heading,
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
