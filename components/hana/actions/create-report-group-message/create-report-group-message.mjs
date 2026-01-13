import hana from "../../hana.app.mjs";

export default {
  key: "hana-create-report-group-message",
  name: "Create Report Group Message",
  description: "Create a report group message. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#report-message-creation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hana,
    reportGroupName: {
      propDefinition: [
        hana,
        "reportGroupName",
      ],
    },
    sourcePlatform: {
      type: "string",
      label: "Source Platform",
      description: "The platform where the reported message originated from",
      options: [
        "Website",
        "Slack",
        "Google Chat",
        "Microsoft Teams",
      ],
    },
    messageTitle: {
      type: "string",
      label: "Message Title",
      description: "A short summary or title for the report message",
    },
    messageString: {
      type: "string",
      label: "Message String",
      description: "The actual message content that is being reported",
    },
  },
  async run({ $ }) {
    const response = await this.hana.createReportGroupMessage({
      $,
      data: {
        reportGroupName: this.reportGroupName,
        sourcePlatform: this.sourcePlatform,
        messageTitle: this.messageTitle,
        messageString: this.messageString,
      },
    });
    $.export("$summary", "Successfully created new report group message.");
    return response;
  },
};
