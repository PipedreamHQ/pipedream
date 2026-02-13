import { v4 as uuid } from "uuid";
import sharepoint from "../../sharepoint.app.mjs";
import { WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS } from "../../common/constants.mjs";

export default {
  key: "sharepoint-updated-file-instant",
  name: "New File Updated (Instant)",
  description:
    "Emit an event when specific files are updated in a SharePoint document library. " +
    "Uses Microsoft Graph webhooks for near real-time notifications.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sharepoint,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    timer: {
      label: "Subscription renewal schedule",
      description:
        "Microsoft Graph subscriptions expire after 30 days. " +
        "This timer automatically renews the subscription. " +
        "**You should not need to modify this schedule.**",
      type: "$.interface.timer",
      static: {
        intervalSeconds: WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
      },
      hidden: true,
    },
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        sharepoint,
        "folderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
      description: "Select a folder to list files from, or leave empty for root.",
    },
    fileIds: {
      propDefinition: [
        sharepoint,
        "fileIds",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
          folderId: c.folderId,
        }),
      ],
      label: "Files to Monitor",
      description:
        "Select files to monitor. " +
        "You'll receive an event whenever any of these files are updated.",
    },
  },
  hooks: {
    async activate() {
      // Generate a unique client state for validating incoming webhooks
      const clientState = uuid();

      // Resolve wrapped prop values
      const driveId = this.sharepoint.resolveWrappedValue(this.driveId);

      // Create subscription on the drive root
      // We'll filter to specific files when notifications arrive
      const subscription = await this.sharepoint.createSubscription({
        resource: `drives/${driveId}/root`,
        notificationUrl: this.http.endpoint,
        changeType: "updated",
        clientState,
      });

      console.log(
        `Created subscription ${subscription.id}, expires: ${subscription.expirationDateTime}`,
      );

      // Store subscription metadata
      this._setSubscription({
        id: subscription.id,
        expirationDateTime: subscription.expirationDateTime,
        clientState,
      });

      // Store the file IDs we're monitoring (unwrap labeled values)
      const fileIds = this.sharepoint.resolveWrappedArrayValues(this.fileIds);
      this._setMonitoredFileIds(fileIds);

      // Initialize delta tracking - get current state so we only see future changes
      const deltaResponse = await this.sharepoint.getDriveDelta({
        driveId,
      });
      // Follow pagination to get the final deltaLink
      let nextLink = deltaResponse["@odata.nextLink"];
      let deltaLink = deltaResponse["@odata.deltaLink"];
      while (nextLink && !deltaLink) {
        const nextResponse = await this.sharepoint.getDriveDelta({
          driveId,
          deltaLink: nextLink,
        });
        nextLink = nextResponse["@odata.nextLink"];
        deltaLink = nextResponse["@odata.deltaLink"];
      }
      this._setDeltaLink(deltaLink);
      console.log("Initialized delta tracking");
    },
    async deactivate() {
      const subscription = this._getSubscription();
      if (subscription?.id) {
        try {
          await this.sharepoint.deleteSubscription({
            subscriptionId: subscription.id,
          });
          console.log(`Deleted subscription ${subscription.id}`);
        } catch (err) {
          console.log(`Error deleting subscription: ${err.message}`);
        }
      }

      // Clear stored state
      this._setSubscription(null);
      this._setMonitoredFileIds(null);
      this._setDeltaLink(null);
    },
  },
  methods: {
    _getSubscription() {
      return this.db.get("subscription");
    },
    _setSubscription(subscription) {
      this.db.set("subscription", subscription);
    },
    _getMonitoredFileIds() {
      return this.db.get("monitoredFileIds") || [];
    },
    _setMonitoredFileIds(fileIds) {
      this.db.set("monitoredFileIds", fileIds);
    },
    _getDeltaLink() {
      return this.db.get("deltaLink");
    },
    _setDeltaLink(deltaLink) {
      this.db.set("deltaLink", deltaLink);
    },
    async renewSubscription() {
      const subscription = this._getSubscription();
      if (!subscription?.id) {
        console.log("No subscription to renew");
        return;
      }

      try {
        const updated = await this.sharepoint.updateSubscription({
          subscriptionId: subscription.id,
        });

        this._setSubscription({
          ...subscription,
          expirationDateTime: updated.expirationDateTime,
        });

        console.log(
          `Renewed subscription ${subscription.id}, new expiry: ${updated.expirationDateTime}`,
        );
      } catch (err) {
        console.log(`Error renewing subscription: ${err.message}`);
        // If renewal fails, try to create a new subscription
        if (err.response?.status === 404) {
          console.log("Subscription not found, creating new one...");
          await this.hooks.activate.call(this);
        }
      }
    },
    generateMeta(file) {
      const ts = Date.parse(file.lastModifiedDateTime);
      return {
        id: `${file.id}-${ts}`,
        summary: `File updated: ${file.name}`,
        ts,
      };
    },
  },
  async run(event) {
    // Handle subscription validation request from Microsoft
    // https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks#notificationurl-validation
    if (event.query?.validationToken) {
      console.log("Responding to validation request");
      this.http.respond({
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
        body: event.query.validationToken,
      });
      return;
    }

    // Handle timer event - renew subscription
    if (event.timestamp) {
      await this.renewSubscription();
      return;
    }

    // Handle webhook notification
    // Respond immediately to acknowledge receipt
    this.http.respond({
      status: 202,
      body: "",
    });

    const { body } = event;

    if (!body?.value?.length) {
      console.log("No notifications in webhook payload");
      return;
    }

    // Validate clientState
    const subscription = this._getSubscription();
    for (const notification of body.value) {
      if (notification.clientState !== subscription?.clientState) {
        console.log(
          `ClientState mismatch: expected ${subscription?.clientState}, got ${notification.clientState}`,
        );
        return;
      }
    }

    // Use delta API to find what actually changed
    const driveId = this.sharepoint.resolveWrappedValue(this.driveId);
    const monitoredFileIds = this._getMonitoredFileIds();
    let deltaLink = this._getDeltaLink();

    console.log("Monitored file IDs:", JSON.stringify(monitoredFileIds));
    console.log("Fetching delta changes...");

    const changedFiles = [];
    let hasMore = true;

    while (hasMore) {
      const deltaResponse = await this.sharepoint.getDriveDelta({
        driveId,
        deltaLink,
      });

      // Find files that changed and are in our monitored list
      for (const item of deltaResponse.value || []) {
        if (item.file && monitoredFileIds.includes(item.id)) {
          changedFiles.push(item);
        }
      }

      // Update for next iteration or final storage
      if (deltaResponse["@odata.nextLink"]) {
        deltaLink = deltaResponse["@odata.nextLink"];
      } else {
        deltaLink = deltaResponse["@odata.deltaLink"];
        hasMore = false;
      }
    }

    // Store the new deltaLink for next time
    this._setDeltaLink(deltaLink);

    console.log(`Found ${changedFiles.length} changed monitored files`);

    // Emit events for each changed file
    for (const file of changedFiles) {
      this.$emit(
        {
          file,
          downloadUrl: file["@microsoft.graph.downloadUrl"],
        },
        this.generateMeta(file),
      );
    }
  },
};
