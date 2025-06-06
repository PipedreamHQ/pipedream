import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contactout",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to search for or verify",
    },
    profile: {
      type: "string",
      label: "LinkedIn Profile URL",
      description: "The LinkedIn profile URL (regular LinkedIn URLs only, not Sales Navigator or Talent/Recruiter URLs)",
    },
    memberId: {
      type: "string",
      label: "LinkedIn Member ID",
      description: "The LinkedIn Member ID",
    },
    domain: {
      type: "string",
      label: "Company Domain",
      description: "The company domain (e.g., example.com)",
    },
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "Array of email addresses (max 100 for bulk operations)",
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "A URL where the results will be posted once the operation is completed",
      optional: true,
    },
    includePhone: {
      type: "boolean",
      label: "Include Phone",
      description: "If set to true, it will include phone information in the response and deduct phone credits",
      optional: true,
    },
    emailType: {
      type: "string",
      label: "Email Type",
      description: "Filter emails by type",
      optional: true,
      options: [
        {
          label: "Personal emails only",
          value: "personal",
        },
        {
          label: "Work emails only",
          value: "work",
        },
        {
          label: "Both personal and work emails",
          value: "personal,work",
        },
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the profile to search for",
      optional: true,
    },
    jobTitle: {
      type: "string[]",
      label: "Job Titles",
      description: "Array of job titles to search for (max 50)",
      optional: true,
    },
    currentTitlesOnly: {
      type: "boolean",
      label: "Current Titles Only",
      description: "Returns profiles matching the current job title only",
      optional: true,
    },
    includeRelatedJobTitles: {
      type: "boolean",
      label: "Include Related Job Titles",
      description: "Returns profiles with related job titles",
      optional: true,
    },
    matchExperience: {
      type: "string",
      label: "Match Experience",
      description: "Ensures **Job Title** and **Company** match in the same experience. If set, **Current Titles Only** and **Company Filter** should not be used. API will return an error in that case.",
      optional: true,
      options: [
        {
          label: "Current experience only",
          value: "current",
        },
        {
          label: "Past experience only",
          value: "past",
        },
        {
          label: "Both current and past experience",
          value: "both",
        },
      ],
    },
    skills: {
      type: "string[]",
      label: "Skills",
      description: "Array of skills to search for (max 50). Supports boolean equations",
      optional: true,
    },
    education: {
      type: "string[]",
      label: "Education",
      description: "Array of schools/degrees to search for (max 50). Supports boolean equations",
      optional: true,
    },
    location: {
      type: "string[]",
      label: "Locations",
      description: "Array of locations to search for (max 50)",
      optional: true,
    },
    company: {
      type: "string[]",
      label: "Companies",
      description: "Array of company names to search for (max 50)",
      optional: true,
    },
    companyFilter: {
      type: "string",
      label: "Company Filter",
      description: "Filter by current or past company experience",
      optional: true,
      options: [
        {
          label: "Current company only",
          value: "current",
        },
        {
          label: "Past company only",
          value: "past",
        },
        {
          label: "Both current and past companies",
          value: "both",
        },
      ],
    },
    currentCompanyOnly: {
      type: "boolean",
      label: "Current Company Only",
      description: "Returns profiles matching the current company name only",
      optional: true,
    },
    industry: {
      type: "string[]",
      label: "Industries",
      description: "Array of industries to search for (max 50). Supports boolean equations",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Returns profiles that contain the mentioned keyword anywhere in their profile",
      optional: true,
    },
    companySize: {
      type: "string[]",
      label: "Company Sizes",
      description: "Array of company size ranges",
      optional: true,
      options: [
        {
          label: "1-10",
          value: "1_10",
        },
        {
          label: "11-50",
          value: "11_50",
        },
        {
          label: "51-200",
          value: "51_200",
        },
        {
          label: "201-500",
          value: "201_500",
        },
        {
          label: "501-1000",
          value: "501_1000",
        },
        {
          label: "1001-5000",
          value: "1001_5000",
        },
        {
          label: "5001-10000",
          value: "5001_10000",
        },
        {
          label: "10001+",
          value: "10001",
        },
      ],
    },
    yearsOfExperience: {
      type: "string[]",
      label: "Years of Experience",
      description: "Array representing ranges of years of experience",
      optional: true,
      options: [
        {
          label: "0-1",
          value: "0_1",
        },
        {
          label: "1-2",
          value: "1_2",
        },
        {
          label: "3-5",
          value: "3_5",
        },
        {
          label: "6-10",
          value: "6_10",
        },
        {
          label: "10+",
          value: "10",
        },
      ],
    },
    yearsInCurrentRole: {
      type: "string[]",
      label: "Years in Current Role",
      description: "Array representing ranges of years in current role",
      optional: true,
      options: [
        {
          label: "0-2",
          value: "0_2",
        },
        {
          label: "2-4",
          value: "2_4",
        },
        {
          label: "4-6",
          value: "4_6",
        },
        {
          label: "6-8",
          value: "6_8",
        },
        {
          label: "8-10",
          value: "8_10",
        },
        {
          label: "10+",
          value: "10",
        },
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination",
      optional: true,
    },
    dataTypes: {
      type: "string[]",
      label: "Data Types",
      description: "Returns profiles containing at least one of the specified data types",
      optional: true,
      options: [
        "personal_email",
        "work_email",
        "phone",
      ],
    },
    revealInfo: {
      type: "boolean",
      label: "Reveal Contact Info",
      description: "If set to true, contact_info will contain emails and phone numbers (credits will be charged)",
      optional: true,
    },
    revenue: {
      type: "integer",
      label: "Revenue",
      description: "Revenue reference",
      optional: true,
      options: [
        {
          label: "1M",
          value: 1000000,
        },
        {
          label: "5M",
          value: 5000000,
        },
        {
          label: "10M",
          value: 10000000,
        },
        {
          label: "50M",
          value: 50000000,
        },
        {
          label: "100M",
          value: 100000000,
        },
        {
          label: "250M",
          value: 250000000,
        },
        {
          label: "500M",
          value: 500000000,
        },
        {
          label: "1B",
          value: 1000000000,
        },
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.contactout.com/v1${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        authorization: "basic",
        token: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    enrichLinkedInProfile(args = {}) {
      return this._makeRequest({
        path: "/linkedin/enrich",
        ...args,
      });
    },
    getContactInfo(args = {}) {
      return this._makeRequest({
        path: "/people/linkedin",
        ...args,
      });
    },
    getContactInfoByMemberId(args = {}) {
      return this._makeRequest({
        path: "/people/linkedin_member_id",
        ...args,
      });
    },
    getCompanyInfo(args = {}) {
      return this.post({
        path: "/domain/enrich",
        ...args,
      });
    },
    searchPeople(args = {}) {
      return this.post({
        path: "/people/search",
        ...args,
      });
    },
    searchDecisionMakers(args = {}) {
      return this._makeRequest({
        path: "/people/decision-makers",
        ...args,
      });
    },
    searchCompanies(args = {}) {
      return this.post({
        path: "/company/search",
        ...args,
      });
    },
    emailToLinkedIn(args = {}) {
      return this._makeRequest({
        path: "/people/person",
        ...args,
      });
    },
    verifyEmail(args = {}) {
      return this._makeRequest({
        path: "/email/verify",
        ...args,
      });
    },
    verifyEmailBulk(args = {}) {
      return this.post({
        path: "/email/verify/batch",
        ...args,
      });
    },
    getBulkVerificationStatus({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/email/verify/batch/${jobId}`,
        ...args,
      });
    },
  },
};
