import { MATCH_OPTIONS } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mailosaur-new-email-matching-criteria",
  name: "New Email Matching Criteria",
  description: "Emit new event when a message matching specific criteria is received. [See the documentation](https://mailosaur.com/docs/api#search-for-messages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    sentFrom: {
      type: "string",
      label: "Sent From",
      description: "The full email address or phone number from which the target message was sent.",
      optional: true,
    },
    sentTo: {
      type: "string",
      label: "Sent To",
      description: "The full email address or phone number to which the target message was sent.",
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
      description: "If set to `ALL` (default), then only results that match all specified criteria will be returned. If set to `ANY`, results that match any of the specified criteria will be returned.",
      options: MATCH_OPTIONS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getData() {
      return {
        sentFrom: this.sentFrom,
        sentTo: this.sentTo,
        subject: this.subject,
        body: this.body,
        match: this.match,
      };
    },
    getFunction() {
      return this.mailosaur.searchMessages;
    },
    getSummary(item) {
      return `New Message: ${item.subject}`;
    },
  },
  sampleEmit,
};
