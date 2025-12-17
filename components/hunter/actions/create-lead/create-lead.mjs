import app from "../../hunter.app.mjs";

export default {
  key: "hunter-create-lead",
  name: "Create Lead",
  description: "Create a new lead in your Hunter account. [See the documentation](https://hunter.io/api-documentation/v2#create-lead).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The email address of the lead.",
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
      description: "The first name of the lead.",
      optional: true,
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      description: "The last name of the lead.",
      optional: true,
    },
    position: {
      propDefinition: [
        app,
        "position",
      ],
      description: "The job title of the lead.",
      optional: true,
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      description: "The name of the company the lead is working in.",
      optional: true,
    },
    companyIndustry: {
      type: "string",
      label: "Company Industry",
      description: "The sector of the company.",
      options: [
        "Animal",
        "Art & Entertainment",
        "Automotive",
        "Beauty & Fitness",
        "Books & Literature",
        "Education & Career",
        "Finance",
        "Food & Drink",
        "Game",
        "Health",
        "Hobby & Leisure",
        "Home & Garden",
        "Industry",
        "Internet & Telecom",
        "Law & Government",
        "Manufacturing",
        "News",
        "Real Estate",
        "Science",
        "Retail",
        "Sport",
        "Technology",
        "Travel",
      ],
      optional: true,
    },
    companySize: {
      propDefinition: [
        app,
        "companySize",
      ],
      description: "The size of the company the lead is working in.",
      optional: true,
    },
    confidenceScore: {
      type: "integer",
      label: "Confidence Score",
      description: "Estimation of the probability the email address returned is correct, between 0 and 100.",
      min: 0,
      max: 100,
      optional: true,
    },
    website: {
      propDefinition: [
        app,
        "website",
      ],
      description: "The domain name of the company.",
      optional: true,
    },
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
      description: "The country of the lead (ISO 3166-1 alpha-2 standard).",
      optional: true,
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      description: "The address of the public profile on LinkedIn.",
      optional: true,
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      description: "The phone number of the lead.",
      optional: true,
    },
    twitter: {
      propDefinition: [
        app,
        "twitter",
      ],
      description: "The Twitter handle of the lead.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Some personal notes about the lead.",
      optional: true,
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
      description: "The source where the lead has been found.",
      optional: true,
    },
    leadsListId: {
      propDefinition: [
        app,
        "leadsListId",
      ],
      description: "The identifier of the list the lead belongs to. If not specified, the lead is saved in the last list created.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
      firstName,
      lastName,
      position,
      company,
      companyIndustry,
      companySize,
      confidenceScore,
      website,
      countryCode,
      linkedinUrl,
      phoneNumber,
      twitter,
      notes,
      source,
      leadsListId,
    } = this;

    const response = await app.createLead({
      $,
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        position,
        company,
        company_industry: companyIndustry,
        company_size: companySize,
        confidence_score: confidenceScore,
        website,
        country_code: countryCode,
        linkedin_url: linkedinUrl,
        phone_number: phoneNumber,
        twitter,
        notes,
        source,
        leads_list_id: leadsListId,
      },
    });

    $.export("$summary", "Successfully created lead");
    return response;
  },
};
