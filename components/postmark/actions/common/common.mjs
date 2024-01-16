import postmark from "../../postmark.app.mjs";
import props from "./props.mjs";

export default {
  props: {
    postmark,
    ...props,
  },
  methods: {
    getActionRequestCommonData() {
      return {
        From: this.fromEmail,
        To: this.toEmail,
        Cc: this.ccEmail,
        Bcc: this.bccEmail,
        Tag: this.tag,
        ReplyTo: this.replyTo,
        Headers: this.customHeaders,
        TrackOpens: this.trackOpens,
        TrackLinks: this.trackLinks,
        Attachments: this.getAttachmentData(this.attachments),
        Metadata: this.metadata,
        MessageStream: this.messageStream,
      };
    },
    getTemplateRequestData() {
      return {
        ...this.getActionRequestCommonData(),
        TemplateAlias: this.templateAlias,
        TemplateModel: this.templateModel,
      };
    },
    getAttachmentData(attachments) {
      return attachments?.map((str) => {
        let params = str.split("|");
        return params.length === 3
          ? {
            Name: params[0],
            Content: params[1],
            ContentType: params[2],
          }
          : JSON.parse(str);
      });
    },
  },
};
