import { createHash } from "crypto";
import common from "../common/common.mjs";

function makeStableId(notification) {
  const rawId = notification.resourceData?.id;
  if (rawId) {
    return rawId.length <= 64
      ? rawId
      : `del-${createHash("sha256").update(rawId)
        .digest("hex")
        .slice(0, 16)}`;
  }
  const key = `${notification.subscriptionId ?? ""}:${notification.resource ?? ""}`;
  return `deleted-${createHash("sha256").update(key)
    .digest("hex")
    .slice(0, 16)}`;
}

function notificationTs(notification) {
  const raw =
    notification.resourceData?.lastModifiedDateTime ||
    notification.resourceData?.createdDateTime ||
    notification.subscriptionExpirationDateTime;
  return raw
    ? Date.parse(raw)
    : Date.now();
}

export default {
  ...common,
  key: "microsoft_outlook_calendar-deleted-calendar-event",
  name: "Calendar Event Deleted (Instant)",
  description: "Emit new event when a Microsoft Outlook Calendar event is deleted. Use this trigger to react in real time to calendar event deletions. Emits a payload with the deleted event identifier, change type, subscription ID, tenant ID, and notification timestamp. [See the documentation](https://learn.microsoft.com/en-us/graph/api/resources/changenotification?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "source",
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        changeType: "deleted",
        resource: "/me/events",
      });
    },
    async deactivate() {
      await this.deactivate();
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      return {
        value: [],
      };
    },
    emitEvent(notification) {
      const eventId = notification.resourceData?.id;
      const id = makeStableId(notification);
      const ts = notificationTs(notification);
      this.$emit({
        eventId,
        changeType: notification.changeType,
        subscriptionId: notification.subscriptionId,
        tenantId: notification.tenantId,
        notificationTimestamp: new Date(ts).toISOString(),
      }, {
        id,
        summary: `Calendar event deleted (ID:${eventId ?? id})`,
        ts,
      });
    },
  },
  async run(event) {
    if (event.interval_seconds || event.cron) {
      await this.microsoftOutlook.renewHook({
        hookId: this.db.get("hookId"),
        data: {
          expirationDateTime: this.getIntervalEnd(),
        },
      });
      return;
    }
    if (event.query && event.query.validationToken) {
      this.http.respond({
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
        body: event.query.validationToken,
      });
    } else {
      this.http.respond({
        status: 202,
      });
      const eventBody = JSON.parse(event.bodyRaw);
      for (const notification of eventBody.value) {
        if (!notification.clientState || notification.clientState === this.db.get("clientState")) {
          this.emitEvent(notification);
        }
      }
    }
  },
};
