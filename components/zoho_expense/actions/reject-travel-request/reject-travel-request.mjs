import app from "../../zoho_expense.app.mjs";

export default {
  key: "zoho_expense-reject-travel-request",
  name: "Reject Travel Request",
  description: "Disapprove a pending travel request in the system. [See the Documentation](https://www.zoho.com/expense/api/v1/trips/#reject-a-trip-request).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    tripId: {
      propDefinition: [
        app,
        "tripId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
  methods: {
    rejectTripRequest({
      tripId, ...args
    } = {}) {
      return this.app.post({
        path: `/trips/${tripId}/reject`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      organizationId,
      tripId,
    } = this;

    const response = await this.rejectTripRequest({
      step,
      tripId,
      headers: {
        organizationId,
      },
    });

    step.export("$summary", `Successfully rejected trip with ID ${tripId}`);

    return response;
  },
};
