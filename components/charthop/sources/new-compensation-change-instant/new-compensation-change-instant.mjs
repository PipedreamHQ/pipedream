import charthop from "../../charthop.app.mjs";
import crypto from "crypto";

export default {
  key: "charthop-new-compensation-change-instant",
  name: "New Compensation Change (Instant)",
  description: "Emit new event when an employee's compensation details are updated. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    charthop,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    compensationDepartmentFilter: {
      propDefinition: [
        "charthop",
        "compensationDepartmentFilter",
      ],
      optional: true,
    },
    compensationEmployeeIdFilter: {
      propDefinition: [
        "charthop",
        "compensationEmployeeIdFilter",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const params = {
        limit: 50,
        sort: "desc",
      };
      if (this.compensationDepartmentFilter) {
        params.department = this.compensationDepartmentFilter;
      }
      if (this.compensationEmployeeIdFilter) {
        params.employee_id = this.compensationEmployeeIdFilter;
      }
      const events = await this.charthop._makeRequest({
        method: "GET",
        path: "/compensation-updates",
        params,
      });

      const sortedEvents = events.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
      for (const event of sortedEvents) {
        this.$emit(event, {
          id: event.id || event.updated_at,
          summary: `Compensation updated for employee ID ${event.employee_id}`,
          ts: Date.parse(event.updated_at) || Date.now(),
        });
      }
    },
    async activate() {
      const webhookData = {
        event: "compensation_updated",
        callback_url: this.http.endpoint,
        filters: {},
      };
      if (this.compensationDepartmentFilter) {
        webhookData.filters.department = this.compensationDepartmentFilter;
      }
      if (this.compensationEmployeeIdFilter) {
        webhookData.filters.employee_id = this.compensationEmployeeIdFilter;
      }
      const response = await this.charthop._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: webhookData,
      });
      await this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.charthop._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-charthop-signature"];
    const secretKey = this.charthop.$auth.secret_key;
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(event.rawBody)
      .digest("base64");
    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const data = event.body;
    this.$emit(data, {
      id: data.id || data.updated_at,
      summary: `Compensation updated for employee ID ${data.employee_id}`,
      ts: data.updated_at
        ? Date.parse(data.updated_at)
        : Date.now(),
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
