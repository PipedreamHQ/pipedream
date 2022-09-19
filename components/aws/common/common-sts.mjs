import aws from "../aws.app.mjs";
import {
  STSClient,
  GetCallerIdentityCommand,
} from "@aws-sdk/client-sts";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
  },
  methods: {
    _clientSts() {
      return this.aws.getAWSClient(STSClient, this.region);
    },
    async getAWSAccountId() {
      const { Account } = await this._clientSts().send(new GetCallerIdentityCommand({}));
      return Account;
    },
  },
};
