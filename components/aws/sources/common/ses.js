const { v4: uuid } = require("uuid");
const base = require("../common/sns");

module.exports = {
  ...base,
  hooks: {
    ...base.hooks,
    async activate() {
      await base.hooks.activate.bind(this)();

      const topicArn = this.getTopicArn();
      await this._enableReceiptNotifications(topicArn);
    },
    async deactivate() {
      await this._disableReceiptNotifications();
      await base.hooks.deactivate.bind(this)();
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
    _setRuleSetInfo(ruleSetInfo) {
      this.db.set("ses-rule", ruleSetInfo);
    },
    async _enableReceiptNotifications(topicArn) {
      const {
        metadata,
        rules,
      } = await this._getReceiptRuleSet();
      const {
        name: ruleName,
        rule: newRule,
      } = this.getReceiptRule(topicArn);

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
