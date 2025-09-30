import opengraph from "../../opengraph_io.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "opengraph_io-extract-data",
  name: "Extract Data",
  description: "Extract specific OpenGraph properties from a specified URL, such as title, image, or description. [See the docs here](https://www.opengraph.io/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    opengraph,
    url: {
      propDefinition: [
        opengraph,
        "url",
      ],
    },
    properties: {
      propDefinition: [
        opengraph,
        "properties",
      ],
    },
  },
  async run({ $ }) {
    if (!(this.properties?.length > 0)) {
      throw new ConfigurationError("Must select at least one property.");
    }

    const { openGraph } = await this.opengraph.getSiteInfo(this.url);

    const result = {};
    for (const property of this.properties) {
      result[property] = openGraph[property];
    }

    $.export("$summary", `Successfully extracted properties for site ${this.url}`);

    return result;
  },
};
