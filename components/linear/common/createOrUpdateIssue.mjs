import { ConfigurationError } from "@pipedream/platform";

export default {
  methods: {
    checkOutdatedAuthError(err) {
      if (
        err.message ===
        "`createAsUser` used without OAuth `actor=application` mode"
      ) {
        throw new ConfigurationError(
          "**Update required** - please reconnect your Linear app account.",
        );
      } else throw err;
    },
  },
  async additionalProps() {
    const props = {
      createAsUser: {
        type: "string",
        label: "Username",
        description: "The user that is performing this action.",
      },
      displayIconUrl: {
        type: "string",
        label: "Display Icon URL",
        description:
          "The URL of the avatar for the user performing this action.",
      },
    };

    return this.useOwnUser === false
      ? props
      : {};
  },
};
