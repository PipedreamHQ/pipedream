import surveycto from "../../surveycto.app.mjs";

export default {
  key: "surveycto-new-submission-instant",
  name: "New Submission Instant",
  description: "Emits an event each time a new form submission is received in SurveyCTO",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    surveycto,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    formName: {
      propDefinition: [
        surveycto,
        "formName",
      ],
    },
    submissionId: {
      propDefinition: [
        surveycto,
        "submissionId",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const options = {
        path: `/v2/forms/data/${this.formName}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          url: this.http.endpoint,
          event_types: [
            "submission",
          ],
        },
      };
      const { id } = await this.surveycto._makeRequest(options);
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      const options = {
        path: `/v2/forms/data/${this.formName}/${webhookId}`,
        method: "DELETE",
      };
      await this.surveycto._makeRequest(options);
      this.db.set("webhookId", null);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-surveycto-content-signature"] !== this.surveycto.$auth.api_token) {
      this.http.respond({
        status: 401,
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    if (body && body.data) {
      const { data } = body;
      this.$emit(data, {
        id: data.id,
        summary: `New form submission: ${data.id}`,
        ts: Date.now(),
      });
    }
  },
};
