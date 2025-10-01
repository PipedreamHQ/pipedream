import app from "../../getresponse.app.mjs";

export default {
  key: "getresponse-find-contact",
  name: "Find Contact",
  description: "Finds a contact by filters. [See the docs here](https://apireference.getresponse.com/?_ga=2.47520738.499257728.1666974700-2116668472.1666974700&amp;_gl=1*1f3h009*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3ODQ3OS4zNi4wLjA.#operation/getContactList)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  async run({ $: step }) {
    const contact = await this.app.getContact({
      step,
      contactId: this.contactId,
    });

    step.export("$summary", `Contact with ID ${contact.contactId} has been found.`);

    return contact;
  },
};
