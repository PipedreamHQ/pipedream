import app from "../../parsera.app.mjs";

export default {
  key: "parsera-extract",
  name: "Extract",
  description: "Extract data from a given URL. [See the documentation](https://docs.parsera.org/api/getting-started/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to extract information from.",
    },
    attributes: {
      propDefinition: [
        app,
        "attributes",
      ],
    },
    proxyCountry: {
      propDefinition: [
        app,
        "proxyCountry",
      ],
    },
  },
  methods: {
    extract(args = {}) {
      return this.app.post({
        path: "/extract",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      extract,
      url,
      attributes,
      proxyCountry,
    } = this;

    const response = await extract({
      $,
      data: {
        url,
        attributes: Array.isArray(attributes) && attributes.map(JSON.parse),
        proxy_country: proxyCountry,
      },
    });
    $.export("$summary", "Successfully extracted data from url.");
    return response;
  },
};
