import cats from "../../cats.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "cats-create-contact",
  name: "Create Contact",
  description: "Adds a new contact to the CATS platform. [See the documentation](https://docs.catsone.com/api/v3/#contacts-create-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    checkDuplicate: {
      propDefinition: [
        cats,
        "checkDuplicate",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        cats,
        "title",
      ],
      optional: true,
    },
    reportsToId: {
      propDefinition: [
        cats,
        "contactId",
      ],
      label: "Reports To Id",
      description: "The ID of the contact that this contact reports to.",
      optional: true,
    },
    hasLeftCompany: {
      type: "boolean",
      label: "Has Left Company",
      description: "Whether the contact has left the company or not.",
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
    addressStreet: {
      propDefinition: [
        cats,
        "addressStreet",
      ],
      optional: true,
    },
    addressCity: {
      propDefinition: [
        cats,
        "addressCity",
      ],
      optional: true,
    },
    addressState: {
      propDefinition: [
        cats,
        "addressState",
      ],
      optional: true,
    },
    addressPostalCode: {
      propDefinition: [
        cats,
        "addressPostalCode",
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
      withLabel: true,
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    (this.customFields || []).map(({
      label, value,
    }) => {
      props[value] = {
        type: "string",
        label: `Custom Field: ${label}`,
        optional: true,
      };
    }, {});

    return props;
  },
  async run({ $ }) {
    const {
      cats, // eslint-disable-next-line no-unused-vars
      customFields,
      firstName,
      lastName,
      ownerId,
      companyId,
      checkDuplicate,
      reportsToId,
      hasLeftCompany,
      emails,
      phones,
      addressStreet,
      addressCity,
      addressState,
      addressPostalCode,
      countryCode,
      socialMediaUrls,
      ...data
    } = this;

    const customFieldsObject = customFields
      ? customFields.map(({ value }) => {
        return {
          id: value,
          value: data[value],
        };
      })
      : {};

    const { headers } = await cats.createContact({
      $,
      returnFullResponse: true,
      params: {
        check_duplicate: checkDuplicate,
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        owner_id: ownerId,
        company_id: companyId,
        reports_to_id: reportsToId,
        has_left_company: hasLeftCompany,
        emails: parseObject(emails),
        phones: parseObject(phones),
        address: {
          street: addressStreet,
          city: addressCity,
          state: addressState,
          postal_code: addressPostalCode,
        },
        country_code: countryCode,
        social_media_urls: parseObject(socialMediaUrls),
        custom_fields: customFieldsObject,
        ...data,
      },
    });

    const location = headers.location.split("/");
    const contactId = location[location.length - 1];

    $.export("$summary", `Contact successfully created with Id: ${contactId}!`);
    return {
      contactId,
    };
  },
};
