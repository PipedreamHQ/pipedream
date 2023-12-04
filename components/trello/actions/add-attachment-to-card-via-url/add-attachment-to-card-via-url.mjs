import common from "../common.mjs";

export default {
  ...common,
  key: "trello-add-attachment-to-card-via-url",
  name: "Add Attachment to Card via URL",
  description: "Adds a file attachment on a card by referencing a public URL. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-attachments-post)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    idCard: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the Card to add the Attachment to",
      optional: false,
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
    },
    url: {
      propDefinition: [
        common.props.trello,
        "url",
      ],
    },
    mimeType: {
      propDefinition: [
        common.props.trello,
        "mimeType",
      ],
    },
    setCover: {
      type: "boolean",
      label: "Set Cover?",
      description: "Determines whether to use the new attachment as a cover for the Card",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      idCard,
      name,
      url,
      mimeType,
      setCover,
    } = this;
    const res = await this.trello.addAttachmentToCardViaUrl(idCard, {
      name,
      url,
      mimeType,
      setCover,
    }, $);
    $.export("$summary", `Successfully added attachement to card ${idCard}`);
    return res;
  },
};
