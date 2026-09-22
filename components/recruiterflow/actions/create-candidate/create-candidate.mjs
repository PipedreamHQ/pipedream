import app from "../../recruiterflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "recruiterflow-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate in Recruiterflow. [See the documentation](https://recruiterflow.com/swagger.yml)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the candidate",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Primary email address of the candidate",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Primary phone number of the candidate",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "Current job title of the candidate",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "Current organization/company of the candidate",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Location of the candidate (e.g., 'New York Metropolitan Area')",
      optional: true,
    },
    linkedinProfile: {
      type: "string",
      label: "LinkedIn Profile",
      description: "LinkedIn profile URL",
      optional: true,
    },
    twitterProfile: {
      type: "string",
      label: "Twitter Profile",
      description: "Twitter profile URL",
      optional: true,
    },
    facebookProfile: {
      type: "string",
      label: "Facebook Profile",
      description: "Facebook profile URL",
      optional: true,
    },
    githubProfile: {
      type: "string",
      label: "GitHub Profile",
      description: "GitHub profile URL",
      optional: true,
    },
    angellistProfile: {
      type: "string",
      label: "AngelList Profile",
      description: "AngelList profile URL",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source of the candidate (e.g., 'linkedin', 'referral', 'website')",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to categorize the candidate",
      optional: true,
    },
    skills: {
      type: "string[]",
      label: "Skills",
      description: "Array of candidate skills",
      optional: true,
    },
    leadOwnerId: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Lead Owner ID",
      description: "ID of the user who will own this candidate",
      optional: true,
    },
    experience: {
      type: "string[]",
      label: "Experience",
      description: "Array of experience objects. Format: `[{\"organization\": \"Facebook\", \"designation\": \"SDE\", \"from\": [\"2\", \"2021\"], \"to\": [\"2\", \"2021\"]}]`",
      optional: true,
    },
    education: {
      type: "string[]",
      label: "Education",
      description: "Array of education objects. Format: `[{\"school\": \"HPCA\", \"degree\": \"10th\", \"specialization\": \"MATHS\", \"from\": [\"5\", \"2021\"], \"to\": [\"5\", \"2022\"]}]`",
      optional: true,
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
    addedTime: {
      type: "string",
      label: "Added Time",
      description: "Timestamp for backdating candidate creation (ISO 8601 format, e.g., `2021-01-12T10:16:16+0000`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      email,
      phoneNumber,
      title,
      organization,
      location,
      linkedinProfile,
      twitterProfile,
      facebookProfile,
      githubProfile,
      angellistProfile,
      source,
      tags,
      skills,
      leadOwnerId,
      experience,
      education,
      customFields,
      addedTime,
    } = this;

    const response = await app.createCandidate({
      $,
      data: {
        name,
        email,
        phone_number: phoneNumber,
        title,
        organization,
        ...(location
          ? {
            location: {
              location,
            },
          }
          : undefined
        ),
        linkedin_profile: linkedinProfile,
        twitter_profile: twitterProfile,
        facebook_profile: facebookProfile,
        github_profile: githubProfile,
        angellist_profile: angellistProfile,
        source,
        tags,
        skills,
        lead_owner_id: leadOwnerId,
        experience: utils.parseJson(experience),
        education: utils.parseJson(education),
        custom_fields: utils.parseJson(customFields),
        added_time: addedTime,
      },
    });

    $.export("$summary", `Successfully created candidate: ${name}`);
    return response;
  },
};
