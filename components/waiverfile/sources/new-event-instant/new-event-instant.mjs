import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-new-event-instant",
  name: "New Event Instant",
  description: "Emits a new event when a new event is created in waiverfile.",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    waiverfile: {
      type: "app",
      app: "waiverfile",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    apiKey: {
      propDefinition: [
        waiverfile,
        "apiKey",
      ],
    },
    siteID: {
      propDefinition: [
        waiverfile,
        "siteID",
      ],
    },
    targetUrl: {
      propDefinition: [
        waiverfile,
        "targetUrl",
      ],
    },
    eventID: {
      propDefinition: [
        waiverfile,
        "eventID",
      ],
    },
    categoryname: {
      propDefinition: [
        waiverfile,
        "categoryname",
      ],
    },
    description: {
      propDefinition: [
        waiverfile,
        "description",
      ],
    },
    parentid: {
      propDefinition: [
        waiverfile,
        "parentid",
      ],
    },
    startdate: {
      propDefinition: [
        waiverfile,
        "startdate",
      ],
    },
    enddate: {
      propDefinition: [
        waiverfile,
        "enddate",
      ],
    },
    fullname: {
      propDefinition: [
        waiverfile,
        "fullname",
      ],
    },
    eventtitle: {
      propDefinition: [
        waiverfile,
        "eventtitle",
      ],
    },
    eventname: {
      propDefinition: [
        waiverfile,
        "eventname",
      ],
    },
    eventdescription: {
      propDefinition: [
        waiverfile,
        "eventdescription",
      ],
    },
    date: {
      propDefinition: [
        waiverfile,
        "date",
      ],
    },
  },
  hooks: {
    async activate() {
      const response = await this.waiverfile.subscribeNewEvent();
      this.db.set("subscriptionId", response.data.id);
    },
    async deactivate() {
      const subscriptionId = this.db.get("subscriptionId");
      await this.waiverfile.deleteSubscription(subscriptionId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["Content-Type"] !== "application/json") {
      return this.http.respond({
        status: 400,
      });
    }

    this.$emit(body, {
      id: body.id,
      summary: body.name,
      ts: Date.now(),
    });
  },
};
