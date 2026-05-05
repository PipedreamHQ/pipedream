import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-import-message",
  name: "Import Message",
  description: "Import a message into a ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-import-message)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    teamleaderFocus,
    ticketId: {
      propDefinition: [
        teamleaderFocus,
        "ticketId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Uses HTML formatting",
    },
    sentByType: {
      type: "string",
      label: "Sent By Type",
      description: "The type of the sender",
      options: constants.SENT_BY_TYPE_OPTIONS,
      reloadProps: true,
    },
    company: {
      propDefinition: [
        teamleaderFocus,
        "company",
      ],
      label: "Sent By Id (Company)",
      hidden: true,
    },
    contact: {
      propDefinition: [
        teamleaderFocus,
        "contact",
      ],
      label: "Sent By Id (Contact)",
      hidden: true,
    },
    user: {
      propDefinition: [
        teamleaderFocus,
        "user",
      ],
      label: "Sent By Id (User)",
      hidden: true,
    },
    sentAt: {
      type: "string",
      label: "Sent At",
      description: "The date and time the message was sent, E.g. `2024-02-29T11:11:11+00:00`",
    },
    fileIds: {
      type: "string[]",
      label: "File IDs",
      description: "Identifiers of files",
      optional: true,
    },
  },
  async additionalProps(props) {
    props.company.hidden = true;
    props.contact.hidden = true;
    props.user.hidden = true;

    switch (this.sentByType) {
    case "company":
      props.company.hidden = false;
      break;
    case "contact":
      props.contact.hidden = false;
      break;
    case "user":
      props.user.hidden = false;
      break;
    }
    return {};
  },
  async run({ $ }) {
    const {
      teamleaderFocus,
      ticketId,
      body,
      sentByType,
      company,
      contact,
      user,
      sentAt,
      fileIds,
    } = this;

    let sentById;
    switch (sentByType) {
    case "company":
      sentById = company;
      break;
    case "contact":
      sentById = contact;
      break;
    case "user":
      sentById = user;
      break;
    }

    const { data: response } = await teamleaderFocus.importMessage({
      $,
      data: {
        id: ticketId,
        body,
        sent_by: {
          type: sentByType,
          id: sentById,
        },
        sent_at: sentAt,
        attachments: parseObject(fileIds),
      },
    });
    $.export("$summary", `Successfully imported message for ticket with ID ${ticketId}`);
    return response;
  },
};
