import { SOURCED_FROM } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import gem from "../../gem.app.mjs";

export default {
  key: "gem-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate in Gem. [See the documentation](https://api.gem.com/v0/reference#tag/Candidates/paths/~1v0~1candidates/post)",
  version: "0.0.1",
  type: "action",
  props: {
    gem,
    createdBy: {
      propDefinition: [
        gem,
        "createdBy",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Candidate's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Candidate's last name",
      optional: true,
    },
    nickname: {
      type: "string",
      label: "Nickname",
      description: "Candidate's nickname",
      optional: true,
    },
    primaryEmail: {
      type: "string",
      label: "Primary Email Address",
      description: "Candidate's primary email address",
    },
    additionalEmails: {
      type: "string[]",
      label: "Email Addresses",
      description: "List of candidate's additional email addresses",
      optional: true,
    },
    linkedInHandle: {
      type: "string",
      label: "LinkedIn Handle",
      description: "If `LinkedIn Handle` is provided, candidate creation will be de-duplicated. If a candidate with the provided `LinkedIn Handle already exists, a 400 error will be returned with `errors` containing information on the existing candidate in this shape: `{\"errors\": { \"duplicate_candidate\": { \"id\": \"string\", \"linked_in_handle\": \"string\" }}}`.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Candidate's job title",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Candidate's company name",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Candidate's location",
      optional: true,
    },
    school: {
      type: "string",
      label: "School",
      description: "Candidate's school",
      optional: true,
    },
    educationInfo: {
      type: "string[]",
      label: "Education Info",
      description: "A list of objects containing candidate's education information. **Format: [{\"school\": \"string\", \"parsed_university\": \"string\", \"parsed_school\": \"string\", \"start_date\": \"string\", \"end_date\": \"string\", \"field_of_study\": \"string\", \"parsed_major_1\": \"string\", \"parsed_major_2\": \"string\", \"degree\": \"string\"}]**. [See the documentation](https://api.gem.com/v0/reference#tag/Candidates/paths/~1v0~1candidates/post) for further details.",
      optional: true,
    },
    workInfo: {
      type: "string[]",
      label: "Work Info",
      description: "A list of objects containing candidate's work information. **Format: [{\"company\": \"string\", \"title\": \"string\", \"work_start_date\": \"string\", \"work_end_date\": \"string\", \"is_current\": \"string\"}]**. [See the documentation](https://api.gem.com/v0/reference#tag/Candidates/paths/~1v0~1candidates/post) for further details.",
      optional: true,
    },
    profileUrls: {
      type: "string[]",
      label: "Profile URLs",
      description: "If `Profile URLs` is provided with an array of urls, social `profiles` will be generated based on the provided urls and attached to the candidate",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Candidate's phone number",
      optional: true,
    },
    projectIds: {
      propDefinition: [
        gem,
        "projectIds",
      ],
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of objects containing new custom field values. Only custom fields specified in the array are updated. **Format: [{\"custom_field_id\": \"string\", \"value\": \"string\"}]**. [See the documentation](https://api.gem.com/v0/reference#tag/Candidates/paths/~1v0~1candidates/post) for further details.",
      optional: true,
    },
    sourcedFrom: {
      type: "string",
      label: "Sourced From",
      description: "Where the candidate was sourced from",
      options: SOURCED_FROM,
      optional: true,
    },
    autofill: {
      type: "boolean",
      label: "Autofill",
      description: "Requires `Linked In Handle` to be non-null. Attempts to fill in any missing fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const emails = [
      {
        email_address: this.primaryEmail,
        is_primary: true,
      },
    ];
    if (this.additionalEmails) emails.push(...parseObject(this.additionalEmails).map((email) => ({
      email_address: email,
      is_primary: false,
    })));

    if (emails.length === 0) {
      throw new Error("Primary Email Address is required");
    }
    const candidate = await this.gem.createCandidate({
      $,
      data: {
        created_by: this.createdBy,
        first_name: this.firstName,
        last_name: this.lastName,
        nickname: this.nickname,
        emails,
        linked_in_handle: this.linkedInHandle,
        title: this.title,
        company: this.company,
        location: this.location,
        school: this.school,
        education_info: parseObject(this.educationInfo),
        work_info: parseObject(this.workInfo),
        profile_urls: parseObject(this.profileUrls),
        phone_number: this.phoneNumber,
        project_ids: parseObject(this.projectIds),
        custom_fields: parseObject(this.customFields),
        sourced_from: this.sourcedFrom,
        autofill: this.autofill,
      },
    });
    $.export(
      "$summary", `Created candidate ${candidate.first_name} ${candidate.last_name} with ID: ${candidate.id}`,
    );
    return candidate;
  },
};
