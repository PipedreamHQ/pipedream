import attio from "../../attio.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "attio-create-person",
  name: "Create Person",
  description: "Creates a new person. [See the documentation](https://developers.attio.com/reference/post_v2-objects-people-records).",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    attio,
    firstName: {
      propDefinition: [
        attio,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        attio,
        "lastName",
      ],
    },
    emailAddress: {
      propDefinition: [
        attio,
        "emailAddress",
      ],
    },
    description: {
      propDefinition: [
        attio,
        "description",
      ],
    },
    jobTitle: {
      propDefinition: [
        attio,
        "jobTitle",
      ],
    },
    phoneNumber: {
      propDefinition: [
        attio,
        "phoneNumber",
      ],
    },
    phoneNumberCountryCode: {
      propDefinition: [
        attio,
        "phoneNumberCountryCode",
      ],
    },
    linkedin: {
      propDefinition: [
        attio,
        "linkedin",
      ],
    },
    twitter: {
      propDefinition: [
        attio,
        "twitter",
      ],
    },
    facebook: {
      propDefinition: [
        attio,
        "facebook",
      ],
    },
    instagram: {
      propDefinition: [
        attio,
        "instagram",
      ],
    },
    companyId: {
      label: "Company ID",
      description: "The ID of the company to associate with the person.",
      optional: true,
      propDefinition: [
        attio,
        "recordId",
        () => ({
          targetObject: constants.TARGET_OBJECT.COMPANIES,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      attio,
      firstName,
      lastName,
      emailAddress,
      description,
      jobTitle,
      phoneNumber,
      phoneNumberCountryCode,
      linkedin,
      twitter,
      facebook,
      instagram,
      companyId,
    } = this;

    const response = await attio.createRecord({
      $,
      targetObject: constants.TARGET_OBJECT.PEOPLE,
      data: {
        data: {
          values: {
            ...(emailAddress && {
              email_addresses: [
                {
                  email_address: emailAddress,
                },
              ],
            }),
            ...(firstName || lastName) && {
              name: [
                {
                  first_name: firstName || "",
                  last_name: lastName || "",
                  full_name: `${firstName || ""} ${lastName || ""}`.trim(),
                },
              ],
            },
            ...(description && {
              description: [
                {
                  value: description,
                },
              ],
            }),
            ...(jobTitle && {
              job_title: [
                {
                  value: jobTitle,
                },
              ],
            }),
            ...(phoneNumber && {
              phone_numbers: [
                {
                  original_phone_number: phoneNumber,
                  ...(phoneNumberCountryCode && {
                    country_code: phoneNumberCountryCode,
                  }),
                },
              ],
            }),
            ...(linkedin && {
              linkedin: [
                {
                  value: linkedin,
                },
              ],
            }),
            ...(twitter && {
              twitter: [
                {
                  value: twitter,
                },
              ],
            }),
            ...(facebook && {
              facebook: [
                {
                  value: facebook,
                },
              ],
            }),
            ...(instagram && {
              instagram: [
                {
                  value: instagram,
                },
              ],
            }),
            ...(companyId && {
              company: [
                {
                  target_object: constants.TARGET_OBJECT.COMPANIES,
                  target_record_id: companyId,
                },
              ],
            }),
          },
        },
      },
    });

    $.export("$summary", `Successfully created person with ID \`${response.data.id.record_id}\`.`);

    return response;
  },
};
