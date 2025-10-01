import app from "../../getresponse.app.mjs";

export default {
  key: "getresponse-create-contact",
  name: "Create Contact",
  description: "Creates a contact. [See the docs here](https://apireference.getresponse.com/?_ga=2.47520738.499257728.1666974700-2116668472.1666974700&amp;_gl=1*1f3h009*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3ODQ3OS4zNi4wLjA.#operation/createContact)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
  },
  async run({ $: step }) {
    const {
      campaignId,
      email,
      name,
    } = this;

    await this.app.createContact({
      step,
      data: {
        campaign: {
          campaignId,
        },
        email,
        name,
      },
    });

    step.export("$summary", "Contact has been preliminarily validated and added to the queue.");

    return email;
  },
};
