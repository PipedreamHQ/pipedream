import bigmailer from "../../bigmailer.app.mjs";

export default {
  key: "bigmailer-add-update-contact",
  name: "Add or Update Contact",
  description: "Creates or updates a contact within a brand. [See the documentation](https://docs.bigmailer.io/reference/upsertcontact)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bigmailer,
    brandId: {
      propDefinition: [
        bigmailer,
        "brandId",
      ],
    },
    contactData: {
      propDefinition: [
        bigmailer,
        "contactData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bigmailer._makeRequest({
      method: "POST",
      path: `/brands/${this.brandId}/contacts/upsert`,
      data: this.contactData,
    });
    $.export("$summary", "Contact successfully updated or created");
    return response;
  },
};
