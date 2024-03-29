import loopify from "../../loopify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "loopify-add-contact-to-new-entry",
  name: "Add Contact to New Entry",
  description: "Adds a contact to an 'API Entry' block in a Loopify flow. [See the documentation](https://api.loopify.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    loopify,
    contact: {
      propDefinition: [
        loopify,
        "contact",
      ],
    },
    apiEntry: {
      propDefinition: [
        loopify,
        "apiEntry",
      ],
    },
    flowId: {
      propDefinition: [
        loopify,
        "flowId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.loopify.addContactToApiEntryBlock({
      contact: this.contact,
      apiEntry: this.apiEntry,
      flowId: this.flowId,
    });

    $.export("$summary", `Successfully added contact to the API Entry Block '${this.apiEntry}' in the Loopify flow '${this.flowId}'.`);
    return response;
  },
};
