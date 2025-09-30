import constants from "../../common/constants.mjs";
import app from "../../uptimerobot.app.mjs";

export default {
  key: "uptimerobot-create-alert-contact",
  name: "Create Alert Contact",
  description: "Create a new alert contact. [See the documentation](https://uptimerobot.com/api/).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Alert Contact Type",
      description: "The type of the alert contact.",
      options: Object.values(constants.ALERT_CONTACT_TYPE),
      default: constants.ALERT_CONTACT_TYPE.EMAIL.value,
    },
    friendlyName: {
      description: "A friendly name for the alert contact.",
      propDefinition: [
        app,
        "friendlyName",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "Alert contact's email address Eg. `user@uptimerobot.com`, phone Eg. `12345678910` (with country code), username, url Eg. `https://example.com/webhook/` or api key Eg. `dXB0aW1lcm9ib3Q=` depending on the alert contact type.",
    },
  },
  methods: {
    createAlertContact(args = {}) {
      return this.app.post({
        path: "/newAlertContact",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createAlertContact,
      type,
      friendlyName,
      value,
    } = this;

    const response = await createAlertContact({
      $,
      data: {
        type,
        friendly_name: friendlyName,
        value,
      },
    });

    $.export("$summary", "Successfully created the alert contact.");
    return response;
  },
};
