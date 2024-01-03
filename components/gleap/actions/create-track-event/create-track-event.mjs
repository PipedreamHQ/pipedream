import gleap from "../../gleap.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gleap-create-track-event",
  name: "Create Track Event",
  description: "Creates a new track event in Gleap. [See the documentation](https://docs.gleap.io/server/rest-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gleap,
    feedbackId: {
      propDefinition: [
        gleap,
        "feedbackId",
      ],
    },
    eventName: {
      propDefinition: [
        gleap,
        "eventName",
      ],
    },
    eventData: {
      propDefinition: [
        gleap,
        "eventData",
      ],
    },
    eventDate: {
      propDefinition: [
        gleap,
        "eventDate",
      ],
    },
    userId: {
      propDefinition: [
        gleap,
        "userId",
      ],
    },
    userName: {
      propDefinition: [
        gleap,
        "userName",
      ],
    },
    userEmail: {
      propDefinition: [
        gleap,
        "userEmail",
      ],
    },
    userValue: {
      propDefinition: [
        gleap,
        "userValue",
      ],
    },
    userPhone: {
      propDefinition: [
        gleap,
        "userPhone",
      ],
    },
    userCreatedAt: {
      propDefinition: [
        gleap,
        "userCreatedAt",
      ],
    },
    customProperties: {
      propDefinition: [
        gleap,
        "customProperties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gleap.trackEvent({
      eventDate: this.eventDate,
      eventName: this.eventName,
      eventData: this.eventData,
      userId: this.userId,
    });

    // Check if any of the optional identifyUser fields are provided
    if (this.userName || this.userEmail || this.userValue || this.userPhone || this.userCreatedAt || this.customProperties) {
      await this.gleap.identifyUser({
        userId: this.userId,
        userName: this.userName,
        userEmail: this.userEmail,
        userValue: this.userValue,
        userPhone: this.userPhone,
        userCreatedAt: this.userCreatedAt,
        customProperties: this.customProperties,
      });
    }

    $.export("$summary", `Successfully created track event '${this.eventName}'`);
    return response;
  },
};
