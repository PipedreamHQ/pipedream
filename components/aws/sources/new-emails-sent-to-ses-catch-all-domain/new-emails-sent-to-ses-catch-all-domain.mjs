import { v4 as uuid } from "uuid";
import base from "../common/ses.mjs";
import { toSingleLineString } from "../common/utils.mjs";

export default {
  ...base,
  key: "aws-new-emails-sent-to-ses-catch-all-domain",
  name: "New Emails sent to SES Catch-all Domain",
  description: toSingleLineString(`
    The source subscribes to all emails delivered to a
    specific domain configured in AWS SES.
    When an email is sent to any address at the domain,
    this event source emits that email as a formatted event.
    These events can trigger a Pipedream workflow and can be consumed via SSE or REST API.
  `),
  type: "source",
  version: "1.0.0",
  props: {
    ...base.props,
    domain: {
      label: "SES Domain",
      description: "The domain you'd like to configure a catch-all handler for",
      type: "string",
      options() {
        return this.sesIdentities();
      },
    },
  },
  methods: {
    ...base.methods,
    getReceiptRule(bucketName, topicArn) {
      const name = `pd-${this.domain}-catchall-${uuid()}`;
      const rule = {
        Name: name,
        Enabled: true,
        Actions: [
          {
            S3Action: {
              TopicArn: topicArn,
              BucketName: bucketName,
            },
          },
        ],
        Recipients: [
          this.domain,
        ],
        ScanEnabled: true,
      };
      return {
        name,
        rule,
      };
    },
    async processEvent(event) {
      const { body } = event;
      const { Message: rawMessage } = body;
      if (!rawMessage) {
        console.log("No message present, exiting");
        return;
      }

      const meta = this.generateMeta(event);
      const message = JSON.parse(rawMessage);
      try {
        this.$emit(message, meta);
      } catch (err) {
        console.log(
          `Couldn't parse message as JSON. Emitting raw message. Error: ${err}`,
        );
        this.$emit({
          rawMessage,
        }, meta);
      }
    },
  },
};
