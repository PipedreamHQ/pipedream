import crypto from "crypto";
import app from "../../clickup.app.mjs";

export default {
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
    workspaceId: {
      propDefinition: [
        app,
        "workspaces",
      ],
    },
  },
  methods: {
    _getHook() {
      return this.db.get("hook");
    },
    _setHook(hook) {
      this.db.set("hook", hook);
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    checkSignature(httpRequest) {
      console.log("Checking signature");
      const signature = httpRequest.headers["x-signature"];
      if (!signature) {
        throw new Error("The signature is not present");
      }

      const { secret } = this._getHook();
      const hash = crypto.createHmac("sha256", secret).update(httpRequest.bodyRaw);
      const computedSignature = hash.digest("hex");
      console.log(computedSignature, signature, secret);
      if (computedSignature !== signature) {
        throw new Error("The received request is not trustable. The computed signature does not match with the hook signature. The request was aborted.");
      }
      console.log("Signature verified");
    },
    _getMeta() {
      throw new Error("Not implemented");
    },
    _getEventsList() {
      throw new Error("Not implemented");
    },
  },
  hooks: {
    async activate() {
      const res = await this.app.createHook(
        this.workspaceId,
        this.http.endpoint,
        this._getEventsList(),
      );
      this._setHook(res.webhook);
      this._setHookId(res.id);
      console.log(`Created hook with ID ${res.webhook.id}`);
    },
    async deactivate() {
      const id = this._getHookId();
      if (id) {
        await this.app.deleteHook(id);
        console.log(`Deleted hook with ID ${id}`);
      }
    },
  },
};
