import app from "../../zoom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-add-meeting-registrant",
  name: "Add Meeting Registrant",
  description: "Registers a participant for a meeting. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/meetings/{meetingId}/registrants)",
  version: "0.3.4",
  type: "action",
  props: {
    app,
    paidAccountAlert: {
      propDefinition: [
        app,
        "paidAccountAlert",
      ],
    },
    meetingId: {
      propDefinition: [
        app,
        "meetingId",
      ],
      description: "The Meeting ID to add the registrant to",
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
    occurrenceIds: {
      propDefinition: [
        app,
        "occurrenceIds",
        (c) => ({
          meetingId: c.meetingId,
        }),
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

    const response = await this.addMeetingRegistrant({
      step,
      meetingId,
      params: {
        occurrence_ids: occurrenceIds && occurrenceIds.join(","),
      },
      data: {
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
        custom_questions: utils.parseObj(customQuestions),
      },
    });

    step.export("$summary", `Successfully added registrant to meeting with ID \`${response.id}\``);

    return response;
  },
};
