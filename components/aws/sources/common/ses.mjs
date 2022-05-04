import { v4 as uuid } from "uuid";
import base from "../common/sns.mjs";

export default {
  ...base,
  hooks: {
    // We only want to create the S3 bucket once, on deploy
    async deploy() {
      await base.hooks.activate.bind(this)();

      const region = this.getRegion();
      const bucketName = this._getBucketName();
      console.log(await this.aws.createS3Bucket(region, bucketName));
      const bucketPolicy = this._allowSESPutsBucketPolicy(
        bucketName,
        await this.aws.getAWSAccountId(),
      );
      console.log(await this.aws.putS3BucketPolicy(region, bucketName, bucketPolicy));
    },
    // But since the SNS topic tied to the subcription is re-created on activate / deactivate,
    // receipt notification needs to run in these hooks, as well
    async activate() {
      try {
        const topicName = this.getTopicName();
        const topicArn = await this._createTopic(topicName);
        this._setTopicArn(topicArn);

        await this._subscribeToTopic(topicArn);
        await this._enableReceiptNotifications(this._getBucketName(), topicArn);
      } catch (err) {
        console.log("Failed to enable receipt notifications", err);
      }
    },
    async deactivate() {
      const subscriptionArn = this._getSubscriptionArn();
      await this._unsubscribeFromTopic(subscriptionArn);

      const topicArn = this.getTopicArn();
      await this._deleteTopic(topicArn);
      this._setTopicArn(null);
      await this._disableReceiptNotifications();
    },
  },
  methods: {
    ...base.methods,
    _getSesClient() {
      const region = this.getRegion();
      const AWS = this.aws.sdk(region);
      return new AWS.SES();
    },
    async _getReceiptRuleSet() {
      const {
        Metadata: metadata,
        Rules: rules,
      } = await this
        ._getSesClient()
        .describeActiveReceiptRuleSet()
        .promise();

      if (!metadata) {
        await this._createReceiptRuleSet();
        return this._getReceiptRuleSet();
      }

      return {
        metadata,
        rules,
      };
    },
    async _createReceiptRuleSet() {
      const params = {
        RuleSetName: `pd-${uuid()}`,
      };
      await this
        ._getSesClient()
        .createReceiptRuleSet(params)
        .promise();
      await this
        ._getSesClient()
        .setActiveReceiptRuleSet(params)
        .promise();
    },
    _getRuleSetInfo() {
      return this.db.get("ses-rule");
    },
    _setBucketUUID() {
      const bucketUUID = uuid();
      this.db.set("bucketUUID", bucketUUID);
      return bucketUUID;
    },
    _getBucketUUID() {
      return this.db.get("bucketUUID");
    },
    _getBucketName() {
      let bucketUUID = this._getBucketUUID();
      if (!bucketUUID) {
        bucketUUID = this._setBucketUUID();
      }
      return `pd-catchall-${bucketUUID}`;
    },
    _setRuleSetInfo(ruleSetInfo) {
      this.db.set("ses-rule", ruleSetInfo);
    },
    _allowSESPutsBucketPolicy(bucketName, accountId) {
      return `{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowSESPuts",
                "Effect": "Allow",
                "Principal": {
                    "Service": "ses.amazonaws.com"
                },
                "Action": "s3:PutObject",
                "Resource": "arn:aws:s3:::${bucketName}/*",
                "Condition": {
                    "StringEquals": {
                        "aws:Referer": "${accountId}"
                    }
                }
            }
        ]
      }`;
    },
    async _enableReceiptNotifications(bucketName, topicArn) {
      const {
        metadata,
        rules,
      } = await this._getReceiptRuleSet();
      const {
        name: ruleName,
        rule: newRule,
      } = this.getReceiptRule(bucketName, topicArn);

      const { Name: ruleSetName } = metadata;
      const { Name: after } = rules.pop() || {};
      const params = {
        RuleSetName: ruleSetName,
        After: after,
        Rule: newRule,
      };
      await this
        ._getSesClient()
        .createReceiptRule(params)
        .promise();

      this._setRuleSetInfo({
        ruleName,
        ruleSetName,
      });
    },
    async _disableReceiptNotifications() {
      const {
        ruleName,
        ruleSetName,
      } = this._getRuleSetInfo();
      const params = {
        RuleName: ruleName,
        RuleSetName: ruleSetName,
      };
      await this
        ._getSesClient()
        .deleteReceiptRule(params)
        .promise();
    },
    getReceiptRule() {
      throw new Error("getReceiptRule is not implemented");
    },
    getTopicName() {
      const topicNameCandidate = `pd-ses-${this.domain}-${uuid()}`;
      return this.convertNameToValidSNSTopicName(topicNameCandidate);
    },
    async sesIdentities() {
      const { Identities: identities } = await this
        ._getSesClient()
        .listIdentities()
        .promise();
      return identities;
    },
  },
};
