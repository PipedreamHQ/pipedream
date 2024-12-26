import kenjo from "../../kenjo.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "kenjo-updated-leave-request-instant",
  name: "Updated Leave Request (Instant)",
  description: "Emit a new event when an existing leave request is updated (e.g., approved, rejected, or modified). [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kenjo,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    filterEmployeeId: {
      propDefinition: [
        "kenjo",
        "filterEmployeeId",
      ],
      optional: true,
    },
    filterStatus: {
      propDefinition: [
        "kenjo",
        "filterStatus",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const updatedLeaveRequests = await this.kenjo.emitLeaveRequestUpdatedEvent();
      const last50 = updatedLeaveRequests.slice(-50).reverse();
      for (const leaveRequest of last50) {
        if (
          (this.filterEmployeeId && leaveRequest.employee_id !== this.filterEmployeeId) ||
          (this.filterStatus && leaveRequest.status_id !== this.filterStatus)
        ) {
          continue;
        }
        this.$emit(leaveRequest, {
          id: leaveRequest.id || `${leaveRequest.updated_at}`,
          summary: `Leave request ${leaveRequest.id} updated`,
          ts: Date.parse(leaveRequest.updated_at) || Date.now(),
        });
      }
    },
    async activate() {
      const response = await this.kenjo._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "leave_request_updated",
          callback_url: this.http.endpoint,
        },
      });
      const webhookId = response.id;
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.kenjo._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-kenjo-signature"];
    const secret = this.kenjo.$auth.api_key;
    const rawBody = event.rawBody;
    const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
      .digest("hex");
    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const data = event.body;
    if (this.filterEmployeeId && data.employee_id !== this.filterEmployeeId) {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }
    if (this.filterStatus && data.status_id !== this.filterStatus) {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }
    const id = data.id || `${Date.now()}`;
    const summary = `Leave request ${data.id} updated`;
    const ts = Date.parse(data.updated_at) || Date.now();
    this.$emit(data, {
      id,
      summary,
      ts,
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
