import { ConfigurationError } from "@pipedream/platform";
import common from "../common.mjs";

export default {
  ...common,
  name: "Update Channel",
  key: "twitch-update-channel",
  description: `Update information for the channel owned by the authenticated user.
  At least one parameter must be provided.`,
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the stream. Value must not be an empty string",
      optional: true,
    },
    game: {
      type: "string",
      label: "Game ID",
      description: `The current game ID being played on the channel. Use “0” or “” (an empty string)
        to unset the game`,
      optional: true,
    },
    language: {
      type: "string",
      label: "Stream Language",
      description:
        `A language value must be either the ISO 639-1 two-letter code for a supported stream
        language or "other".`,
      optional: true,
    },
    delay: {
      type: "string",
      label: "Delay",
      description: `Stream delay in seconds. Stream delay is a Twitch Partner feature trying to
      set this value for other account types will return a 400 error.`,
      optional: true,
    },
  },
  async run() {
    if (!this.title && !this.game && !this.language && !this.delay) {
      throw new ConfigurationError("In order to continue you must configure at least one of the optional props.");
    }

    // get the userID of the authenticated user
    const userId = await this.getUserId();
    let params = {
      broadcaster_id: userId,
      game_id: this.game,
      broadcaster_language: this.language,
      title: this.title,
      delay: this.delay,
    };
    // remove empty values from params
    Object.keys(params).forEach((k) => (params[k] == null || params[k] == "") && delete params[k]);
    const result = (await this.twitch.updateChannel(params));

    // Response code of 204 indicates Channel/Stream updated successfully
    if (result.status !== 204)
      return result.data;

    // return updated channel information
    params = {
      broadcaster_id: userId,
    };
    return (await this.twitch.getChannelInformation(params)).data.data;
  },
};
