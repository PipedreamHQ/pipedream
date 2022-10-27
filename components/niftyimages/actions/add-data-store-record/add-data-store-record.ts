import niftyimages from "../../app/niftyimages.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Add Data Store Record",
  description:
    "Create or update a Data Store Record [See docs here](https://api.niftyimages.com/)",
  key: "niftyimages-add-data-store-record",
  version: "0.0.1",
  type: "action",
  props: {
    niftyimages,
    templateUrl: {
      type: "string",
      label: "Template URL",
      description: `Choose a template in the niftyimages dashboard, and go to the **Create** tab, then to **API integrations**.
        \\
        Copy the ***POST Merge URL*** here. Example: \`https://api.niftyimages.app/documents/create/46ac75c3/5e7d03ec\``,
    },
    tokens: {
      type: "object",
      label: "Template Tokens",
      description: `The tokens used in this template (as object keys) and their values.
       \\
       Objects and arrays should be in JSON-stringified format.
       \\
       If you need to include characters such as \`{}[]\` in a value, and it should not be parsed as an object or array, prefix the key with \`$\`.`,
    },
  },
  async run({ $ }): Promise<object> {
    const data = {};

    const params = {
      $,
      data,
    };

    const response = await this.niftyimages.addRecord(params);

    $.export("$summary", "Created document successfully");

    return response;
  },
});
