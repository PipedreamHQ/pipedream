import interseller from "../../interseller.app.mjs";

export default {
  key: "interseller-update-contact",
  name: "Update Contact",
  description: "Update an existing contact. [See the documentation](https://interseller.readme.io/reference/update-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    interseller,
    contactId: interseller.propDefinitions.contactId,
    name: interseller.propDefinitions.name,
    company: interseller.propDefinitions.company,
    profileUrl: interseller.propDefinitions.profileUrl,
    sourceUrl: interseller.propDefinitions.sourceUrl,
    location: interseller.propDefinitions.location,
    phoneNumber: interseller.propDefinitions.phoneNumber,
    title: interseller.propDefinitions.title,
  },
  async run({ $ }) {
    const response = await this.interseller.updateContact({
      $,
      contactId: this.contactId,
      data: {
        name: this.name,
        company: this.company,
        profile_url: this.profileUrl,
        source_url: this.sourceUrl,
        location: this.location,
        phone_number: this.phoneNumber,
        title: this.title,
      },
    });
    $.export("$summary", `Successfully updated the contact with ID ${this.contactId}`);
    return response;
  },
};
