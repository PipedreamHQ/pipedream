import app from "../../zoom.app.mjs";

export default {
  key: "zoom-add-webinar-registrant",
  name: "Add Webinar Registrant",
  description: "Registers a participant for a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrantcreate).",
  version: "0.3.0",
  type: "action",
  props: {
    app,
    webinarId: {
      propDefinition: [
        app,
        "webinarId",
      ],
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
        occurrence_ids: occurrenceIds,
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
        custom_questions: typeof(customQuestions) === "undefined"
          ? customQuestions
          : JSON.parse(customQuestions),
      },
    });

    step.export("$summary", `Successfully added registrant to webinar with ID \`${response.id}\``);

    return response;
  },
};
