import app from "../../scrapecreators.app.mjs";

export default {
  key: "scrapecreators-fetch-creator-profile",
  name: "Fetch Creator Profile",
  description: "Fetch a creator profile based on platform and handle or unique ID. [See the documentation](https://docs.scrapecreators.com/introduction)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    platform: {
      propDefinition: [
        app,
        "platform",
      ],
    },
    profileId: {
      propDefinition: [
        app,
        "profileId",
      ],
    },
  },
  async run({ $ }) {
    const summary = `Successfully fetched creator profile for **${this.profileId}**`;
    try {
      const response = await this.app.fetchCreatorProfile({
        $,
        platform: this.platform,
        profileId: this.profileId,
      });

      $.export("$summary", summary);
      return response;
    } catch ({ response }) {
      if (response.data?.success === true) {
        $.export("$summary", summary);
        return {
          message: response.data.message,
        };
      }
      throw new Error(response.data.message);
    }
  },
};
