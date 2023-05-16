import app from "../../quaderno.app.mjs";

export default {
  key: "quaderno-create-contact",
  name: "Create Contact",
  description: "Add a new contact to Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Contacts/operation/createContact).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
