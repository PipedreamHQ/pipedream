import app from "../../zoom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-add-webinar-registrant",
  name: "Add Webinar Registrant",
  description: "Registers a participant for a webinar. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/webinars/POST/webinars/{webinarId}/registrants)",
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
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
      description: "The Webinar ID to add the registrant to",
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
          webinarId: c.webinarId,
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
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
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
    addWebinarRegistrant({
      webinarId, ...args
    } = {}) {
      return this.app.create({
        path: `/webinars/${webinarId}/registrants`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      webinarId,
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

    const response = await this.addWebinarRegistrant({
      step,
      webinarId,
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

    step.export("$summary", `Successfully added registrant to webinar with ID \`${response.id}\``);

    return response;
  },
};
