import charthop from "../../charthop.app.mjs";
import crypto from "crypto";

export default {
  key: "charthop-new-employee-instant",
  name: "New Employee Added",
  description: "Emit new event when a new employee is added to the organization. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    charthop,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    newEmployeeDepartmentFilter: {
      propDefinition: [
        charthop,
        "newEmployeeDepartmentFilter",
      ],
    },
    newEmployeeRoleFilter: {
      propDefinition: [
        charthop,
        "newEmployeeRoleFilter",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const data = {
        webhook_url: webhookUrl,
      };
      if (this.newEmployeeDepartmentFilter) {
        data.department = this.newEmployeeDepartmentFilter;
      }
      if (this.newEmployeeRoleFilter) {
        data.role = this.newEmployeeRoleFilter;
      }
      const response = await this.charthop.emitNewEmployeeAddedEvent(data);
      if (response.id) {
        await this.db.set("webhookId", response.id);
      }
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.charthop._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.set("webhookId", null);
      }
    },
    async deploy() {
      const filters = {};
      if (this.newEmployeeDepartmentFilter) {
        filters.department = this.newEmployeeDepartmentFilter;
      }
      if (this.newEmployeeRoleFilter) {
        filters.role = this.newEmployeeRoleFilter;
      }
      const events = await this.charthop._makeRequest({
        method: "GET",
        path: "/events/new_employee_added",
        params: {
          limit: 50,
          ...filters,
        },
      });
      for (const event of events.reverse()) {
        this.$emit(event, {
          id: event.id || event.created_at,
          summary: `New employee added: ${event.name}`,
          ts: Date.parse(event.created_at) || Date.now(),
        });
      }
    },
  },
  async run(event) {
    const receivedSignature = event.headers["x-charthop-signature"];
    const secret = this.charthop.$auth.api_token;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(event.body)
      .digest("hex");
    if (computedSignature !== receivedSignature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const data = JSON.parse(event.body);
    if (
      this.newEmployeeDepartmentFilter &&
      data.department !== this.newEmployeeDepartmentFilter
    ) {
      return;
    }
    if (
      this.newEmployeeRoleFilter &&
      data.role !== this.newEmployeeRoleFilter
    ) {
      return;
    }

    this.$emit(data, {
      id: data.id || data.created_at,
      summary: `New employee added: ${data.name}`,
      ts: Date.parse(data.created_at) || Date.now(),
    });
  },
};
