import { SOURCED_FROM } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import gem from "../../gem.app.mjs";

export default {
  key: "gem-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate in Gem. [See the documentation](https://api.gem.com/v0/reference#tag/Candidates/paths/~1v0~1candidates/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "Enter your candidate's unique LinkedIn identifier (e.g., \"satyanadella\"). This helps the system check for duplicates before creating a new candidate entry.",
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
    educationInfoNumber: {
      type: "integer",
      label: "Education Info Quantity",
      description: "The number of education info objects to be created",
      reloadProps: true,
      optional: true,
    },
    workInfoNumber: {
      type: "integer",
      label: "Work Info Quantity",
      description: "The number of work info objects to be created",
      reloadProps: true,
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
      type: "object",
      label: "Custom Fields",
      description: "An object containing new custom field values. Only custom fields specified are updated. **Format: {\"custom_field_id\": \"value\"}**. [See the documentation](https://api.gem.com/v0/reference#tag/Candidates/paths/~1v0~1candidates/post) for further details.",
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
  async additionalProps() {
    const props = {};
    if (this.educationInfoNumber) {
      for (let i = 1; i <= this.educationInfoNumber; i++) {
        props[`educationInfo${i}School`] = {
          type: "string",
          label: `Education Info ${i} - School`,
          description: `Education info ${i} school of the candidate`,
          optional: true,
        };
        props[`educationInfo${i}University`] = {
          type: "string",
          label: `Education Info ${i} - University`,
          description: `Education info ${i} university of the candidate`,
          optional: true,
        };
        props[`educationInfo${i}StartDate`] = {
          type: "string",
          label: `Education Info ${i} - Start Date`,
          description: `Education info ${i} start date of the candidate`,
          optional: true,
        };
        props[`educationInfo${i}EndDate`] = {
          type: "string",
          label: `Education Info ${i} - End Date`,
          description: `Education info ${i} end date of the candidate`,
          optional: true,
        };
        props[`educationInfo${i}FieldOfSchool`] = {
          type: "string",
          label: `Education Info ${i} - Field Of School`,
          description: `Education info ${i} field of school of the candidate`,
          optional: true,
        };
        props[`educationInfo${i}Major1`] = {
          type: "string",
          label: `Education Info ${i} - Major 1`,
          description: `Education info ${i} major 1 of the candidate`,
          optional: true,
        };
        props[`educationInfo${i}Major2`] = {
          type: "string",
          label: `Education Info ${i} - Major 2`,
          description: `Education info ${i} major 2 of the candidate`,
          optional: true,
        };
        props[`educationInfo${i}Degree`] = {
          type: "string",
          label: `Education Info ${i} - Degree`,
          description: `Education info ${i} degree of the candidate`,
          optional: true,
        };
      }
    }
    if (this.workInfoNumber) {
      for (let i = 1; i <= this.workInfoNumber; i++) {
        props[`WorkInfo${i}Company`] = {
          type: "string",
          label: `Work Info ${i} - Company`,
          description: `Work info ${i} company of the candidate`,
          optional: true,
        };
        props[`WorkInfo${i}Title`] = {
          type: "string",
          label: `Work Info ${i} - Title`,
          description: `Work info ${i} title of the candidate`,
          optional: true,
        };
        props[`WorkInfo${i}WorkStartDate`] = {
          type: "string",
          label: `Work Info ${i} - Work Start Date`,
          description: `Work info ${i} work start date of the candidate`,
          optional: true,
        };
        props[`WorkInfo${i}WorkEndDate`] = {
          type: "string",
          label: `Work Info ${i} - Work End Date`,
          description: `Work info ${i} work end date of the candidate`,
          optional: true,
        };
        props[`WorkInfo${i}IsCurrent`] = {
          type: "boolean",
          label: `Work Info ${i} - Is Current`,
          description: `Work info ${i} is Current of the candidate`,
          optional: true,
        };
      }
    }

    return props;
  },
  async run({ $ }) {
    const educationInfo = [];
    const workInfo = [];
    for (var i = 1; i <= this.educationInfoNumber; i++) {
      educationInfo.push({
        school: this[`educationInfo${i}School`],
        parsed_university: this[`educationInfo${i}University`],
        start_date: this[`educationInfo${i}StartDate`],
        end_date: this[`educationInfo${i}EndDate`],
        field_of_study: this[`educationInfo${i}FieldOfSchool`],
        parsed_major_1: this[`educationInfo${i}Major1`],
        parsed_major_2: this[`educationInfo${i}Major2`],
        degree: this[`educationInfo${i}Degree`],
      });
    }

    for (var j = 1; j <= this.workInfoNumber; j++) {
      workInfo.push({
        company: this[`WorkInfo${j}Company`],
        title: this[`WorkInfo${j}Title`],
        work_start_date: this[`WorkInfo${j}WorkStartDate`],
        work_end_date: this[`WorkInfo${j}WorkEndDate`],
        is_current: this[`WorkInfo${j}IsCurrent`],
      });
    }

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
        education_info: educationInfo,
        work_info: workInfo,
        profile_urls: parseObject(this.profileUrls),
        phone_number: this.phoneNumber,
        project_ids: parseObject(this.projectIds),
        custom_fields: Object.entries(parseObject(this.customFields))?.map(([
          key,
          value,
        ]) => ({
          custom_field_id: key,
          value,
        })),
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
