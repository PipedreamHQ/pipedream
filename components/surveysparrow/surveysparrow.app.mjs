import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "surveysparrow",
  propDefinitions: {
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "Identifier of a survey",
      required: true,
      async options({ page }) {
        const { data: surveys } = await this.listSurveys({
          params: {
            page: page + 1,
          },
        });
        return surveys?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    surveyType: {
      type: "string",
      label: "Survey Type",
      description: "The type of survey",
      options: constants.SURVEY_TYPE_OPTIONS,
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The type of contact",
      options: constants.CONTACT_TYPE_OPTIONS,
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility of the survey",
      options: constants.VISIBILITY_OPTIONS,
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the survey",
    },
    welcomeText: {
      type: "string",
      label: "Welcome Text",
      description: "Welcome Text of the survey",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "Email address of the contact",
      required: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
      optional: true,
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "Mobile number of the contact",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Full name of the contact",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the contact",
      optional: true,
    },
    savedEmailTemplateName: {
      type: "string",
      label: "Saved Email Template Name",
      description: "Name of the saved email share template",
      required: true,
    },
    recipientEmailAddress: {
      type: "string",
      label: "Recipient's Email Address",
      description: "Email address of the recipient",
      required: true,
    },
    savedSmsTemplateName: {
      type: "string",
      label: "Saved SMS Template Name",
      description: "Name of the saved SMS share template",
      required: true,
    },
    recipientMobileNumbers: {
      type: "string[]",
      label: "Recipient's Mobile Numbers",
      description: "Mobile numbers of the recipients",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.surveysparrow.com/v3";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({ hookId }) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
      });
    },
    getResponse({
      responseId, ...args
    }) {
      return this._makeRequest({
        path: `/responses/${responseId}`,
        ...args,
      });
    },
    listSurveys(args = {}) {
      return this._makeRequest({
        path: "/surveys",
        ...args,
      });
    },
    listResponses(args = {}) {
      return this._makeRequest({
        path: "/responses",
        ...args,
      });
    },
    createContact({
      emailAddress,
      phoneNumber,
      mobileNumber,
      fullName,
      jobTitle,
      contactType,
    }) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        data: {
          email: emailAddress,
          phone: phoneNumber,
          mobile: mobileNumber,
          name: fullName,
          job_title: jobTitle,
          contact_type: contactType,
        },
      });
    },
    sendEmailShareTemplate({
      savedEmailTemplateName,
      recipientEmailAddress,
    }) {
      return this._makeRequest({
        path: "/share/email",
        method: "POST",
        data: {
          template_name: savedEmailTemplateName,
          recipient_email: recipientEmailAddress,
        },
      });
    },
    sendSmsShareTemplate({
      savedSmsTemplateName,
      recipientMobileNumbers,
    }) {
      return this._makeRequest({
        path: "/share/sms",
        method: "POST",
        data: {
          template_name: savedSmsTemplateName,
          recipient_mobile_numbers: recipientMobileNumbers,
        },
      });
    },
  },
};
