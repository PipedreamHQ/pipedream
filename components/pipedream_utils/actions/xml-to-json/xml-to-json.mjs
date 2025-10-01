import pipedream_utils from "../../pipedream_utils.app.mjs";
import { xml2js } from "xml-js";

export default {
  key: "pipedream_utils-xml-to-json",
  name: "Helper Functions - XML to JSON",
  description: "See [xml-js](https://github.com/nashwaan/xml-js)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      type: "string",
      label: "XML",
      description: "XML Input",
    },
    compact: {
      type: "boolean",
      label: "Compact",
      description: "More information [here](https://github.com/nashwaan/xml-js#compact-vs-non-compact). Defaults to `true`.",
      optional: true,
      default: true,
    },
    spaces: {
      type: "integer",
      label: "Spaces",
      description: "Space indentation. Defaults to `2`.",
      optional: true,
      default: 2,
    },
  },
  async run({ $ }) {
    const json = xml2js(this.input, {
      compact: this.compact,
      spaces: this.spaces,
    });
    $.export("$summary", "Successfully converted XML to JSON");
    return json;
  },
};
