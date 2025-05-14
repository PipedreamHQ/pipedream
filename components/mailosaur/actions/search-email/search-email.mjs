import mailosaur from "../../mailosaur.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailosaur-search-email",
  name: "Search Email",
  description: "Search for received emails in a server matching specified criteria. [See the documentation](https://mailosaur.com/docs/api/#search-for-messages)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mailosaur,
    serverId: {
      propDefinition: [
        mailosaur,
        "serverId",
      ],
    },
    receiveAfter: {
      propDefinition: [
        mailosaur,
        "receiveAfter",
      ],
      optional: true,
    },
    page: {
      propDefinition: [
        mailosaur,
        "page",
      ],
      optional: true,
    },
    itemsPerPage: {
      propDefinition: [
        mailosaur,
        "itemsPerPage",
      ],
      optional: true,
    },
    dir: {
      propDefinition: [
        mailosaur,
        "dir",
      ],
      optional: true,
    },
    sentFrom: {
      type: "string",
      label: "Sent From",
      description: "The full email address from which the target message was sent.",
      optional: true,
    },
    sentTo: {
      type: "string",
      label: "Sent To",
      description: "The full email address to which the target message was sent.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The value to seek within the target email’s subject line.",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The value to seek within the target message’s HTML or text body.",
      optional: true,
    },
    match: {
      type: "string",
      label: "Match",
      description: "If set to `ALL` (default), only results matching all criteria will be returned. If set to `ANY`, results matching any criteria will be returned.",
      options: [
        "ALL",
        "ANY",
      ],
      default: "ALL",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mailosaur.searchMessages({
      serverId: this.serverId,
      receiveAfter: this.receiveAfter,
      page: this.page,
      itemsPerPage: this.itemsPerPage,
      dir: this.dir,
      sentFrom: this.sentFrom,
      sentTo: this.sentTo,
      subject: this.subject,
      body: this.body,
      match: this.match,
    });

    $.export("$summary", `Successfully retrieved ${response.items.length} email(s) from server.`);
    return response;
  },
};
