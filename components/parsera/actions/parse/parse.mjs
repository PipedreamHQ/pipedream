import app from "../../parsera.app.mjs";

export default {
  key: "parsera-parse",
  name: "Parse",
  description: "Parse data using pre-defined attributes. [See the documentation](https://docs.parsera.org/api/getting-started/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    content: {
      type: "string",
      label: "Content",
      description: "The content to parse. HTML or text content. Eg. `<h1>Hello World</h1>`.",
    },
    attributes: {
      propDefinition: [
        app,
        "attributes",
      ],
    },
  },
  methods: {
    parse(args = {}) {
      return this.app.post({
        path: "/parse",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      parse,
      content,
      attributes,
    } = this;

    const response = await parse({
      $,
      data: {
        content,
        attributes: Array.isArray(attributes) && attributes.map(JSON.parse),
      },
    });

    $.export("$summary", "Successfully parsed content.");

    return response;
  },
};
