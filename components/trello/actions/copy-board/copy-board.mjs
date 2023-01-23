// legacy_hash_id: a_B0izQg
import { axios } from "@pipedream/platform";

export default {
  key: "trello-copy-board",
  name: "Copy a Board",
  description: "Creates a copy of an existing board.",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    name: {
      type: "string",
      description: "The new name for the board. 1 to 16384 characters long.",
    },
    defaultLabels: {
      type: "boolean",
      description: "Determines whether to use the default set of labels.",
      optional: true,
    },
    defaultLists: {
      type: "boolean",
      description: "Determines whether to add the default set of lists to a board (To Do, Doing, Done). It is ignored if idBoardSource is provided.",
      optional: true,
    },
    desc: {
      type: "string",
      description: "A new description for the board, 0 to 16384 characters long.",
      optional: true,
    },
    idOrganization: {
      type: "string",
      description: "The id or name of the team the board should belong to.",
      optional: true,
    },
    idBoardSource: {
      type: "string",
      description: "The id of a board to copy into the new board.",
    },
    keepFromSource: {
      type: "string",
      description: "To keep cards from the original board pass in the value \"cards\".",
      optional: true,
      options: [
        "none",
        "cards",
      ],
    },
    powerUps: {
      type: "string",
      description: "The Power-Ups that should be enabled on the new board. One of: all, calendar, cardAging, recap, voting.",
      optional: true,
    },
    prefs_permissionLevel: {
      type: "string",
      description: "The permissions level of the board. One of: org, private, public.",
      optional: true,
      options: [
        "org",
        "private",
        "public",
      ],
    },
    prefs_voting: {
      type: "string",
      label: "Prefs Voting",
      description: "Who can vote on this board. One of disabled, members, observers, org, public.",
      optional: true,
      options: [
        "disabled",
        "members",
        "observers",
        "org",
        "public",
      ],
    },
    prefs_comments: {
      type: "string",
      label: "Prefs Comments",
      description: "Who can comment on cards on this board. One of: disabled, members, observers, org, public.",
      optional: true,
      options: [
        "disabled",
        "members",
        "observers",
        "org",
        "public",
      ],
    },
    prefs_invitations: {
      type: "string",
      label: "Prefs Invitations",
      description: "Determines what types of members can invite users to join. One of: admins, members.",
      optional: true,
      options: [
        "admins",
        "members",
      ],
    },
    prefs_selfJoin: {
      type: "boolean",
      description: "Determines whether users can join the boards themselves or whether they have to be invited.",
      optional: true,
    },
    prefs_cardCovers: {
      type: "string",
      description: "Determines whether card covers are enabled.",
      optional: true,
    },
    prefs_background: {
      type: "string",
      label: "Prefs Background",
      description: "The id of a custom background or one of: blue, orange, green, red, purple, pink, lime, sky, grey.",
      optional: true,
    },
    prefs_cardAging: {
      type: "string",
      description: "Determines the type of card aging that should take place on the board if card aging is enabled. One of: pirate, regular.",
      optional: true,
      options: [
        "pirate",
        "regular",
      ],
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    const trelloParams = [
      "name",
      "defaultLabels",
      "defaultLists",
      "desc",
      "idOrganization",
      "idBoardSource",
      "keepFromSource",
      "powerUps",
      "prefs_permissionLevel",
      "prefs_voting",
      "prefs_comments",
      "prefs_invitations",
      "prefs_selfJoin",
      "prefs_cardCovers",
      "prefs_background",
      "prefs_cardAging",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/boards?${queryString}`,
      method: "POST",
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
