import attio from "../../attio.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "attio-update-person",
  name: "Update Person",
  description: "Update an existing person. [See the documentation](https://developers.attio.com/reference/patch_v2-objects-people-records-record-id).",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    attio,
    recordId: {
      label: "Person ID",
      description: "The identifier of the contact to update.",
      propDefinition: [
        attio,
        "recordId",
        () => ({
          targetObject: constants.TARGET_OBJECT.PEOPLE,
          mapper: ({
            id: { record_id: value },
            values: { name },
          }) => ({
            value,
            label: name[0]?.full_name,
          }),
        }),
      ],
    },
    firstName: {
      optional: true,
      propDefinition: [
        attio,
        "firstName",
      ],
    },
    lastName: {
      optional: true,
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
      recordId,
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

    const response = await attio.updateRecord({
      recordId,
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

    $.export("$summary", `Successfully updated person with ID \`${response.data.id.record_id}\`.`);
    return response;
  },
};
