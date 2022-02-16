// legacy_hash_id: a_2wimVb
import { axios } from "@pipedream/platform";

export default {
  key: "trello-update-card",
  name: "Update Card",
  description: "Updates the specified card.",
  version: "0.1.1",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    id: {
      type: "string",
      description: "The ID of the card to update.",
    },
    name: {
      type: "string",
      description: "The new name for the card.",
      optional: true,
    },
    desc: {
      type: "string",
      description: "The new description for the card.",
      optional: true,
    },
    closed: {
      type: "boolean",
      description: "Whether the card should be archived (closed: true).",
      optional: true,
    },
    idMembers: {
      type: "string",
      description: "Comma-separated list of member IDs.",
      optional: true,
    },
    idAttachmentCover: {
      type: "string",
      description: "The ID of the image attachment the card should use as its cover, or null for none.",
      optional: true,
    },
    idList: {
      type: "string",
      description: "The ID of the list the card should be in.",
      optional: true,
    },
    idLabels: {
      type: "string",
      description: "Comma-separated list of label IDs.",
      optional: true,
    },
    idBoard: {
      type: "string",
      description: "The ID of the board the card should be on.",
      optional: true,
    },
    pos: {
      type: "string",
      description: "The position of the card in its list. top, bottom, or a positive float.",
      optional: true,
    },
    due: {
      type: "string",
      description: "When the card is due, or null.",
      optional: true,
    },
    dueComplete: {
      type: "boolean",
      description: "Whether the due date should be marked complete.",
      optional: true,
    },
    subscribed: {
      type: "boolean",
      description: "Whether the member is should be subscribed to the card.",
      optional: true,
    },
    address: {
      type: "string",
      description: "For use with/by the Map Power-Up,",
      optional: true,
    },
    locationName: {
      type: "string",
      description: "For use with/by the Map Power-Up.",
      optional: true,
    },
    coordinates: {
      type: "string",
      description: "For use with/by the Map Power-Up. Should be latitude, longitude.",
      optional: true,
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    const trelloParams = [
      "name",
      "desc",
      "closed",
      "idMembers",
      "idAttachmentCover",
      "idList",
      "idLabels",
      "idBoard",
      "pos",
      "due",
      "dueComplete",
      "subscribed",
      "address",
      "locationName",
      "coordinates",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/cards/${id}?${queryString}`,
      method: "PUT",
      data: "",
    };

    const token = {
      key: this.trello.$auth.oauth_access_token,
      secret: this.trello.$auth.oauth_refresh_token,
    };

    const signConfig = {
      token,
      oauthSignerUri,
    };

    const resp = await axios($, config, signConfig);
    return resp;
  },
};
