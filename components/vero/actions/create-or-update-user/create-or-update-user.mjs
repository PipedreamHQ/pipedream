import { ConfigurationError } from "@pipedream/platform";
import app from "../../vero.app.mjs";

export default {
  type: "action",
  key: "vero-create-or-update-user",
  name: "Create or Update User",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "This endpoint creates a new user profile if the user doesn't exist yet. Otherwise, the user profile is updated based on the properties provided. [See the documentation](https://developers.getvero.com/track-api-reference/#/operations/identify)",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    channels: {
      type: "string[]",
      label: "Channels",
      description: "A valid JSON array containing hashes of key/value pairs that represent the user's device token. Each hash should represent a single device token and include the fields type, address, and platform. Ex: `{\"type\":\"push\", \"address\":\"UNIQUE_DEVICE_TOKEN\", \"platform\":\"android\"}`",
      optional: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "A valid JSON hash containing key value pairs that represent the custom user properties you want to update. The locale, timezone and userAgent attributes are reserved properties that may be updated automatically by our SDKs. You can use these properties but bear in mind they may be overwritten if using our SDKs or integrations. All other keys are freeform and can be defined by you. Ex: `{\"first_name\":\"Damien\",\"last_name\":\"Brzoska\",\"timezone\":-10}`",
      optional: true,
    },
  },
  methods: {
    parseChannels(data) {
      if (!data) {
        return null;
      }
      const parsed = [];
      for (let i = 0; i < data.length; i++) {
        let item;
        try {
          item = JSON.parse(data[i]);
        } catch (err) {
          throw new ConfigurationError(`Invalid JSON in channels property at index ${i}: ${err.message}`);
        }

        if (Array.isArray(item)) {
          throw new ConfigurationError(`Invalid JSON in channels property at index ${i}: Expected an object, but received an array. If you want to send multiple items, please create a new child`);
        }

        parsed.push(item);
      }

      return parsed;
    },
  },
  async run({ $ }) {
    const {
      app,
      parseChannels,
      ...rest
    } = this;
    const res = await app.createOrUpdateUser({
      ...rest,
      channels: parseChannels(rest.channels),
    });
    $.export("summary", `User with id "${rest.id}" created or updated successfully`);
    return res;
  },
};
