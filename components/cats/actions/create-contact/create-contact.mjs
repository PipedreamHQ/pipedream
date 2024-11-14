import cats from "../../cats.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cats-create-contact",
  name: "Create Contact",
  description: "Adds a new contact to the CATS platform. [See the documentation](https://docs.catsone.com/api/v3/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cats,
    firstName: {
      propDefinition: [
        cats,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        cats,
        "lastName",
      ],
    },
    ownerId: {
      propDefinition: [
        cats,
        "ownerId",
      ],
    },
    companyId: {
      propDefinition: [
        cats,
        "companyId",
      ],
    },
    title: {
      propDefinition: [
        cats,
        "title",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        cats,
        "emails",
      ],
      optional: true,
    },
    phones: {
      propDefinition: [
        cats,
        "phones",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        cats,
        "address",
      ],
      optional: true,
    },
    countryCode: {
      propDefinition: [
        cats,
        "countryCode",
      ],
      optional: true,
    },
    socialMediaUrls: {
      propDefinition: [
        cats,
        "socialMediaUrls",
      ],
      optional: true,
    },
    isHot: {
      propDefinition: [
        cats,
        "isHot",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        cats,
        "notes",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        cats,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      owner_id: this.ownerId,
      company_id: this.companyId,
      title: this.title,
      emails: this.emails,
      phones: this.phones,
      address: this.address,
      country_code: this.countryCode,
      social_media_urls: this.socialMediaUrls,
      is_hot: this.isHot,
      notes: this.notes,
      custom_fields: this.customFields,
    };

    const response = await this.cats.createContact(data);
    $.export("$summary", `Contact created: ${response.id}`);
    return response;
  },
};
