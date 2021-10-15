const { v4: uuid } = require("uuid");
const aws = require("../../aws.app.js");
const base = require("./sns");
const { generateBucketSnsPolicy } = require("./policies");

const {
  // Event sources based on S3 should extract region information from the target
  // bucket instead of requiring it from the user
  // eslint-disable-next-line no-unused-vars
  region,

  // The rest of the props in the base component will be used
  ...baseProps
} = base.props;

module.exports = {
  ...base,
  props: {
    ...baseProps,
    bucket: {
      propDefinition: [
        aws,
        "bucket",
      ],
    },
  },
  hooks: {
    ...base.hooks,
    async activate() {
      const region = await this._getRegionForBucket(this.bucket);
      this._setRegion(region);

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
    _setRegion(region) {
      this.db.set("region", region);
    },
    _getS3Client() {
      const region = this.getRegion();
      const AWS = this.aws.sdk(region);
      return new AWS.S3();
    },
    async _getBuckets() {
      const { Buckets: buckets } = await this
        ._getS3Client()
        .listBuckets()
        .promise();
      return buckets;
    },
    async _getRegionForBucket(bucketName) {
      const params = {
        Bucket: bucketName,
      };
      const { LocationConstraint: region } = await this
        ._getS3Client()
        .getBucketLocation(params)
        .promise();

      // According to the [AWS docs](https://amzn.to/3eRhgUF), buckets in the
      // `us-east-1` region have a null/empty `LocationConstraint` value
      return region || "us-east-1";
    },
    async _grantNotificationPermissions(bucketName, topicArn) {
      const attributeName = "Policy";
      const attributeValue = JSON.stringify(
        generateBucketSnsPolicy(bucketName, topicArn),
      );
      await this.setTopicAttribute(topicArn, attributeName, attributeValue);
    },
    _getBucketNotifications(bucketName) {
      const params = {
        Bucket: bucketName,
      };
      return this
        ._getS3Client()
        .getBucketNotificationConfiguration(params)
        .promise();
    },
    _setBucketNotifications(bucketName, config) {
      const params = {
        Bucket: bucketName,
        NotificationConfiguration: config,
      };
      return this
        ._getS3Client()
        .putBucketNotificationConfiguration(params)
        .promise();
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
