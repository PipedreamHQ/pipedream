import base from "../common/contact-base.mjs";

export default {
  key: "jobnimbus-update-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Update Contact",
  description: "Updates a contact. [See the documentation](https://documenter.getpostman.com/view/3919598/S11PpG4x#6c94f9a6-2bac-4189-9b2e-5d856f0fe310)",
  ...base,
  props: {
    app: base.props.app,
    contactId: {
      propDefinition: [
        base.props.app,
        "contactId",
      ],
    },
    ...base.props,
  },
  async run ({ $ }) {
    const data = this.prepareData();
    const resp = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data,
    });
    $.export("$summary", "Contact has been updated successfully.");
    return resp;
  },
};
