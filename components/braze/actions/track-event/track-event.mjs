import { ConfigurationError } from "@pipedream/platform";
import app from "../../braze.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "braze-track-event",
  name: "Track An Event",
  description: "Tracks an event. [See the docs](https://www.braze.com/docs/api/endpoints/user_data/post_user_track#user-track).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    name: {
      type: "string",
      label: "Event Name",
      description: "The name of the event.",
    },
    time: {
      type: "string",
      label: "Time",
      description: "Datetime as string in ISO 8601 or in `yyyy-MM-dd'T'HH:mm:ss:SSSZ` format.",
      default: new Date().toISOString(),
    },
    userAliasName: {
      optional: true,
      propDefinition: [
        app,
        "userAliasName",
      ],
    },
    userAliasLabel: {
      optional: true,
      propDefinition: [
        app,
        "userAliasLabel",
      ],
    },
    userExternalId: {
      optional: true,
      propDefinition: [
        app,
        "userExternalId",
      ],
    },
    brazeId: {
      optional: true,
      propDefinition: [
        app,
        "brazeId",
      ],
    },
  },
  methods: {
    userTrack(args = {}) {
      return this.app.create({
        path: "/users/track",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      name,
      time,
      userExternalId,
      userAliasName,
      userAliasLabel,
      brazeId,
    } = this;

    const event = utils.reduceProperties({
      initialProps: {
        name,
        time,
      },
      additionalProps: {
        external_id: userExternalId,
        braze_id: brazeId,
        user_alias: [
          {
            alias_name: userAliasName,
            alias_label: userAliasLabel,
          },
          userAliasName || userAliasLabel,
        ],
      },
    });

    if (!event.external_id && !event.user_alias && !event.braze_id) {
      throw new ConfigurationError("You must provide at least one of the following: User External ID, User Alias or Braze ID.");
    }

    const response = await this.userTrack({
      data: {
        events: [
          event,
        ],
      },
    });

    step.export("$summary", "Successfully tracked event");

    return response;
  },
};
