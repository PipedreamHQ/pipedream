// legacy_hash_id: a_52iBvd
import { xml2js } from "xml-js";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-xml-to-json",
  name: "XML to JSON",
  description: "See https://www.npmjs.com/package/xml-js",
  version: "0.2.1",
  type: "action",
  props: {
    helper_functions,
    input: {
      type: "string",
      label: "XML",
    },
    compact: {
      type: "boolean",
      optional: true,
    },
    spaces: {
      type: "integer",
      optional: true,
    },
  },
  async run() {
    return await xml2js(this.input, {
      compact: true,
      spaces: this.spaces || 4,
    });
  },
};
