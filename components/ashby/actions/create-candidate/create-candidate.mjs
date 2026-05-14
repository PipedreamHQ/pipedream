import app from "../../ashby.app.mjs";

export default {
  key: "ashby-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate in Ashby. [See the documentation](https://developers.ashbyhq.com/reference/candidatecreate)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "Primary, personal email of the candidate to be created",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Primary, personal phone number of the candidate to be created",
      optional: true,
    },
    linkedInUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "URL to the candidate's LinkedIn profile. Must be a valid URL.",
      optional: true,
    },
    githubUrl: {
      type: "string",
      label: "GitHub URL",
      description: "URL to the candidate's GitHub profile. Must be a valid URL.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "URL of the candidate's website. Must be a valid URL.",
      optional: true,
    },
    alternateEmailAddresses: {
      type: "string[]",
      label: "Alternate Email Addresses",
      description: "Array of alternate email addresses to add to the candidate's profile",
      optional: true,
    },
    sourceId: {
      propDefinition: [
        app,
        "sourceId",
      ],
      description: "The source to set on the candidate being created",
      optional: true,
    },
    creditedToUserId: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Credited To User ID",
      description: "The ID of the user the candidate will be credited to",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the candidate's location",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region (state, province, etc.) of the candidate's location",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the candidate's location",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
      name,
      phoneNumber,
      linkedInUrl,
      githubUrl,
      website,
      alternateEmailAddresses,
      sourceId,
      creditedToUserId,
      city,
      region,
      country,
    } = this;

    const response = await app.createCandidate({
      $,
      data: {
        name,
        email,
        phoneNumber,
        linkedInUrl,
        githubUrl,
        website,
        alternateEmailAddresses,
        sourceId,
        creditedToUserId,
        ...(city || region || country
          ? {
            location: {
              city,
              region,
              country,
            },
          }
          : undefined
        ),
      },
    });

    $.export("$summary", "Successfully created candidate");

    return response;
  },
};
