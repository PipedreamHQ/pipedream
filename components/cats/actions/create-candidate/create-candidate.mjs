import cats from "../../cats.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "cats-create-candidate",
  name: "Create Candidate",
  description: "Create a new candidate in your CATS database. [See the documentation](https://docs.catsone.com/api/v3/#candidates-create-a-candidate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cats,
    checkDuplicate: {
      propDefinition: [
        cats,
        "checkDuplicate",
      ],
    },
    firstName: {
      propDefinition: [
        cats,
        "firstName",
      ],
    },
    middleName: {
      propDefinition: [
        cats,
        "middleName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        cats,
        "lastName",
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
    website: {
      type: "string",
      label: "Website",
      description: "The website of the record.",
      optional: true,
    },
    bestTimeToCall: {
      propDefinition: [
        cats,
        "bestTimeToCall",
      ],
      optional: true,
    },
    currentEmployer: {
      propDefinition: [
        cats,
        "currentEmployer",
      ],
      optional: true,
    },
    dateAvailable: {
      type: "string",
      label: "Date Available",
      description: "The date the record is available for an opening. **Format: YYYY-MM-DD**.",
      optional: true,
    },
    currentPay: {
      type: "string",
      label: "Current Pay",
      description: "The current pay of the record.",
      optional: true,
    },
    desiredPay: {
      propDefinition: [
        cats,
        "desiredPay",
      ],
      optional: true,
    },
    isWillingToRelocate: {
      propDefinition: [
        cats,
        "isWillingToRelocate",
      ],
      optional: true,
    },
    keySkills: {
      propDefinition: [
        cats,
        "keySkills",
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
    source: {
      propDefinition: [
        cats,
        "source",
      ],
      optional: true,
    },
    ownerId: {
      propDefinition: [
        cats,
        "ownerId",
      ],
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "A flag indicating if the candidate is active.",
      optional: true,
    },
    isHot: {
      propDefinition: [
        cats,
        "isHot",
      ],
      optional: true,
    },
    password: {
      type: "string",
      label: "password",
      description: "The candidate's password if they are \"registering\".",
      secret: true,
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
    workHistory: {
      propDefinition: [
        cats,
        "workHistory",
      ],
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
      middleName,
      checkDuplicate,
      bestTimeToCall,
      currentEmployer,
      emails,
      phones,
      addressStreet,
      addressCity,
      addressState,
      addressPostalCode,
      countryCode,
      socialMediaUrls,
      dateAvailable,
      currentPay,
      desiredPay,
      isWillingToRelocate,
      keySkills,
      isActive,
      isHot,
      workHistory,
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

    const { headers } = await cats.createCandidate({
      $,
      returnFullResponse: true,
      params: {
        check_duplicate: checkDuplicate,
      },
      data: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
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
        best_time_to_call: bestTimeToCall,
        current_employer: currentEmployer,
        date_available: dateAvailable,
        current_pay: currentPay,
        desired_pay: desiredPay,
        is_willing_to_relocate: isWillingToRelocate,
        key_skills: keySkills,
        owner_id: ownerId,
        is_active: isActive,
        is_hot: isHot,
        work_history: parseObject(workHistory),
        custom_fields: customFieldsObject,
        ...data,
      },
    });

    const location = headers.location.split("/");
    const candidateId = location[location.length - 1];

    $.export("$summary", `Created candidate with ID ${candidateId}`);
    return {
      candidateId,
    };
  },
};
