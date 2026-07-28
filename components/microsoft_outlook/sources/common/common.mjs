import microsoftOutlook from "../../microsoft_outlook.app.mjs";

const DAY_SECONDS = 24 * 60 * 60;
// Renew daily while requesting a 2.5-day expiry. Graph's max subscription length
// varies by account type (lower for consumer mailboxes), so we stay at the
// 2.5 days rather than push toward the cap. Two renewals land before
// a subscription would lapse, so a single transient failure recovers on the next
// tick. If a renewal still 404s because Graph already deleted the subscription,
// run() re-creates it.
const RENEWAL_INTERVAL_SECONDS = DAY_SECONDS;
const EXPIRATION_MS = DAY_SECONDS * 2.5 * 1000;

export default {
  props: {
    microsoftOutlook,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Webhook renewal timer",
      description: "Graph API expires Outlook notifications in ~3 days; we request a 2.5-day expiration and auto-renew daily, [See the documentation](https://docs.microsoft.com/en-us/graph/api/resources/subscription?view=graph-rest-1.0#maximum-length-of-subscription-per-resource-type)",
      default: {
        intervalSeconds: RENEWAL_INTERVAL_SECONDS,
      },
    },
  },
  hooks: {
    async deploy() {
      const { value: events } = await this.getSampleEvents({
        pageSize: 25,
      });
      if (!events || events.length == 0) {
        return;
      }
      for (const item of events) {
        this.emitEvent(item);
      }
    },
  },
  methods: {
    getIntervalEnd() {
      return new Date(Date.now() + EXPIRATION_MS);
    },
    randomString() {
      return `${Math.random().toString(36)
        .substring(2, 15)}${Math.random().toString(36)
        .substring(2, 15)}`;
    },
    async activate({
      resource,
      changeType,
    } = {}) {
      const clientState = this.randomString();
      const response = await this.microsoftOutlook.createHook({
        data: {
          notificationUrl: this.http.endpoint,
          changeType,
          resource,
          expirationDateTime: this.getIntervalEnd(),
          clientState: clientState,
        },
      });
      if (clientState == response.clientState) {
        this.db.set("hookId", response.id);
        this.db.set("clientState", clientState);
      }
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      if (!hookId) return;
      await this.microsoftOutlook.deleteHook({
        hookId,
      });
    },
    async run({
      event,
      emitFn,
    } = {}) {
      if (event.interval_seconds || event.cron) {
        try {
          await this.microsoftOutlook.renewHook({
            hookId: this.db.get("hookId"),
            data: {
              expirationDateTime: this.getIntervalEnd(),
            },
          });
        } catch (error) {
          // Graph returns 404 ResourceNotFound ("The object was not found.") when the
          // subscription no longer exists on its side, e.g. it lapsed after a transient
          // renewal failure and Graph deleted it. Re-create it so the trigger self-heals
          // instead of retrying a doomed renewal forever. Re-throw anything else so real
          // failures still surface.
          if (error?.statusCode === 404 || error?.code === "ResourceNotFound") {
            await this.activate(this.getSubscriptionConfig());
          } else {
            throw error;
          }
        }
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
        for (let i = 0; i < eventBody.value.length; i++) {
          const notification = eventBody.value[i];
          if (!notification.clientState || notification.clientState == this.db.get("clientState")) {
            const resourceId = notification.resourceData.id;
            await emitFn({
              resourceId,
            });
          }
        }
      }
    },
  },
};
