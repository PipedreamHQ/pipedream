import paigo from "../../paigo.app.mjs";

export default {
  key: "paigo-new-customer-instant",
  name: "New Customer Instant",
  description: "Emit new event when customer account is created. [See the documentation](http://www.api.docs.paigo.tech/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    paigo: {
      type: "app",
      app: "paigo",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    accountDetails: {
      propDefinition: [
        paigo,
        "accountDetails",
      ],
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New customer created with ID: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.paigo.createCustomer(this.accountDetails);
      this.db.set("customerId", data.id);
    },
    async deactivate() {
      const id = this.db.get("customerId");
      await this.paigo.deleteWebhook(id);
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;

    if (headers["content-type"] !== "application/json") {
      return this.http.respond({
        status: 400,
        body: "Expected application/json",
      });
    }

    if (body.id !== this.db.get("customerId")) {
      return this.http.respond({
        status: 404,
        body: "Not Found",
      });
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);

    this.http.respond({
      status: 200,
    });
  },
};
