import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-new-inquiry-instant",
  name: "New Inquiry Instant",
  description: "Emits an event when a new inquiry is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cinc,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    inquiryIdentifier: {
      propDefinition: [
        cinc,
        "inquiryIdentifier",
      ],
    },
  },
  hooks: {
    async activate() {
      console.log("Activating new inquiry listener");
    },
    async deactivate() {
      console.log("Deactivating new inquiry listener");
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (body && headers) {
      // check if the body has the inquiryIdentifier
      if (body.hasOwnProperty(this.inquiryIdentifier)) {
        const inquiryId = body[this.inquiryIdentifier];
        // emit the inquiry event
        await this.cinc.emitInquiryEvent(inquiryId);
        this.http.respond({
          status: 200,
        });
      } else {
        this.http.respond({
          status: 400,
          body: "Missing required inquiry identifier",
        });
      }
    } else {
      this.http.respond({
        status: 400,
        body: "Invalid request",
      });
    }
  },
};
