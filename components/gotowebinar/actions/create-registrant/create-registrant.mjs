import gotowebinar from "../../gotowebinar.app.mjs";

export default {
  key: "gotowebinar-create-registrant",
  name: "Create Registrant",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Register an attendee for a scheduled webinar. [See the documentation](https://developer.goto.com/GoToWebinarV2/#operation/createRegistrant)",
  type: "action",
  props: {
    gotowebinar,
    organizerKey: {
      propDefinition: [
        gotowebinar,
        "organizerKey",
      ],
    },
    webinarKey: {
      propDefinition: [
        gotowebinar,
        "webinarKey",
      ],
    },
    resendConfirmation: {
      type: "boolean",
      label: "Resend Confirmation",
      description: "Indicates whether the confirmation email should be resent when a registrant is re-registered. Default is `false`.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The registrant's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The registrant's last name.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The registrant's email address.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source that led to the registration. This can be any string like 'Newsletter 123' or 'Marketing campaign ABC'",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The registrant's address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The registrant's city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The registrant's state (US only).",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The registrant's zip (post) code.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The registrant's country.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The registrant's phone.",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "The registrant's organization.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The registrant's job title.",
      optional: true,
    },
    questionsAndComments: {
      type: "string",
      label: "Questions And Comments",
      description: "Any questions or comments the registrant made at the time of registration.",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The type of industry the registrant's organization belongs to.",
      optional: true,
    },
    numberOfEmployees: {
      type: "string",
      label: "Number Of Employees",
      description: "The size in employees of the registrant's organization.",
      optional: true,
    },
    purchasingTimeFrame: {
      type: "string",
      label: "Purchasing Time Frame",
      description: "The time frame within which the product will be purchased.",
      optional: true,
    },
    purchasingRole: {
      type: "string",
      label: "Purchasing Role",
      description: "The registrant's role in purchasing the product.",
      optional: true,
    },

  },
  async run({ $ }) {
    const {
      gotowebinar,
      organizerKey,
      webinarKey,
      resendConfirmation,
      ...data
    } = this;

    const response = await gotowebinar.createRegistrant({
      $,
      organizerKey,
      webinarKey,
      params: {
        resendConfirmation,
      },
      data,
    });

    $.export("$summary", `A new registrant with key: ${response.registrantKey} was successfully created!`);
    return response;
  },
};
