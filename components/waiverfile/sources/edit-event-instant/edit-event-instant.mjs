js;
import waiverfile from "../../waiverfile.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "waiverfile-edit-event-instant",
  name: "Edit Event Instant",
  description: "Emits a new event when an existing event in WaiverFile is edited. [See the documentation](https://api.waiverfile.com/swagger/ui/index)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    waiverfile,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { data } = await this.waiverfile.subscribeEditEvent();
      this.db.set("hookId", data.id);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      await this.waiverfile._makeRequest({
        method: "DELETE",
        path: `/api/v1/deletesubscribe/editevent/${hookId}`,
      });
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    if (headers["content-type"] !== "application/json") {
      return this.http.respond({
        status: 406,
      });
    }
    const {
      secret, hash,
    } = this.waiverfile.$auth;
    if (!secret || !hash || hash !== this.waiverfile.generateHash(body, secret)) {
      return this.http.respond({
        status: 401,
      });
    }
    this.$emit(body, {
      id: body.id,
      summary: `Event ${body.eventName} has been edited`,
      ts: Date.now(),
    });
    this.http.respond({
      status: 200,
    });
  },
};
