import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-unit-rental-marked-as-overdue-instant",
  name: "Unit Rental Marked as Overdue in Storeganise",
  description: "Emits an event when a unit rental is marked as overdue in Storeganise",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    storeganise,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    unitId: {
      propDefinition: [
        storeganise,
        "unitId",
      ],
    },
    rentalId: {
      propDefinition: [
        storeganise,
        "rentalId",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.storeganise.markRentalOverdue(this.unitId, this.rentalId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-storeganise-signature"] !== this.storeganise.$auth.api_key) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.$emit(body, {
      id: body.id,
      summary: `Unit rental ${body.id} is marked as overdue`,
      ts: Date.now(),
    });
  },
};
