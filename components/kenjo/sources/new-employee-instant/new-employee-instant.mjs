import kenjo from "../../kenjo.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "kenjo-new-employee-instant",
  name: "New Employee Added",
  description: "Emit a new event when a new employee is added in Kenjo. Useful for syncing employee data with other systems. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kenjo: {
      type: "app",
      app: "kenjo",
    },
    filterDepartment: {
      propDefinition: [
        kenjo,
        "filterDepartment",
      ],
    },
    filterRole: {
      propDefinition: [
        kenjo,
        "filterRole",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const callbackUrl = this.http.endpoint;
      const secret = crypto.randomBytes(32).toString("hex");
      const response = await this.kenjo._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "employee.created",
          callback_url: callbackUrl,
          signature_secret: secret,
        },
      });
      await this.db.set("webhookId", response.id);
      await this.db.set("webhookSecret", secret);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.kenjo._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.set("webhookId", null);
        await this.db.set("webhookSecret", null);
      }
    },
    async deploy() {
      const filters = {};
      if (this.filterDepartment) {
        filters.department_id = this.filterDepartment;
      }
      if (this.filterRole) {
        filters.role_id = this.filterRole;
      }
      const employees = await this.kenjo.paginate(this.kenjo.listEmployees, {
        params: filters,
        paginate: true,
        max: 50,
      });
      for (const employee of employees) {
        this.$emit(employee, {
          id: employee.id.toString(),
          summary: `New employee added: ${employee.name}`,
          ts: Date.parse(employee.created_at) || Date.now(),
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-kenjo-signature"];
    const body = JSON.stringify(event.body);
    const secret = await this.db.get("webhookSecret");
    const computedSignature = crypto.createHmac("sha256", secret).update(body)
      .digest("hex");
    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const employee = event.body;

    if (this.filterDepartment && employee.department_id !== this.filterDepartment) {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }

    if (this.filterRole && employee.role_id !== this.filterRole) {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }

    this.$emit(employee, {
      id: employee.id.toString(),
      summary: `New employee added: ${employee.name}`,
      ts: Date.parse(employee.created_at) || Date.now(),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
