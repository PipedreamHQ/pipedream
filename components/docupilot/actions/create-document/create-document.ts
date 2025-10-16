import docupilot from "../../app/docupilot.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import {
  CreateDocumentParams, DocumentResponse,
} from "../../common/types";

export default defineAction({
  name: "Create Document",
  description:
    "Create a document [See docs here](https://help.docupilot.app/create-document/api-and-webhook-integration#api-integration)",
  key: "docupilot-create-document",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
       Objects and arrays should be in JSON-stringified format.
       \\
       If you need to include characters such as \`{}[]\` in a value, and it should not be parsed as an object or array, prefix the key with \`$\`.`,
    },
  },
  async run({ $ }): Promise<DocumentResponse> {
    const url: string = this.templateUrl.trim();
    const baseUrl: string = this.docupilot._createDocumentBaseUrl();
    if (!url.startsWith(baseUrl)) {
      throw new ConfigurationError(
        "Invalid `Template URL`. Check the prop and make sure you copied the URL properly.",
      );
    }

    const data = {};
    const tokens: {[key: string]: string;} = this.tokens;

    if (tokens) {
      Object.entries(tokens).forEach(([
        key,
        value,
      ]) => {
        try {
          if (!key.startsWith("$") && value.match(/({[^}]*})|(\[[^\]]*\])/)) {
            value = JSON.parse(value);
          }
        } catch (err) {
          throw new ConfigurationError(`Error parsing JSON value for key \`${key}\`: *"${err}"*
            \\
            If this is not a JSON string for an object or array, prefix the key with \`$\` as in \`$${key}\``);
        }

        data[key.startsWith("$")
          ? key.slice(1)
          : key] = value;
      });
    }

    const params: CreateDocumentParams = {
      $,
      url,
      data,
    };

    const response: DocumentResponse = await this.docupilot.createDocument(params);

    $.export("$summary", "Created document successfully");

    return response;
  },
});
