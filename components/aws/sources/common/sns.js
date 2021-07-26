const axios = require("axios");
const aws = require("../../aws.app");

module.exports = {
  props: {
    aws,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
  },
  hooks: {
    async activate() {
      const topicName = this.getTopicName();
      const topicArn = await this._createTopic(topicName);
      this._setTopicArn(topicArn);

      await this._subscribeToTopic(topicArn);
    },
    async deactivate() {
      const subscriptionArn = this._getSubscriptionArn();
      await this._unsubscribeFromTopic(subscriptionArn);

      const topicArn = this.getTopicArn();
      await this._deleteTopic(topicArn);
      this._setTopicArn(null);
    },
  },
  methods: {
    _isSubscriptionConfirmationEvent({ body = {} }) {
      const { Type: type } = body;
      return type === "SubscriptionConfirmation";
    },
    _setTopicArn(topicArn) {
      return this.db.set("topicArn", topicArn);
    },
    _getSubscriptionArn() {
      return this.db.get("subscriptionArn");
    },
    _setSubscriptionArn(subscriptionArn) {
      return this.db.set("subscriptionArn", subscriptionArn);
    },
    _getSnsClient() {
      const region = this.getRegion();
      const AWS = this.aws.sdk(region);
      return new AWS.SNS();
    },
    async _createTopic(topicName) {
      const params = {
        Name: topicName,
      };

      console.log(`Creating SNS topic '${topicName}'`);
      const { TopicArn: topicArn } = await this
        ._getSnsClient()
        .createTopic(params)
        .promise();
      return topicArn;
    },
    async _deleteTopic(topicArn) {
      const params = {
        TopicArn: topicArn,
      };

      console.log(`Deleting SNS topic '${topicArn}'`);
      await this
        ._getSnsClient()
        .deleteTopic(params)
        .promise();
    },
    async _subscribeToTopic(topicArn) {
      const params = {
        TopicArn: topicArn,
        Protocol: "https",
        Endpoint: this.http.endpoint,
      };

      console.log(`
        Subscribing this source's URL (${this.http.endpoint})
        to SNS topic '${topicArn}'
      `);
      await this
        ._getSnsClient()
        .subscribe(params)
        .promise();
    },
    async _confirmSubscription({
      SubscribeURL: callbackUrl,
      TopicArn: topicArn,
    }) {
      console.log(`Confirming subscription to SNS topic '${topicArn}'`);
      const { data } = await axios.get(callbackUrl);
      const subscriptionArn = data
        .ConfirmSubscriptionResponse
        .ConfirmSubscriptionResult
        .SubscriptionArn;

      console.log(`Subscribed to SNS topic '${topicArn}'`);
      return subscriptionArn;
    },
    async _unsubscribeFromTopic(subscriptionArn) {
      const params = {
        SubscriptionArn: subscriptionArn,
      };

      const topicArn = this.getTopicArn();
      console.log(`
        Unsubscribing this source's URL (${this.http.endpoint})
        from SNS topic '${topicArn}'
      `);
      await this
        ._getSnsClient()
        .unsubscribe(params)
        .promise();
    },
    /**
     * This is a utility method that takes a string to be used as the name for
     * an SNS topic and applies the necessary transformations to ensure that the
     * name complies with SNS topic naming requirements.
     *
     * @see {@link https://amzn.to/3fFvdWj Topic name requirements}
     *
     * @param {string} nameCandidate - The original topic name, which might be
     * mutated if it's not fully compliant with SNS topic naming requirements
     * @returns {string} A compliant/valid SNS topic name
     */
    convertNameToValidSNSTopicName(nameCandidate) {
      return nameCandidate
        .slice(0, 256)
        .replace(/[^a-zA-Z0-9_-]+/g, "-");
    },
    /**
     * This method returns the region in which the corresponding event source
     * will create all the AWS resources. By default any event source that
     * extends this module will define a user prop named `region`, and this
     * method will just return that. However, when needed, an event source can
     * extend this method to specify a particular region based on a different
     * criteria (e.g. S3 bucket notifications can only send notifications to SNS
     * topics in the same region as the bucket that generates the notification).
     *
     * @returns {string} The AWS region to which the AWS SDK will connect. This
     * string should be an acceptable value by the AWS SDK, which you can find
     * in the ${@linkcode ./regions.js regions.js} file.
     */
    getRegion() {
      return this.region;
    },
    /**
     * This method returns the ARN of the SNS topic that will receive
     * notifications and call the HTTP endpoint associated to this event source.
     * This method is intended to be final (i.e. not extendable) since the SNS
     * topic is managed by this module and not by any extension of it.
     *
     * @returns {string} The ARN of the SNS topic that will send notifications
     * to the event source
     */
    getTopicArn() {
      return this.db.get("topicArn");
    },
    /**
     * This method returns the name of the SNS topic to create. It must be
     * implemented by any event source that extends this module since the topic
     * name must reference the specific event source that is associated to it.
     *
     * @returns {string} The name of the SNS topic to manage
     */
    getTopicName() {
      throw new Error("getTopicName is not implemented");
    },
    /**
     * This is a wrapper method of the AWS SDK equivalent
     * `SNS.setTopicAttributes` method. It allows a topic owner to set an
     * attribute of the topic to a new value
     *
     * @see {@link https://amzn.to/3weeZtL SDK setTopicAttributes method}
     *
     * @param {String} topicArn - The ARN of the topic to modify
     * @param {String} attributeName - A map of attributes with their
     * corresponding values
     * @param {String} attributeValue - The new value for the attribute
     * @returns {Promise<void>}
     */
    async setTopicAttribute(topicArn, attributeName, attributeValue) {
      const params = {
        TopicArn: topicArn,
        AttributeName: attributeName,
        AttributeValue: attributeValue,
      };
      await this
        ._getSnsClient()
        .setTopicAttributes(params)
        .promise();
    },
    /**
     * This method generates the metadata needed to emit an event using the
     * native `$emit`. It uses the information within the incoming event (e.g.
     * an HTTP call to the event source's endpoint) and produces an object with
     * the necessary ID, summary and timestamp as described in the docs.
     *
     * @see {@link https://pipedream.com/docs/components/api/#emit `this.$emit()`}
     *
     * @param {Object} event - The event object being processed by the event
     * source
     * @returns {Object} A metadata object containing the `id`, `summary` and
     * `ts` fields needed to emit an event
     */
    generateMeta(event) {
      const { "x-amz-sns-message-id": id } = event.headers;
      const {
        Message: message,
        Subject: summary = message,
        Timestamp: ts,
      } = event.body;
      return {
        id,
        summary,
        ts,
      };
    },
    /**
     * This method processes the incoming events that are directly caused by
     * data-driven notifications. In other words, any event that is not related
     * to setup (e.g. handling an SNS subscription confirmation call).
     *
     * The method accepts an event based on an HTTP call made by SNS, extracts
     * its contents and emits it using `this.$emit()`. In most cases, this logic
     * is enough and event sources based on SNS notifications can rely on it.
     *
     * @see
     * {@link https://pipedream.com/docs/components/api/#emit `this.$emit()`}
     *
     * @param {Object} event - The event object received by the event source
     * (e.g. an HTTP event, a timer-based event, etc.).
     * @returns {void}
     */
    processEvent(event) {
      const { body } = event;
      const { Message: rawMessage } = body;
      if (!rawMessage) {
        console.log("No message present, exiting");
        return;
      }

      const meta = this.generateMeta(event);
      try {
        this.$emit(JSON.parse(rawMessage), meta);
      } catch (err) {
        console.log(
          `Couldn't parse message as JSON. Emitting raw message. Error: ${err}`,
        );
        this.$emit({
          rawMessage,
        }, meta);
      }
    },
  },
  /**
   * The main event handler. It is **not recommended** to override this method.
   * In case an event source extending this module has to customise this
   * behaviour it should refine the `processEvent` method instead.
   *
   * @param {Object} event - The event object received by the event source (e.g.
   * an HTTP event, a timer-based event, etc.).
   * @returns {Promise<void>}
   */
  async run(event) {
    if (this._isSubscriptionConfirmationEvent(event)) {
      const { body } = event;
      const subscriptionArn = await this._confirmSubscription(body);
      this._setSubscriptionArn(subscriptionArn);
      return;
    }

    await this.processEvent(event);
  },
};
