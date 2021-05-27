const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-list-blocks",
  name: "List Blocks",
  description: "Allows you to list all email addresses that are currently on your blocks list.",
  version: "0.0.6",
  type: "action",
  props: {
    sendgrid,
    startTime: {
      type: "integer",
      label: "Start Time",
      description: "The start of the time range when a blocked email was created (inclusive). This is a unix timestamp.",
      optional: true,
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description: "The end of the time range when a blocked email was created (inclusive). This is a unix timestamp.",
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
      description: "The point in the list to begin displaying results.",
      optional: true,
    }
  },
  async run() {
    return await this.sendgrid.listBlocks(this.startTime,this.endTime,this.limit,this.offset);
  },
};
