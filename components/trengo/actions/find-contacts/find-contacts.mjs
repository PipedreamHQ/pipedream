import app from "../../trengo.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "trengo-find-contacts",
  version: "0.0.1",
  name: "Find Contacts",
  description: "Finds contacts with the given term. [See the docs](https://developers.trengo.com/reference/as)",
  props: {
    app,
    term: {
      propDefinition: [
        app,
        "term",
      ],
    },
  },
  async run ({ $ }) {
    const contacts = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getContacts,
      resourceFnArgs: {
        params: {
          term: this.term,
        },
      },
    });
    for await (const item of resourcesStream) {
      contacts.push(item);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${contacts.length} contact${contacts.length == 1 ? "" : "s"} have been found.`);
    return contacts;
  },
};
