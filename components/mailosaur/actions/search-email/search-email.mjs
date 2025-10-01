import { MATCH_OPTIONS } from "../../common/constants.mjs";
import mailosaur from "../../mailosaur.app.mjs";

export default {
  key: "mailosaur-search-email",
  name: "Search Email",
  description: "Search for received emails in a server matching specified criteria. [See the documentation](https://mailosaur.com/docs/api/#search-for-messages)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      type: "string",
      label: "Receive After",
      description:
            "Limits results to only messages received after this date/time.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Used in conjunction with `itemsPerPage` to support pagination.",
      optional: true,
    },
    itemsPerPage: {
      type: "integer",
      label: "Items Per Page",
      description:
            "A limit on the number of results to be returned per page. Can be set between 1 and 1000 items, default is 50.",
      optional: true,
    },
    dir: {
      type: "string",
      label: "Direction",
      description: "Optionally limits results based on the direction (`Sent` or `Received`).",
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
      description: "The value to seek within the target email's subject line.",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The value to seek within the target message's HTML or text body.",
      optional: true,
    },
    match: {
      type: "string",
      label: "Match",
      description: "If set to `ALL` (default), only results matching all criteria will be returned. If set to `ANY`, results matching any criteria will be returned.",
      options: MATCH_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mailosaur.searchMessages({
      $,
      params: {
        server: this.serverId,
        receiveAfter: this.receiveAfter,
        page: this.page,
        itemsPerPage: this.itemsPerPage,
        dir: this.dir,
      },
      data: {
        sentFrom: this.sentFrom,
        sentTo: this.sentTo,
        subject: this.subject,
        body: this.body,
        match: this.match,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.items.length} email(s) from server.`);
    return response;
  },
};
