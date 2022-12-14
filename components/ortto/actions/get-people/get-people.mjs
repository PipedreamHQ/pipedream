import app from "../../ortto.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ortto-get-people",
  name: "Get people",
  description: "Retrieves data from one or more person records in Ortto’s customer data platform (CDP) [See the docs](https://help.ortto.com/developer/latest/api-reference/person/get.html).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  methods: {
    getResourceFnArgs(step) {
      return {
        step,
        data: {
          limit: constants.DEFAULT_LIMIT,
          fields: [
            constants.FIELD.FIRST_NAME,
            constants.FIELD.LAST_NAME,
            constants.FIELD.EMAIL,
          ],
        },
      };
    },
    getResourcesName() {
      return "contacts";
    },
    getPeople(step) {
      const stream = this.app.getResourcesStream({
        resourceFn: this.app.listPeople,
        resourceFnArgs: this.getResourceFnArgs(step),
        resourcesName: this.getResourcesName(),
      });
      return utils.streamIterator(stream);
    },
  },
  async run({ $: step }) {
    const contacts = await this.getPeople(step);

    step.export("$summary", `Successfully fetched ${utils.summaryEnd(contacts.length, "contact")}`);

    return contacts;
  },
};
