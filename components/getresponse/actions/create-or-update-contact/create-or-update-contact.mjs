import constants from "../../common/constants.mjs";
import app from "../../getresponse.app.mjs";

export default {
  key: "getresponse-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Creates or updates a contact if already exists. [See the docs here](https://apireference.getresponse.com/?_ga=2.47520738.499257728.1666974700-2116668472.1666974700&amp;_gl=1*1f3h009*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3ODQ3OS4zNi4wLjA.#operation/updateContact)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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

    const contacts = await this.app.getContacts({
      step,
      params: {
        [constants.QUERY_PROP.EMAIL]: email,
      },
    });

    const contactFound = contacts[0];
    if (contactFound?.email === email) {
      const response = await this.app.updateContact({
        step,
        contactId: contactFound.contactId,
        data: {
          name,
          campaign: {
            campaignId,
          },
        },
      });

      step.export("$summary", `Contact has been updated with ID ${response.contactId}`);

      return response;
    }

    await this.app.createContact({
      step,
      data: {
        email,
        name,
        campaign: {
          campaignId,
        },
      },
    });

    step.export("$summary", "Contact has been preliminarily validated and added to the queue for creation.");

    return email;
  },
};
