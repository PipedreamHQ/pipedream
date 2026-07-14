import app from "../../roblox.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "roblox-send-user-notification",
  name: "Send User Notification",
  description: "Send an experience notification to a Roblox user. Requires a notification string created in the [Creator Dashboard](https://create.roblox.com/docs/production/promotion/experience-notifications). [See the documentation](https://create.roblox.com/docs/cloud/reference/UserNotification#Cloud_CreateUserNotification)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The ID of the Roblox user to notify.",
    },
    universeId: {
      propDefinition: [
        app,
        "universeId",
      ],
      description: "The ID of the universe (experience) the notification is sent from.",
    },
    messageId: {
      type: "string",
      label: "Notification String ID",
      description: "The ID of the notification string (message template) to send, created in the Creator Dashboard.",
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "A map of parameters used to render placeholders in the notification string template. Each value must be an object with a `stringValue`. For example, given a template `Your {egg_name} just hatched.`, pass `{ \"egg_name\": { \"stringValue\": \"royal egg\" } }`.",
      optional: true,
    },
    launchData: {
      type: "string",
      label: "Launch Data",
      description: "Arbitrary data made available to the experience when the user joins from the notification (max 200 bytes).",
      optional: true,
    },
    analyticsCategory: {
      type: "string",
      label: "Analytics Category",
      description: "Category of the notification, used to group analytics data (e.g. `Bronze egg hatched`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createUserNotification({
      $,
      userId: this.userId,
      data: {
        source: {
          universe: `universes/${this.universeId}`,
        },
        payload: {
          type: constants.NOTIFICATION_TYPE,
          messageId: this.messageId,
          parameters: parseObject(this.parameters),
          joinExperience: this.launchData
            ? {
              launchData: this.launchData,
            }
            : undefined,
          analyticsData: this.analyticsCategory
            ? {
              category: this.analyticsCategory,
            }
            : undefined,
        },
      },
    });
    $.export("$summary", `Sent notification to user ${this.userId}`);
    return response;
  },
};
