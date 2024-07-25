import pdffiller from "../../pdffiller.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "pdffiller-new-filled-form-instant",
  name: "New Filled Form Instant",
  description: "Emit new event when a form is filled out. [See the documentation](https://pdffiller.readme.io/reference/post_v2-callbacks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pdffiller,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        pdffiller,
        "formId",
      ],
    },
  },
  methods: {
    _getCallbackId() {
      return this.db.get("callbackId");
    },
    _setCallbackId(id) {
      this.db.set("callbackId", id);
    },
  },
  hooks: {
    async deploy() {
      const filledForms = await this.pdffiller._makeRequest({
        method: "GET",
        path: `/fillable-forms/${this.formId}/filled-forms`,
      });
      for (const filledForm of filledForms) {
        this.$emit(filledForm, {
          id: filledForm.id,
          summary: `New filled form with ID: ${filledForm.id}`,
          ts: Date.parse(filledForm.created),
        });
      }
    },
    async activate() {
      const callbackUrl = this.http.endpoint;
      const callback = await this.pdffiller.createCallback({
        documentId: this.formId,
        eventId: "fill_request.done",
        callbackUrl,
      });
      this._setCallbackId(callback.id);
    },
    async deactivate() {
      const callbackId = this._getCallbackId();
      if (callbackId) {
        await this.pdffiller._makeRequest({
          method: "DELETE",
          path: `/callbacks/${callbackId}`,
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-pdffiller-signature"];
    const computedSignature = crypto.createHmac("sha256", this.pdffiller.$auth.oauth_access_token)
      .update(event.rawBody)
      .digest("base64");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const filledForm = event.body;
    this.$emit(filledForm, {
      id: filledForm.id,
      summary: `New filled form with ID: ${filledForm.id}`,
      ts: Date.parse(filledForm.created),
    });
  },
};
