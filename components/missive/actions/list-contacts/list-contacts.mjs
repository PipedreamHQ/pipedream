import app from "../../missive.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "missive-list-contacts",
  name: "List Contacts",
  description: "List all contacts. [See the Documentation](https://missiveapp.com/help/api-documentation/rest-endpoints#list-contacts)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contactBookId: {
      propDefinition: [
        app,
        "contactBookId",
      ],
    },
  },
  async run({ $: step }) {
    const { contactBookId } = this;

    const stream = this.app.getResourcesStream({
      resourceFn: this.app.listContacts,
      resourceFnArgs: {
        step,
        params: {
          contact_book: contactBookId,
          order: "last_modified",
          limit: constants.DEFAULT_LIMIT,
        },
      },
      resourceName: "contacts",
    });

    const resources = await utils.streamIterator(stream);

    step.export("$summary", `Successfully fetched ${utils.summaryEnd(resources.length, "contact")}`);

    return resources;
  },
};
