// legacy_hash_id: a_oVi3WN
import { axios } from "@pipedream/platform";

export default {
  key: "trello-search-cards",
  name: "Search Cards",
  description: "Finds a Trello card by name.",
  version: "0.1.1",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    query: {
      type: "string",
      description: "The search query with a length of 1 to 16384 characters.",
    },
    idBoards: {
      type: "string",
      description: "mine or a comma-separated list of board ids.",
      optional: true,
    },
    idOrganizations: {
      type: "string",
      description: "A comma-separated list of team ids.",
      optional: true,
    },
    idCards: {
      type: "string",
      description: "A comma-separated list of card ids.",
      optional: true,
    },
    card_fields: {
      type: "string",
      label: "Card Fields",
      description: "all or a comma-separated list of: badges, checkItemStates, closed, dateLastActivity, desc, descData, due, email, idAttachmentCover, idBoard, idChecklists, idLabels, idList, idMembers, idMembersVoted, idShort, labels, manualCoverAttachment, name, pos, shortLink, shortUrl, subscribed, url",
      optional: true,
    },
    cards_limit: {
      type: "integer",
      label: "Cards Limit",
      description: "The maximum number of cards to return. Maximum: 1000",
      optional: true,
    },
    cards_page: {
      type: "integer",
      label: "Cards Page",
      description: "The page of results for cards. Maximum: 100",
      optional: true,
    },
    card_board: {
      type: "boolean",
      label: "Card Board",
      description: "Whether to include the parent board with card results.",
      optional: true,
    },
    card_list: {
      type: "boolean",
      label: "Card List",
      description: "Whether to include the parent list with card results.",
      optional: true,
    },
    card_members: {
      type: "boolean",
      label: "Card Members",
      description: "Whether to include member objects with card results.",
      optional: true,
    },
    card_stickers: {
      type: "boolean",
      label: "Card Stickers",
      description: "Whether to include sticker objects with card results.",
      optional: true,
    },
    card_attachments: {
      type: "boolean",
      label: "Card Attachments",
      description: "Whether to include attachment objects with card results. A boolean value (true or false) or cover for only card cover attachments.",
      optional: true,
    },
    organization_fields: {
      type: "string",
      label: "Organization Fields",
      description: "all or a comma-separated list of billableMemberCount, desc, descData, displayName, idBoards, invitations, invited, logoHash, memberships, name, powerUps, prefs, premiumFeatures, products, url, website",
      optional: true,
    },
    organizations_limit: {
      type: "integer",
      label: "Organziations Limit",
      description: "The maximum number of teams to return. Maximum 1000.",
      optional: true,
    },
    member_fields: {
      type: "string",
      label: "Member Fields",
      description: "all or a comma-separated list of: avatarHash, bio, bioData, confirmed, fullName, idPremOrgsAdmin, initials, memberType, products, status, url, username",
      optional: true,
    },
    members_limit: {
      type: "integer",
      description: "The maximum number of members to return. Maximum 1000.",
      optional: true,
    },
    partial: {
      type: "boolean",
      description: "By default, Trello searches for each word in your query against exactly matching words within Member content. Specifying partial to be true means that we will look for content that starts with any of the words in your query. If you are looking for a Card titled \"My Development Status Report\", by default you would need to search for \"Development\". If you have partial enabled, you will be able to search for \"dev\" but not \"velopment\".",
      optional: true,
    },
  },
  async run({ $ }) {
    const trelloParams = [
      "query",
      "idBoards",
      "idOrganizations",
      "idCards",
      "card_fields",
      "cards_limit",
      "cards_page",
      "card_board",
      "card_list",
      "card_members",
      "card_stickers",
      "card_attachments",
      "organization_fields",
      "organizations_limit",
      "member_fields",
      "members_limit",
      "partial",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    return await axios($, {
      url: `https://api.trello.com/1/search?modelTypes=cards&${queryString}`,
      method: "GET",
    }, {
      token: {
        key: this.trello.$auth.oauth_access_token,
        secret: this.trello.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.trello.$auth.oauth_signer_uri,
    });
  },
};
