import aws from "../aws/aws.app.mjs";
import {
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "amazon_ses",
  propDefinitions: {
    ...aws.propDefinitions,
  },
  methods: {
    ...aws.methods,
    _client() {
      return this.getAWSClient(SESv2Client, this.region);
    },
    createCharsetContent(Data, Charset = constants.UTF_8) {
      return {
        Charset,
        Data,
      };
    },
    async sendEmail(params) {
      return this._client().send(new SendEmailCommand(params));
    },
  },
};
