import axios from "axios";
import { axios as axiosPipedream } from "@pipedream/platform";

export default {
  type: "app",
  app: "postmark",
  propDefinitions: {
    templateAlias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      async options() {
        return this.listTemplates();
      },
    },
  },
  methods: {
    _apikey() {
      return this.$auth.api_key;
    },
    async listTemplates() {
      const { data } = await axios({
        url: "https://api.postmarkapp.com/templates?Count=500&Offset=0&TemplateType=Standard",
        headers: this.getHeaders(),
        method: "GET",
      });

      return data.TotalCount
        ? data.Templates.map((obj) => {
          return {
            label: obj.Name,
            value: obj.Alias,
          };
        })
        : [];

    },
    getHeaders() {
      return {
        "X-Postmark-Server-Token": this._apikey(),
        "Content-Type": "application/json",
        "Accept": "application/json",
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
    async sharedActionRequest($, action, endpoint, uniqueProps) {
      return await axiosPipedream($, {
        url: `https://api.postmarkapp.com/${endpoint}`,
        headers: this.getHeaders(),
        method: "POST",
        data: {
          ...uniqueProps,
          From: action.fromEmail,
          To: action.toEmail,
          Cc: action.ccEmail,
          Bcc: action.bccEmail,
          Tag: action.tag,
          ReplyTo: action.replyTo,
          Headers: action.customHeaders,
          TrackOpens: action.trackOpens,
          TrackLinks: action.trackLinks,
          Attachments: this.getAttachmentData(this.attachments),
          Metadata: action.metadata,
          MessageStream: action.messageStream,
        },
      });
    },
    async setServerInfo(params) {
      return await axios
        .put(
          "https://api.postmarkapp.com/server",
          params,
          {
            headers: this.getHeaders(),
          },
        )
        .then(({ data }) => data);
    },
  },
};
