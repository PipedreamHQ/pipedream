import reachmail from "../../reachmail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "reachmail-send-transactional-email",
  name: "Send Transactional Email",
  description: "Send a transactional email on a one-to-one basis. [See the documentation](https://services.reachmail.net/)",
  version: "0.0.1",
  type: "action",
  props: {
    reachmail,
    emailContent: reachmail.propDefinitions.emailContent,
    recipient: reachmail.propDefinitions.recipient,
    subject: reachmail.propDefinitions.subject,
    cc: {
      ...reachmail.propDefinitions.cc,
      optional: true,
    },
    bcc: {
      ...reachmail.propDefinitions.bcc,
      optional: true,
    },
    tags: {
      ...reachmail.propDefinitions.tags,
      optional: true,
    },
    attachments: {
      ...reachmail.propDefinitions.attachments,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.reachmail.sendTransactionalEmail({
      emailContent: this.emailContent,
      recipient: this.recipient,
      subject: this.subject,
      cc: this.cc,
      bcc: this.bcc,
      tags: this.tags,
      attachments: this.attachments,
    });

    $.export("$summary", `Successfully sent transactional email to ${this.recipient}`);
    return response;
  },
};
