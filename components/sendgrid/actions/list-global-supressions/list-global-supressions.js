const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-list-global-supressions",
  name: "List Global Supression",
  description: "Allows you to get a list of all email address that are globally suppressed.",
  version: "0.0.4",
  type: "action",
  props: {
    sendgrid,
    startTime: {
      type: "integer",
      label: "Start Time",
      description: "Refers start of the time range in unix timestamp when an unsubscribe email was created (inclusive).",
      optional: true,
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description: "Refers end of the time range in unix timestamp when an unsubscribe email was created (inclusive).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description:
        "Limit the number of results to be displayed per page.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The point in the list of results to begin displaying global suppressions.",
      optional: true,
    }
  },
  async run() {
    return await this.sendgrid.listGlobalSupressions(this.startTime,this.endTime,this.limit,this.offset);
  },
};
