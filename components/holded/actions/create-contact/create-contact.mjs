import constants from "../../common/constants.mjs";
import app from "../../holded.app.mjs";

export default {
  key: "holded-create-contact",
  name: "Create Contact",
  description: "Add a new contact to Holded. [See the docs](https://developers.holded.com/reference/create-contact-1).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    type: {
      type: "string",
      label: "Contact Type",
      description: "The type of contact to create.",
      options: Object.values(constants.CONTACT_TYPE),
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
      optional: true,
    },
  },
  methods: {
    createContact(args = {}) {
      return this.app.post({
        path: "/contacts",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      type,
      name,
      email,
    } = this;

    const response = await this.createContact({
      step,
      data: {
        type,
        name,
        email,
      },
    });

    step.export("$summary", `Successfully created contact with ID ${response.id}`);

    return response;
  },
};
