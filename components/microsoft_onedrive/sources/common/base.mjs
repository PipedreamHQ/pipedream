import onedrive from "../../microsoft_onedrive.app.mjs";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 100, // 10 requests per second
  maxConcurrent: 1,
});

// Defaulting to 15 days. The maximum allowed expiration time is 30 days,
// according to their API response message: "Subscription expiration can only
// be 43200 minutes in the future".
//
// More information can be found in the official API docs:
// https://docs.microsoft.com/en-us/onedrive/developer/rest-api/concepts/using-webhooks?view=odsp-graph-online#expiration
const WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS = 43200 * 60 / 2;

const props = {
  onedrive,
  db: "$.service.db",
  http: {
    type: "$.interface.http",
    customResponse: true,
  },
  timer: {
    type: "$.interface.timer",
    //  The OneDrive API requires occasional renewal of webhook notification subscriptions.
    //  **This runs in the background, so the user should not need to modify this schedule**.
    default: {
      intervalSeconds: WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
    },
    hidden: true,
  },
};

const hooks = {
  async deploy() {
    const deltaLink = this.onedrive.getDeltaLink();
    const itemsStream = this.onedrive.scanDeltaItems(deltaLink);

    // We skip the first drive item, since it represents the root directory
    await itemsStream.next();

    let done, value, eventsToProcess = 10;
    while (true) {
      ({
        done, value,
      } = await limiter.schedule(() => itemsStream.next()));
      if (value && !this.isItemTypeRelevant(value)) {
        // If the type of the item being processed is not relevant to the
        // event source we want to skip it in order to avoid confusion in
        // terms of the actual payload of the sample events
        continue;
      }

      if (done) break;

      await this.processEvent(value);
      if (--eventsToProcess <= 0) {
        break;
      }
    }
  },
  async activate() {
    await this._createNewSubscription();
    const deltaLinkParams = this.getDeltaLinkParams();
    const deltaLink = await this.onedrive.getLatestDeltaLink(deltaLinkParams);
    this._setDeltaLink(deltaLink);
    this._setLastCreatedTimestamp();
  },
  async deactivate() {
    await this._deactivateSubscription();
  },
};

const methods = {
  _getLastCreatedTimestamp() {
    return this.db.get("lastCreatedTimestamp") || 0;
  },
  _setLastCreatedTimestamp(lastCreatedTimestamp = Date.now()) {
    this.db.set("lastCreatedTimestamp", lastCreatedTimestamp);
  },
  _getNextExpirationDateTime() {
    const nowTimestamp = Date.now();
    const expirationTimestampDelta = 2 * WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS * 1000;
    return new Date(nowTimestamp + expirationTimestampDelta);
  },
  async _createNewSubscription() {
    const hookOpts = {
      expirationDateTime: this._getNextExpirationDateTime(),
    };
    const hookId = await this.onedrive.createHook(this.http.endpoint, hookOpts);
    this._setHookId(hookId);
  },
  _renewSubscription() {
    const hookOpts = {
      expirationDateTime: this._getNextExpirationDateTime(),
    };
    const hookId = this._getHookId();
    return this.onedrive.updateHook(hookId, hookOpts);
  },
  async _deactivateSubscription() {
    const hookId = this._getHookId();
    await this.onedrive.deleteHook(hookId);
    this._setHookId(null);
  },
  _getHookId() {
    return this.db.get("hookId");
  },
  _setHookId(hookId) {
    this.db.set("hookId", hookId);
  },
  _getDeltaLink() {
    return this.db.get("deltaLink");
  },
  _setDeltaLink(deltaLink) {
    this.db.set("deltaLink", deltaLink);
  },
  _getSequentialErrorsCount() {
    return this.db.get("errorsCount") || 0;
  },
  _setSequentialErrorsCount(count) {
    this.db.set("errorsCount", count);
  },
  _validateSubscription(validationToken) {
    // See the docs for more information on how webhooks are validated upon
    // creation: https://bit.ly/3fzc3Tr
    this.http.respond({
      // OK
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
      body: validationToken,
    });
  },
  async _processEventsFromDeltaLink(deltaLink) {
    const itemsStream = this.onedrive.scanDeltaItems(deltaLink);

    while (true) {
      // We iterate through the `itemsStream` generator using explicit calls to
      // `next()` since the last/returned value is also useful because it
      // contains the latest Delta Link (using a `for...of` loop will discard
      // such value).
      let done, value;
      try {
        ({
          done, value,
        } = await limiter.schedule(() => itemsStream.next()));
      } catch (e) {
        // Users have come upon an error with deltaLink, so we need to reset it by
        // creating a new subscription.
        console.error(e);
        const errors = this._getSequentialErrorsCount();
        if (errors > 3) {
          console.log("need to renew webhook subscription");
          return this._renewSubscription();
        }
        this._setSequentialErrorsCount(errors + 1);
      }

      if (done) {
        // No more items to retrieve from OneDrive. We update the cached Delta
        // Link and move on.
        this._setDeltaLink(value);
        break;
      }

      const shouldSkipItem = (
        !value ||
        !this.isItemTypeRelevant(value) ||
        !this.isItemRelevant(value)
      );
      if (shouldSkipItem) {
        // If the retrieved item is not relevant to the event source, we skip it
        continue;
      }

      const createdDateTime = new Date(value.createdDateTime);
      if (createdDateTime >= this._getLastCreatedTimestamp()) {
        await this.processEvent(value);
      }
    }
    this._setSequentialErrorsCount(0);
    await this.postProcessEvent();
  },
  /**
   * The purpose of this method is for the different OneDrive event sources to
   * parameterize the OneDrive Delta Link to use. These parameters will be
   * forwarded to the `onedrive.getLatestDeltaLink` method.
   *
   * @returns an object containing options/parameters to use when querying the
   * OneDrive API for a Delta Link
   */
  getDeltaLinkParams() {
    return {};
  },
  /**
   * This method determines whether an item that's about to be processed is
   * relevant to the event source or not. This is helpful when the event
   * source has to go through a collection of items, some of which should be
   * skipped/ignored.
   *
   * @param {Object}  driveItem the item under evaluation
   * @returns a boolean value that indicates whether the item should be
   * processed or not
   */
  isItemRelevant() {
    return true;
  },
  /**
   * This method determines whether the type of the item (e.g. a file, folder,
   * video, etc.) that's about to be processed is relevant to the event source
   * or not. This is helpful when the event source has to go through a
   * collection of items, some of which should be skipped/ignored.
   *
   * @param {Object}  driveItem the item under evaluation
   * @returns a boolean value that indicates whether the item should be
   * processed or not
   */
  isItemTypeRelevant() {
    return true;
  },
  /**
   * This method generates the metadata that accompanies an event being
   * emitted by the event source, as outlined [in the
   * docs](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#emit)
   *
   * @param {Object}  data the event data to consider in order to build the
   * metadata object
   * @returns an event metadata object containing, as described in the docs
   */
  generateMeta(driveItem) {
    const {
      id,
      createdDateTime,
      name,
    } = driveItem;
    const summaryPrefix = driveItem.folder
      ? "New Folder: "
      : "New File: ";
    const summary = summaryPrefix + name;
    const ts = Date.parse(createdDateTime);
    return {
      id,
      summary,
      ts,
    };
  },
  /**
   * This method emits an event which payload is set to the provided [OneDrive
   * item](https://bit.ly/39T7mQz). The functionality provided by this method
   * is very basic and complex event sources probably need to override it.
   *
   * @param {Object}  driveItem a OneDrive item object
   */
  processEvent(driveItem) {
    const meta = this.generateMeta(driveItem);
    this.$emit(driveItem, meta);
  },
  /**
   * This method is executed after processing all the items/events in a
   * particular execution. A normal use case for it is to store/cache some
   * final value that should be picked up by the next execution (e.g. an event
   * timestamp, the ID of the last processed item, etc.).
   */
  postProcessEvent() {},
};

async function run(event) {
  // The very first HTTP call that the event source receives is from the
  // OneDrive API to verify the webhook subscription. The response for such
  // call should be as fast as possible in order for the subscription to be
  // confirmed and activated.
  const { query: { validationToken } = {} } = event;
  if (validationToken) {
    this._validateSubscription(validationToken);
    console.log(`
      Received an HTTP call containing 'validationToken'.
      Validating webhook subscription and exiting...
    `);
    return;
  }

  if (event.interval_seconds || event.cron) {
    // Component was invoked by timer. When that happens, it means that it's
    // time to renew the webhook subscription, not that there are changes in
    // OneDrive to process.
    return this._renewSubscription();
  }

  // Every HTTP call made by a OneDrive webhook expects a '200 Accepted`
  // response, and it should be done as soon as possible.
  this.http.respond({
    status: 200,
  });

  // Using the last known Delta Link, we retrieve and process the items that
  // changed after such Delta Link was obtained
  const deltaLink = this._getDeltaLink();
  await this._processEventsFromDeltaLink(deltaLink);
}

export default {
  props,
  hooks,
  methods,
  run,
};
