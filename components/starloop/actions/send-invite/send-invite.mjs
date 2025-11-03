import app from "../../starloop.app.mjs";

export default {
  key: "starloop-send-invite",
  name: "Send Invite",
  description: "Creates a new recipient and sends a Starloop invite (Email | SMS | both) to your customer to leave a review. [See the documentation](https://help.starloop.com/article/46-api-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
    profileId: {
      propDefinition: [
        app,
        "profileId",
      ],
    },
    testMode: {
      propDefinition: [
        app,
        "testMode",
      ],
    },
  },
  methods: {
    sendInvite(args = {}) {
      return this.app.post({
        path: "/send_invite",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      sendInvite,
      firstName,
      email,
      phone,
      businessId,
      profileId,
      testMode,
    } = this;

    return sendInvite({
      step,
      params: {
        first_name: firstName,
        email,
        phone,
        business_id: businessId,
        profile_id: profileId,
        test_mode: testMode,
      },
      summary: () => "Successfully sent invite",
    });
  },
};
