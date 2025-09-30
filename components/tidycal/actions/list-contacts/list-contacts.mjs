import app from "../../tidycal.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tidycal-list-contacts",
  name: "List Contacts",
  description: "Get a list of contacts. [See the documentation](https://tidycal.com/developer/docs/#tag/Contacts/operation/list-contacts)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $: step }) {
    const response = this.app.getResourcesStream({
      resourceFn: this.app.listContacts,
      resourceName: "data",
    });

    const resources = await utils.streamIterator(response);

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(resources.length, "contact")}.`);

    return resources;
  },
};
