import cats from "../../cats.app.mjs";

export default {
  key: "cats-create-candidate",
  name: "Create Candidate",
  description: "Create a new candidate in your CATS database. [See the documentation](https://docs.catsone.com/api/v3/#create-a-candidate)",
  version: "0.0.{{ts}}",
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
    lastName: {
      propDefinition: [
        cats,
        "lastName",
      ],
    },
    middleName: {
      propDefinition: [
        cats,
        "middleName",
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
    website: {
      propDefinition: [
        cats,
        "website",
      ],
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
      propDefinition: [
        cats,
        "dateAvailable",
      ],
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
    workHistory: {
      propDefinition: [
        cats,
        "workHistory",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const candidateData = {
      check_duplicate: this.checkDuplicate,
      first_name: this.firstName,
      last_name: this.lastName,
      middle_name: this.middleName,
      title: this.title,
      phones: this.phones
        ? this.phones.map(JSON.parse)
        : undefined,
      address: this.address,
      country_code: this.countryCode,
      social_media_urls: this.socialMediaUrls
        ? this.socialMediaUrls.map(JSON.parse)
        : undefined,
      website: this.website,
      best_time_to_call: this.bestTimeToCall,
      current_employer: this.currentEmployer,
      date_available: this.dateAvailable,
      desired_pay: this.desiredPay,
      is_willing_to_relocate: this.isWillingToRelocate,
      key_skills: this.keySkills,
      notes: this.notes,
      source: this.source,
      owner_id: this.ownerId,
      work_history: this.workHistory
        ? this.workHistory.map(JSON.parse)
        : undefined,
    };

    const response = await this.cats.createCandidate(candidateData);

    $.export("$summary", `Created candidate with ID ${response.id}`);
    return response;
  },
};
