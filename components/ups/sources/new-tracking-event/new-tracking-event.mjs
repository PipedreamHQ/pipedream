import ups from "../../ups.app.mjs";

export default {
  key: "ups-new-tracking-event",
  name: "New Tracking Event (Instant)",
  description: "Emit new event when new tracking activity is detected. [See the documentation](https://developer.ups.com/tag/UPS-Track-Alert?loc=en_US#operation/processSubscriptionTypeForTrackingNumber)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ups,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    trackingNumbers: {
      type: "string[]",
      label: "Tracking Numbers",
      description: "The tracking numbers of the shipments to track",
    },
  },
  hooks: {
    async activate() {
      const response = await this.ups.createSubscription({
        data: {
          locale: "en_US",
          trackingNumberList: this.trackingNumbers,
          destination: {
            url: this.http.endpoint,
            credentialType: "N/A",
            credential: "N/A",
          },
        },
      });

      if (response?.validTrackingNumbers?.length) {
        console.log(`Valid tracking numbers: ${response.validTrackingNumbers.join(", ")}`);
      } else {
        console.log("No valid tracking numbers");
      }

      if (response?.invalidTrackingNumbers?.length) {
        console.log(`Invalid tracking numbers: ${response.invalidTrackingNumbers.join(", ")}`);
      }
    },
  },
  methods: {
    generateMeta(event) {
      return {
        id: `${event.trackingNumber}${event.gmtActivityDate}${event.gmtActivityTime}`,
        summary: `New tracking event for ${event.trackingNumber}`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    this.http.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
