import aws from "../aws.app.mjs";
import {
  SESClient,
  ListIdentitiesCommand,
  CreateReceiptRuleCommand,
  DeleteReceiptRuleCommand,
  CreateReceiptRuleSetCommand,
  SetActiveReceiptRuleSetCommand,
  DescribeActiveReceiptRuleSetCommand,
} from "@aws-sdk/client-ses";

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
    _clientSes() {
      return this.aws.getAWSClient(SESClient, this.region);
    },
    async describeActiveReceiptRuleSet() {
      return this._clientSes().send(new DescribeActiveReceiptRuleSetCommand({}));
    },
    async createReceiptRule(params) {
      return this._clientSes().send(new CreateReceiptRuleCommand(params));
    },
    async createReceiptRuleSet(params) {
      return this._clientSes().send(new CreateReceiptRuleSetCommand(params));
    },
    async setActiveReceiptRuleSet(params) {
      return this._clientSes().send(new SetActiveReceiptRuleSetCommand(params));
    },
    async deleteReceiptRule(params) {
      return this._clientSes().send(new DeleteReceiptRuleCommand(params));
    },
    async listIdentities() {
      return this._clientSes().send(new ListIdentitiesCommand({}));
    },
  },
};
