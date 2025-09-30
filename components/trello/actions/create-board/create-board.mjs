import constants from "../../common/constants.mjs";
import app from "../../trello.app.mjs";

export default {
  key: "trello-create-board",
  name: "Create a Board",
  description: "Create a new Trello board or copy from an existing one. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-post).",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the board. 1 to 16384 characters long.",
    },
    defaultLabels: {
      type: "boolean",
      label: "Default Labels",
      description: "Determines whether to use the default set of labels.",
      optional: true,
    },
    defaultLists: {
      type: "boolean",
      label: "Default Lists",
      description: "Determines whether to add the default set of lists to a board (To Do, Doing, Done). It is ignored if idBoardSource is provided.",
      optional: true,
    },
    desc: {
      type: "string",
      label: "Description",
      description: "A new description for the board, 0 to 16384 characters long",
      optional: true,
    },
    idOrganization: {
      type: "string",
      label: "Organization ID",
      description: "The id or name of the team the board should belong to.",
      optional: false,
      propDefinition: [
        app,
        "idOrganizations",
      ],
    },
    idBoardSource: {
      label: "Board Source ID",
      description: "The id of a board to copy into the new board.",
      optional: true,
      propDefinition: [
        app,
        "board",
      ],
    },
    keepFromSource: {
      type: "string",
      label: "Keep From Source",
      description: "To keep cards from the original board pass in the value `cards`.",
      optional: true,
      options: [
        "none",
        "cards",
      ],
    },
    powerUps: {
      type: "string",
      label: "Power-Ups",
      description: "The Power-Ups that should be enabled on the new board. One of: `all`, `calendar`, `cardAging`, `recap`, `voting`.",
      optional: true,
      options: constants.POWER_UPS,
    },
    prefsPermissionLevel: {
      type: "string",
      description: "The permissions level of the board. One of: org, private, public.",
      label: "Prefs Permission Level",
      optional: true,
      options: constants.PREFS_PERMISSION_LEVELS,
    },
    prefsVoting: {
      type: "string",
      label: "Prefs Voting",
      description: "Who can vote on this board. One of disabled, members, observers, org, public.",
      optional: true,
      options: constants.PREFS_VOTING,
    },
    prefsComments: {
      type: "string",
      label: "Prefs Comments",
      description: "Who can comment on cards on this board. One of: disabled, members, observers, org, public.",
      optional: true,
      options: constants.PREFS_COMMENTS,
    },
    prefsInvitations: {
      type: "string",
      label: "Prefs Invitations",
      description: "Determines what types of members can invite users to join. One of: admins, members.",
      optional: true,
      options: constants.PREFS_INVITATIONS,
    },
    prefsSelfJoin: {
      type: "boolean",
      label: "Prefs Self Join",
      description: "Determines whether users can join the boards themselves or whether they have to be invited.",
      optional: true,
    },
    prefsCardCovers: {
      type: "boolean",
      label: "Prefs Card Covers",
      description: "Determines whether card covers are enabled.",
      optional: true,
    },
    prefsBackground: {
      type: "string",
      label: "Prefs Background",
      description: "The id of a custom background or one of: `blue`, `orange`, `green`, `red`, `purple`, `pink`, `lime`, `sky`, `grey`.",
      optional: true,
      options: constants.PREFS_BACKGROUNDS,
    },
    prefsCardAging: {
      type: "string",
      label: "Prefs Card Aging",
      description: "Determines the type of card aging that should take place on the board if card aging is enabled. One of: pirate, regular.",
      optional: true,
      options: constants.PREFS_CARD_AGING,
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      defaultLabels,
      defaultLists,
      desc,
      idOrganization,
      idBoardSource,
      keepFromSource,
      powerUps,
      prefsPermissionLevel,
      prefsVoting,
      prefsComments,
      prefsInvitations,
      prefsSelfJoin,
      prefsCardCovers,
      prefsBackground,
      prefsCardAging,
    } = this;

    const response = await app.createBoard({
      $,
      params: {
        name,
        defaultLabels,
        defaultLists,
        desc,
        idOrganization,
        idBoardSource,
        keepFromSource,
        powerUps,
        prefs_permissionLevel: prefsPermissionLevel,
        prefs_voting: prefsVoting,
        prefs_comments: prefsComments,
        prefs_invitations: prefsInvitations,
        prefs_selfJoin: prefsSelfJoin,
        prefs_cardCovers: prefsCardCovers,
        prefs_background: prefsBackground,
        prefs_cardAging: prefsCardAging,
      },
    });

    $.export("$summary", `Successfully created board with ID \`${response.id}\`.`);

    return response;
  },
};
