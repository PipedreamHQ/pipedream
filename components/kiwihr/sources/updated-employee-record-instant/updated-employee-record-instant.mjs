import kiwihr from "../../kiwihr.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "kiwihr-updated-employee-record-instant",
  name: "KiwiHR Updated Employee Record Instant",
  description: "Emit new event when an employee record is updated in KiwiHR. [See the documentation](https://api.kiwihr.it/api/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kiwihr,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    employeeId: {
      propDefinition: [
        kiwihr,
        "employeeId",
      ],
    },
    department: {
      propDefinition: [
        kiwihr,
        "department",
      ],
    },
    jobTitle: {
      propDefinition: [
        kiwihr,
        "jobTitle",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const employees = await this.kiwihr.getEmployees({
        params: {
          limit: 50,
          order: "desc",
        },
      });
      for (const employee of employees.items) {
        this.$emit(employee, {
          id: employee.id,
          summary: `Employee Updated: ${employee.firstName} ${employee.lastName}`,
          ts: Date.parse(employee.updatedAt),
        });
      }
    },
    async activate() {
      const hookResponse = await axios(this, {
        method: "POST",
        url: `${this.kiwihr._baseUrl()}/webhooks`,
        headers: {
          "X-Api-Key": this.kiwihr.$auth.api_key,
        },
        data: {
          targetUrl: this.http.endpoint,
          eventTypes: [
            "employee.updated",
          ],
        },
      });
      this._setWebhookId(hookResponse.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.kiwihr._baseUrl()}/webhooks/${webhookId}`,
          headers: {
            "X-Api-Key": this.kiwihr.$auth.api_key,
          },
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-signature"];
    const computedSignature = crypto
      .createHmac("sha256", this.kiwihr.$auth.api_key)
      .update(event.body)
      .digest("base64");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const {
      employeeId, jobTitle, department,
    } = event.body;

    if (employeeId !== this.employeeId) return;
    if (this.jobTitle && jobTitle !== this.jobTitle) return;
    if (this.department && department !== this.department) return;

    this.$emit(event.body, {
      id: event.body.id,
      summary: `Updated Employee: ${event.body.firstName} ${event.body.lastName}`,
      ts: Date.parse(event.body.updatedAt),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
