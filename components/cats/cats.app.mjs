import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cats",
  propDefinitions: {
    checkDuplicate: {
      type: "string",
      label: "Check Duplicate",
      description: "Whether to check for duplicates when creating a candidate",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the candidate",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the candidate",
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The middle name of the candidate",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The candidate's job title",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "An array of phone objects",
      optional: true,
    },
    address: {
      type: "object",
      label: "Address",
      description: "The address of the candidate",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the candidate",
      optional: true,
    },
    socialMediaUrls: {
      type: "string[]",
      label: "Social Media URLs",
      description: "The social media URLs of the candidate",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the candidate",
      optional: true,
    },
    bestTimeToCall: {
      type: "string",
      label: "Best Time to Call",
      description: "The best time to call the candidate",
      optional: true,
    },
    currentEmployer: {
      type: "string",
      label: "Current Employer",
      description: "The current employer of the candidate",
      optional: true,
    },
    dateAvailable: {
      type: "string",
      label: "Date Available",
      description: "The date the candidate is available for an opening",
      optional: true,
    },
    desiredPay: {
      type: "string",
      label: "Desired Pay",
      description: "The desired pay for the candidate",
      optional: true,
    },
    isWillingToRelocate: {
      type: "boolean",
      label: "Willing to Relocate",
      description: "Whether the candidate is willing to relocate",
      optional: true,
    },
    keySkills: {
      type: "string",
      label: "Key Skills",
      description: "The key skills of the candidate",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any notes about the candidate",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the candidate",
      optional: true,
    },
    ownerId: {
      type: "number",
      label: "Owner ID",
      description: "The user id of the record owner",
      optional: true,
    },
    workHistory: {
      type: "string[]",
      label: "Work History",
      description: "An array of work history objects",
      optional: true,
    },
    candidateId: {
      type: "number",
      label: "Candidate ID",
      description: "The ID of the candidate",
    },
    jobId: {
      type: "number",
      label: "Job ID",
      description: "The ID of the job to which the candidate is added",
    },
    rating: {
      type: "number",
      label: "Rating",
      description: "The candidate's rating for the job (0-5)",
      optional: true,
    },
    companyId: {
      type: "number",
      label: "Company ID",
      description: "The company ID related to the contact",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "An array of email objects",
      optional: true,
    },
    isHot: {
      type: "boolean",
      label: "Is Hot",
      description: "Whether the contact is marked as hot",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "An array of custom field objects",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.catsone.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createCandidate(data) {
      const result = await this._makeRequest({
        method: "POST",
        path: "/candidates",
        data,
      });
      this.$emit(result, {
        summary: "Candidate created",
        name: "candidate.created",
      });
      return result;
    },
    async addCandidateToJobPipeline(data) {
      return this._makeRequest({
        method: "POST",
        path: "/pipelines",
        data,
      });
    },
    async createContact(data) {
      const result = await this._makeRequest({
        method: "POST",
        path: "/contacts",
        data,
      });
      this.$emit(result, {
        summary: "Contact created",
        name: "contact.created",
      });
      return result;
    },
    async createActivity(data) {
      const result = await this._makeRequest({
        method: "POST",
        path: "/activities",
        data,
      });
      this.$emit(result, {
        summary: "Activity created",
        name: "activity.created",
      });
      return result;
    },
  },
  version: "0.0.{{ts}}",
};
