import klaviyo from "../../klaviyo.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "klaviyo-create-event",
  name: "Create Event",
  description: "Create a new event to track a profile's activity. [See the documentation](https://developers.klaviyo.com/en/reference/create_event)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    klaviyo,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "warning",
      content: "At least one profile identifier (**Email**, **Phone Number**, **External ID**, or **Profile ID**) must be provided",
    },
    metricName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event/metric to track (e.g., `Viewed Product`, `Added to Cart`)",
    },
    properties: {
      type: "object",
      label: "Event Properties",
      description: `Custom properties for the event as a JSON object with key-value pairs.

**Example:**
\`\`\`json
{
  "Brand": "Kids Book",
  "ProductID": 1111,
  "ProductName": "Winnie the Pooh"
}
\`\`\``,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the profile",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the profile (E.164 format, e.g., `+12345678901`)",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "A unique identifier from an external system",
      optional: true,
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "The Klaviyo profile ID",
      optional: true,
      propDefinition: [
        klaviyo,
        "profileIds",
      ],
    },
    value: {
      type: "string",
      label: "Event Value",
      description: "A numeric value to associate with this event (e.g., `100.00`)",
      optional: true,
    },
    uniqueId: {
      type: "string",
      label: "Unique ID",
      description: "A unique identifier for the event. Use uuidv4 or similar. If not provided, Klaviyo will generate one.",
      optional: true,
    },
    time: {
      type: "string",
      label: "Event Time",
      description: "When the event occurred in ISO 8601 format (e.g., `2023-09-15T12:00:00Z`). Defaults to current time if not provided.",
      optional: true,
    },
    profileProperties: {
      type: "object",
      label: "Profile Properties",
      description: "Optional properties to update on the profile as a JSON object",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      klaviyo,
      metricName,
      email,
      phoneNumber,
      externalId,
      profileId,
      properties,
      value,
      uniqueId,
      time,
      profileProperties,
    } = this;

    if (!email && !phoneNumber && !externalId && !profileId) {
      throw new Error("At least one profile identifier (email, phone number, external ID, or profile ID) must be provided");
    }

    const profileData = {
      type: "profile",
    };

    if (profileId) {
      profileData.id = profileId;
    }

    const profileAttributes = {};

    if (email) {
      profileAttributes.email = email;
    }

    if (phoneNumber) {
      profileAttributes.phoneNumber = phoneNumber;
    }

    if (externalId) {
      profileAttributes.externalId = externalId;
    }

    if (profileProperties) {
      profileAttributes.properties = parseObject(profileProperties);
    }

    if (Object.keys(profileAttributes).length > 0) {
      profileData.attributes = profileAttributes;
    }

    const eventAttributes = {
      metric: {
        data: {
          type: "metric",
          attributes: {
            name: metricName,
          },
        },
      },
      profile: {
        data: profileData,
      },
    };

    if (properties) {
      eventAttributes.properties = parseObject(properties);
    }

    if (value) {
      eventAttributes.value = value;
    }

    if (uniqueId) {
      eventAttributes.uniqueId = uniqueId;
    }

    if (time) {
      eventAttributes.time = time;
    }

    const data = {
      type: "event",
      attributes: eventAttributes,
    };

    try {
      await klaviyo.createEvent({
        data,
      });

      $.export("$summary", `Successfully created event "${metricName}" for profile`);
      return {
        success: true,
      };

    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
};
