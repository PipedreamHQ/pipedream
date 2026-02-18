import { randomUUID } from "crypto";
import sharepoint from "../../sharepoint.app.mjs";
import { WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS } from "../../common/constants.mjs";

export default {
  key: "sharepoint-updated-file-instant",
  name: "New File Updated (Instant)",
  description:
    "Emit an event when specific files are updated in a SharePoint document library. " +
    "Uses Microsoft Graph webhooks for near real-time notifications.\n\n" +
    "**How it works:**\n" +
    "1. Select specific files to monitor\n" +
    "2. Receive instant notifications when those files are modified\n" +
    "3. Get file metadata and download URLs with each event\n\n" +
    "**Example Use Cases:**\n" +
    "- Trigger workflows when documents are updated\n" +
    "- Sync file changes to other systems\n" +
    "- Notify teams when important files are modified\n" +
    "- Create audit trails of document updates\n\n" +
    "**Note:** This source monitors only the files you select. It will NOT emit events for other files in the drive. " +
    "The subscription automatically renews every 27 days to maintain continuous monitoring.",
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
          siteId: c.siteId?.value || c.siteId,
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
      description: "Optional: Select a folder to browse files from. Leave empty to browse from the drive root. " +
        "This helps you navigate to the files you want to monitor.",
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
        "Select one or more files to monitor for updates. " +
        "You'll receive a real-time event whenever any of these files are modified.\n\n" +
        "**Important:** Only the selected files will trigger events. Changes to other files in the drive will be ignored. " +
        "This ensures you only receive notifications for the documents you care about.",
    },
  },
  hooks: {
    async activate() {
      // Generate a unique client state for validating incoming webhooks
      const clientState = randomUUID();

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
        return {
          success: true,
          skipped: true,
        };
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
          `Renewed subscription ${subscription.id}, expires: ${updated.expirationDateTime}`,
        );
        return {
          success: true,
        };
      } catch (error) {
        const status = error.response?.status;

        // Subscription not found - needs recreation
        if (status === 404) {
          console.log("Subscription not found, will recreate...");
          return {
            success: false,
            shouldRecreate: true,
          };
        }

        // Auth errors - don't retry
        if ([
          401,
          403,
        ].includes(status)) {
          console.error(`Auth error renewing subscription: ${error.message}`);
          return {
            success: false,
            shouldRecreate: false,
          };
        }

        // Other errors - log but don't recreate (will retry on next timer tick)
        console.error(`Error renewing subscription: ${error.message}`);
        return {
          success: false,
          shouldRecreate: false,
        };
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
      const result = await this.renewSubscription();

      if (!result.success && result.shouldRecreate) {
        console.log("Recreating subscription...");
        await this.hooks.activate.call(this);
      }
      return;
    }

    // Handle webhook notification
    const { body } = event;

    if (!body?.value?.length) {
      console.log("No notifications in webhook payload");
      this.http.respond({
        status: 202,
        body: "",
      });
      return;
    }

    // Filter to only valid notifications for this subscription
    const subscription = this._getSubscription();
    const clientState = subscription?.clientState;

    const validNotifications = body.value.filter((notification) => {
      if (notification.clientState !== clientState) {
        console.warn(
          `Ignoring notification with unexpected clientState: ${notification.clientState}`,
        );
        return false;
      }
      return true;
    });

    if (validNotifications.length === 0) {
      console.log("No valid notifications after clientState filtering");
      this.http.respond({
        status: 202,
        body: "",
      });
      return;
    }

    // Acknowledge receipt after validation
    this.http.respond({
      status: 202,
      body: "",
    });

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
      // Delta response may not include downloadUrl - fetch fresh if needed
      let downloadUrl = file["@microsoft.graph.downloadUrl"];
      if (!downloadUrl) {
        try {
          const freshFile = await this.sharepoint.getDriveItem({
            driveId,
            fileId: file.id,
          });
          downloadUrl = freshFile["@microsoft.graph.downloadUrl"];
        } catch (err) {
          console.log(`Could not fetch download URL for ${file.name}: ${err.message}`);
        }
      }

      this.$emit(
        {
          file,
          downloadUrl,
        },
        this.generateMeta(file),
      );
    }
  },
};
