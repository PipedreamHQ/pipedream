import { v4 as uuid } from "uuid";
import base from "../common/sns.mjs";
import commonS3 from "../../common/common-s3.mjs";
import commonSts from "../../common/common-sts.mjs";
import commonSes from "../../common/common-ses.mjs";

export default {
  ...base,
  hooks: {
    // We only want to create the S3 bucket once, on deploy
    async deploy() {
      await base.hooks.activate.bind(this)();

      const bucketName = this._getBucketName();
      console.log(await this.createBucket({
        Bucket: bucketName,
      }));
      const bucketPolicy = this._allowSESPutsBucketPolicy(
        bucketName,
        await this.getAWSAccountId(),
      );
      console.log(await this.putBucketPolicy({
        Bucket: bucketName,
        Policy: bucketPolicy,
      }));
    },
    // But since the SNS topic tied to the subcription is re-created on activate / deactivate,
    // receipt notification needs to run in these hooks, as well
    async activate() {
      try {
        await base.hooks.activate.bind(this)();

        const topicArn = this.getTopicArn();
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
    ...commonS3.methods,
    ...commonSts.methods,
    ...commonSes.methods,
    async _getReceiptRuleSet() {
      const {
        Metadata: metadata,
        Rules: rules,
      } = await this.describeActiveReceiptRuleSet();

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
      await this.createReceiptRuleSet(params);
      await this.setActiveReceiptRuleSet(params);
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
      await this.createReceiptRule(params);

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
      await this.deleteReceiptRule(params);
    },
    getReceiptRule() {
      throw new Error("getReceiptRule is not implemented");
    },
    getTopicName() {
      const topicNameCandidate = `pd-ses-${this.domain}-${uuid()}`;
      return this.convertNameToValidSNSTopicName(topicNameCandidate);
    },
  },
};
