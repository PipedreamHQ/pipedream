import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-create-send",
  name: "Create Send",
  description: "Create a single send. [See the docs here](https://www.twilio.com/docs/sendgrid/api-reference/single-sends/create-single-send)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Single Send.",
    },
    categoryIds: {
      propDefinition: [
        common.props.sendgrid,
        "categoryIds",
      ],
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "Set this property to an ISO 8601 formatted date-time (YYYY-MM-DDTHH:MM:SSZ) when you would like to send the Single Send. Please note that any `send_at` property value set with this endpoint will prepopulate the send date in the SendGrid user interface (UI). However, the Single Send will remain an unscheduled draft until it's updated with the [Schedule Single Send](https://www.twilio.com/docs/sendgrid/api-reference/single-sends/schedule-single-send) endpoint or SendGrid application UI. Setting this property to `now` with this endpoint will cause an error.",
      optional: true,
    },
    listIds: {
      propDefinition: [
        common.props.sendgrid,
        "listIds",
      ],
      description: "The recipient List IDs that will receive the Single Send.",
      optional: true,
      hidden: true,
    },
    segmentIds: {
      propDefinition: [
        common.props.sendgrid,
        "segmentIds",
      ],
      optional: true,
      hidden: true,
    },
    all: {
      type: "boolean",
      label: "All",
      description: "Set to `true` to send to All Contacts. If set to `false`, at least one `List Ids` or `Segment Ids` value must be provided before the Single Send is scheduled to be sent to recipients.",
      default: true,
      reloadProps: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the Single Send. Do not include this field when using a `Design Id`.",
      optional: true,
    },
    htmlContent: {
      type: "string",
      label: "HTML Content",
      description: "The HTML content of the Single Send. Do not include this field when using a `Design Id`.",
      optional: true,
    },
    plainContent: {
      type: "string",
      label: "Plain Content",
      description: "The plain text content of the Single Send. Do not include this field when using a `Design Id`.",
      optional: true,
    },
    generatePlainContent: {
      type: "boolean",
      label: "Generate Plain Content",
      description: "If set to `true`, `Plain Content` is always generated from `HTML Content`. If set to false, `Plain Content` is not altered.",
      optional: true,
    },
    designId: {
      propDefinition: [
        common.props.sendgrid,
        "designId",
      ],
      optional: true,
    },
    editor: {
      type: "string",
      label: "Editor",
      description: "The editor is used to modify the Single Send's design in the Marketing Campaigns App.",
      options: [
        "design",
        "code",
      ],
      optional: true,
    },
    suppressionGroupId: {
      propDefinition: [
        common.props.sendgrid,
        "asmGroupId",
      ],
      optional: true,
    },
    customUnsubscribeUrl: {
      type: "string",
      label: "Custom Unsubscribe URL",
      description: "The URL allowing recipients to unsubscribe — you must provide this or the `Suppression Group Id`.",
      optional: true,
    },
    senderId: {
      propDefinition: [
        common.props.sendgrid,
        "senderId",
      ],
      optional: true,
    },
    ipPool: {
      type: "string",
      label: "IP Pool",
      description: "The name of the IP Pool from which the Single Send emails are sent.",
      optional: true,
    },
  },
  async additionalProps(props) {
    props.listIds.hidden = this.all;
    props.segmentIds.hidden = this.all;
    return {};
  },
  async run({ $ }) {
    if (!this.suppressionGroupId && !this.customUnsubscribeUrl) {
      throw new ConfigurationError("You must provide either `ASM Group ID` or the `Custom Unsubscribe URL`.");
    }
    try {
      const resp = await this.sendgrid.createSingleSend({
        $,
        data: {
          name: this.name,
          categories: parseObject(this.categoryIds),
          send_at: this.sendAt,
          send_to: {
            list_ids: !this.all
              ? parseObject(this.listIds)
              : null,
            segment_ids: !this.all
              ? parseObject(this.segmentIds)
              : null,
            all: this.all,
          },
          email_config: {
            subject: this.subject,
            html_content: this.htmlContent,
            plain_content: this.plainContent,
            generate_plain_content: this.generatePlainContent,
            design_id: this.designId,
            editor: this.editor,
            suppression_group_id: this.suppressionGroupId,
            custom_unsubscribe_url: this.customUnsubscribeUrl,
            sender_id: this.senderId,
            ip_pool: this.ipPool,
          },
        },
      });
      $.export("$summary", `Successfully created single send ${this.name}`);
      return resp;
    } catch (e) {
      const errors = e.split("Unexpected error (status code: ERR_BAD_REQUEST):")[1];
      const errorJson = JSON.parse(errors);

      throw new ConfigurationError(errorJson.data.errors[0].message);
    }
  },
};
