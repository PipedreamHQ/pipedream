import common from "../common/common.mjs";
import fields from "../../common/fields.mjs";

export default {
  ...common,
  key: "trello-get-board",
  name: "Get Board",
  description: "Request a single board. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-get).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    boardId: {
      propDefinition: [
        common.props.app,
        "board",
      ],
      label: "Board ID",
      description: "The ID of the board to retrieve",
    },
    actions: {
      propDefinition: [
        common.props.app,
        "actions",
      ],
    },
    boardStars: {
      type: "string",
      label: "Board Stars",
      description: "Valid values are one of: `mine` or `none`. Default is `none`.",
      options: [
        "mine",
        "none",
      ],
      optional: true,
    },
    cardPluginData: {
      type: "boolean",
      label: "Card Plugin Data",
      description: "Use with the cards param to include card pluginData with the response. Default is `none`.",
      optional: true,
    },
    customFields: {
      type: "boolean",
      label: "Custom Fields",
      description: "This is a nested resource. Include custom fields in the response.",
      default: false,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields of the board to be included in the response. Valid values: all or a comma-separated list of specific fields.",
      options: fields.board,
      optional: true,
    },
    labels: {
      type: "string",
      label: "Labels",
      description: "This is a nested resource. Specify what labels to include in the response. One of: `all` or `none`",
      optional: true,
      options: [
        "all",
        "none",
      ],
    },
    lists: {
      type: "string",
      label: "Lists",
      description: "This is a nested resource. Specify what lists to include in the response.",
      optional: true,
      options: [
        "all",
        "closed",
        "none",
        "open",
      ],
    },
    members: {
      type: "string",
      label: "Members",
      description: "This is a nested resource. Specify what members to include in the response.",
      optional: true,
      options: [
        "none",
        "normal",
        "admins",
        "owners",
        "all",
      ],
    },
    pluginData: {
      type: "boolean",
      label: "Plugin Data",
      description: "Determines whether the pluginData for this board should be returned.",
      optional: true,
    },
    organization: {
      type: "boolean",
      label: "Organization",
      description: "This is a nested resource. Include organization information in the response.",
      optional: true,
    },
    organizationPluginData: {
      type: "boolean",
      label: "Organization Plugin Data",
      description: "Use with the organization param to include organization pluginData with the response",
      optional: true,
    },
    myPrefs: {
      type: "boolean",
      label: "My Preferences",
      description: "Include the user's preferences for this board in the response.",
      optional: true,
    },
    tags: {
      type: "boolean",
      label: "Tags",
      description: "Also known as collections, tags, refer to the collection(s) that a Board belongs to.",
      optional: true,
    },
  },
  methods: {
    getCommaSeparatedString(array) {
      return Array.isArray(array)
        ? array.join(",")
        : array;
    },
  },
  async run({ $ }) {
    const {
      app,
      getCommaSeparatedString,
      boardId,
      actions,
      boardStars,
      cardPluginData,
      customFields,
      fields,
      labels,
      lists,
      members,
      pluginData,
      organization,
      organizationPluginData,
      myPrefs,
      tags,
    } = this;

    const response = await app.getBoard({
      $,
      boardId,
      params: {
        actions: getCommaSeparatedString(actions),
        boardStars,
        card_pluginData: cardPluginData,
        customFields,
        fields: getCommaSeparatedString(fields),
        labels: getCommaSeparatedString(labels),
        lists,
        members,
        pluginData,
        organization,
        organizationPluginData,
        myPrefs,
        tags,
      },
    });

    $.export("$summary", `Successfully retrieved board with ID \`${response.id}\``);
    return response;
  },
};
