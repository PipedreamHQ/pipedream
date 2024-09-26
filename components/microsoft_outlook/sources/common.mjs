import microsoftOutlook from "../microsoft_outlook.app.mjs";

const getRenewalInterval = (period) => {
  let day = 24 * 60 * 60;
  return period ?
    day * 2.5 * 1000 :// Subscription expiration can only be 4230 minutes in the future.
    day * 2;
};

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
      description: "Graph API expires Outlook notifications in 3 days, we auto-renew them in 2 days, [see](https://docs.microsoft.com/en-us/graph/api/resources/subscription?view=graph-rest-1.0#maximum-length-of-subscription-per-resource-type)",
      default: {
        intervalSeconds: getRenewalInterval(),
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
      return new Date(Date.now() + getRenewalInterval(true));
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
      await this.microsoftOutlook.deleteHook({
        hookId,
      });
    },
    async run({
      event,
      emitFn,
    } = {}) {
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
