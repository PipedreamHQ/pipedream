import interseller from "../../interseller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "interseller-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://interseller.readme.io/reference/contact)",
  version: "0.0.1",
  type: "action",
  props: {
    interseller,
    contactId: interseller.propDefinitions.contactId,
    booked: interseller.propDefinitions.booked,
    sentiment: interseller.propDefinitions.sentiment,
    name: interseller.propDefinitions.name,
    company: interseller.propDefinitions.company,
    profileUrl: interseller.propDefinitions.profileUrl,
    sourceUrl: interseller.propDefinitions.sourceUrl,
    location: interseller.propDefinitions.location,
    phoneNumber: interseller.propDefinitions.phoneNumber,
    title: interseller.propDefinitions.title,
  },
  async run({ $ }) {
    const response = await this.interseller.createContact({
      contactId: this.contactId,
      booked: this.booked,
      sentiment: this.sentiment,
      name: this.name,
      company: this.company,
      profileUrl: this.profileUrl,
      sourceUrl: this.sourceUrl,
      location: this.location,
      phoneNumber: this.phoneNumber,
      title: this.title,
    });
    $.export("$summary", `Successfully created a new contact with ID ${this.contactId}`);
    return response;
  },
};
