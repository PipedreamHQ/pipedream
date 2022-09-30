import docupilot from "../../app/docupilot.app";
import {
  defineAction,
} from "@pipedream/types";
import {
  ConfigurationError,
} from "@pipedream/platform";

export default defineAction({
  name: "Create Document",
  description:
    "Create a document [See docs here](https://help.docupilot.app/create-document/api-and-webhook-integration#api-integration)",
  key: "docupilot-create-document",
  version: "0.0.17",
  type: "action",
  props: {
    docupilot,
    templateUrl: {
      type: "string",
      label: "Template URL",
      description: `Choose a template in the Docupilot dashboard, and go to the **Create** tab, then to **API integrations**.
        \\
        Copy the ***POST Merge URL*** here. Example: \`https://api.docupilot.app/documents/create/46ac75c3/5e7d03ec\``,
    },
    tokens: {
      type: "object",
      label: "Template Tokens",
      description: `The tokens used in this template (as object keys) and their values.
       \\
       Objects and arrays should be in JSON-stringified format.`,
    },
  },
  async run({ $ }): Promise<any> {
    const url: string = this.templateUrl.trim();
    const baseUrl: string = this.docupilot._createDocumentBaseUrl();
    if (!url.startsWith(baseUrl)) throw new ConfigurationError("Invalid `Template URL`. Check the prop and make sure you copied the URL properly.");

    const data = this.tokens;

    const params = {
      $,
      url,
      data
    };

    const response = await this.docupilot.createDocument(params);

    $.export("$summary", "Created document successfully");

    return response;
  },
});
