import { v4 as uuid } from "uuid";
import base from "./sns.mjs";
import commonS3 from "../../common/common-s3.mjs";
import { generateBucketSnsPolicy } from "./policies.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    bucket: commonS3.props.bucket,
  },
  hooks: {
    ...base.hooks,
    async activate() {
      this._setRegion(this.region);

      await base.hooks.activate.call(this);

      const topicArn = this.getTopicArn();
      await this._enableBucketNotifications(this.bucket, topicArn);
    },
    async deactivate() {
      const topicArn = this.getTopicArn();
      await this._disableBucketNotifications(this.bucket, topicArn);

      await base.hooks.deactivate.call(this);

      this._setRegion(null);
    },
  },
  methods: {
    ...base.methods,
    ...commonS3.methods,
    _setRegion(region) {
      this.db.set("region", region);
    },
    async _grantNotificationPermissions(bucketName, topicArn) {
      const attributeName = "Policy";
      const attributeValue = JSON.stringify(
        generateBucketSnsPolicy(bucketName, topicArn),
      );
      await this.setTopicAttribute(topicArn, attributeName, attributeValue);
    },
    async _getBucketNotifications(bucketName) {
      const params = {
        Bucket: bucketName,
      };
      return this.getBucketNotificationConfiguration(params);
    },
    async _setBucketNotifications(bucketName, config) {
      const params = {
        Bucket: bucketName,
        NotificationConfiguration: config,
      };
      return this.putBucketNotificationConfiguration(params);
    },
    async _enableBucketNotifications(bucketName, topicArn) {
      await this._grantNotificationPermissions(bucketName, topicArn);

      const newSnsConfig = {
        TopicArn: topicArn,
        Events: this.getEvents(),
      };

      const {
        TopicConfigurations: snsConfigs = [],
        ...bucketNotifications
      } = await this._getBucketNotifications(bucketName);

      const newNotificationsConfig = {
        ...bucketNotifications,
        TopicConfigurations: [
          ...snsConfigs,
          newSnsConfig,
        ],
      };

      await this._setBucketNotifications(bucketName, newNotificationsConfig);
    },
    async _disableBucketNotifications(bucketName, topicArn) {
      const {
        TopicConfigurations: snsConfigs = [],
        ...bucketNotifications
      } = await this._getBucketNotifications(bucketName);
      const newSnsConfigs = snsConfigs.filter(
        ({ TopicArn: configTopicArn }) => configTopicArn !== topicArn,
      );
      const newNotificationsConfig = {
        ...bucketNotifications,
        TopicConfigurations: newSnsConfigs,
      };
      await this._setBucketNotifications(bucketName, newNotificationsConfig);
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    getRegion() {
      return this.db
        ? this.db.get("region")
        : undefined;
    },
    getTopicName() {
      const topicNameCandidate = `pd-${this.bucket}-${uuid()}`;
      return this.convertNameToValidSNSTopicName(topicNameCandidate);
    },
    generateMeta(data) {
      const { "x-amz-request-id": id } = data.responseElements;
      const { key: summary } = data.s3.object;
      const { eventTime: isoTimestamp } = data;
      return {
        id,
        summary,
        ts: Date.parse(isoTimestamp),
      };
    },
    processEvent(event) {
      const { Message: rawMessage } = event.body;
      const {
        Records: s3Events = [],
        Event: eventType,
      } = JSON.parse(rawMessage);

      if (eventType === "s3:TestEvent") {
        console.log("Received initial test event. Skipping...");
        return;
      }

      s3Events.forEach((s3Event) => {
        const meta = this.generateMeta(s3Event);
        const { s3: item } = s3Event;
        this.$emit(item, meta);
      });
    },
  },
};
