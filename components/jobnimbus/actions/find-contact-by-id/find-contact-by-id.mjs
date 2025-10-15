import app from "../../jobnimbus.app.mjs";

export default {
  key: "jobnimbus-find-contact-by-id",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Find Contact By ID",
  description: "Finds contact by ID. [See the documentation](https://documenter.getpostman.com/view/3919598/S11PpG4x#02875033-b94e-4ed9-83cc-d157fba8e5d5)",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.getContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", "Contact has been retrieved successfully.");
    return resp;
  },
};
