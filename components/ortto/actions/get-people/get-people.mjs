import utils from "../../common/utils.mjs";
import app from "../../ortto.app.mjs";

export default {
  key: "ortto-get-people",
  name: "Get people",
  description: "Retrieves data from one or more person records in Ortto’s customer data platform (CDP) [See the docs](https://help.ortto.com/developer/latest/api-reference/person/get.html).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run({ $: step }) {
    const stream = this.app.getResourcesStream({
      resourceFn: this.app.listPeople,
      resourceFnArgs: {
        step,
      },
      resourcesName: "contacts",
    });

    const contacts = await utils.streamIterator(stream);

    step.export("$summary", `Successfully fetched ${utils.summaryEnd(contacts.length, "contact")}`);

    return contacts;
  },
};
