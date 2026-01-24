import app from "../../zoom.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/utils.mjs";

export default {
  key: "zoom-add-meeting-registrant",
  name: "Add Meeting Registrant",
  description: "Registers a participant or multiple participants for a meeting. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingRegistrantCreate)",
  version: "0.3.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    meetingId: {
      propDefinition: [
        app,
        "meetingId",
      ],
      optional: false,
    },
    occurrenceIds: {
      propDefinition: [
        app,
        "occurrenceIds",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    industry: {
      propDefinition: [
        app,
        "industry",
      ],
    },
    org: {
      propDefinition: [
        app,
        "org",
      ],
    },
    jobTitle: {
      propDefinition: [
        app,
        "jobTitle",
      ],
    },
    purchasingTimeFrame: {
      propDefinition: [
        app,
        "purchasingTimeFrame",
      ],
    },
    roleInPurchaseProcess: {
      propDefinition: [
        app,
        "roleInPurchaseProcess",
      ],
    },
    noOfEmployees: {
      propDefinition: [
        app,
        "noOfEmployees",
      ],
    },
    comments: {
      propDefinition: [
        app,
        "comments",
      ],
    },
    customQuestions: {
      propDefinition: [
        app,
        "customQuestions",
      ],
    },
    registrants: {
      type: "object",
      label: "Registrants",
      description: `Use this field to enter multiple registrants at once. Will override the single registrant fields if provided. Each registrant should be an object with at least the following properties: email, first_name, last_name. Example:
      \`[
        {
          "email": "test@example.com",
          "first_name": "John",
          "last_name": "Doe"
        }
      ]\``,
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps(props) {
    // Don't require email, firstName, lastName if registrants array is provided
    props.email.optional = this.registrants
      ? true
      : false;
    props.firstName.optional = this.registrants
      ? true
      : false;
    props.lastName.optional = this.registrants
      ? true
      : false;
    return {};
  },
  methods: {
    addMeetingRegistrant({
      meetingId, ...args
    } = {}) {
      return this.app.create({
        path: `/meetings/${meetingId}/registrants`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      meetingId,
      occurrenceIds,
      email,
      firstName,
      lastName,
      address,
      city,
      country,
      zip,
      state,
      phone,
      industry,
      org,
      jobTitle,
      purchasingTimeFrame,
      roleInPurchaseProcess,
      noOfEmployees,
      comments,
      customQuestions,
    } = this;

    // If registrants array is provided, use it. Otherwise, use the single registrant fields.
    const registrants = this.registrants
      ? constants.parseArray(this.registrants)
      : [
        {
          email,
          first_name: firstName,
          last_name: lastName,
          address,
          city,
          country,
          zip,
          state,
          phone,
          industry,
          org,
          job_title: jobTitle,
          purchasing_time_frame: purchasingTimeFrame,
          role_in_purchase_process: roleInPurchaseProcess,
          no_of_employees: noOfEmployees,
          comments,
          custom_questions: typeof(customQuestions) === "undefined"
            ? customQuestions
            : JSON.parse(customQuestions),
        },
      ];

    if (registrants.length > 10) {
      throw new ConfigurationError("You can only add up to 10 registrants at once.");
    }

    // Add each registrant to the meeting
    const responses = [];
    for (const registrant of registrants) {
      const registration = await this.addMeetingRegistrant({
        step,
        meetingId,
        params: {
          occurrence_ids: occurrenceIds,
        },
        data: registrant,
      });
      responses.push(registration);
    }

    if (this.registrants) {
      step.export("$summary", `Successfully added ${registrants.length} registrants to meeting with ID \`${meetingId}\``);
      return responses;
    } else {
      step.export("$summary", `Successfully added registrant to meeting with ID \`${registrants[0].id}\``);
      return responses[0];
    }
  },
};
