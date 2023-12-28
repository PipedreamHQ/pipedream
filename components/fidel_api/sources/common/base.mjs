import { secureCompare } from "../../common/utils.mjs";
import fidelApi from "../../fidel_api.app.mjs";

export default {
  props: {
    fidelApi,
    http: "$.interface.http",
    db: "$.service.db",
    programId: {
      propDefinition: [
        fidelApi,
        "programId",
      ],
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookSecret(secret) {
      this.db.set("secret", secret);
    },
    _getHookSecret() {
      return this.db.get("secret");
    },
  },
  hooks: {
    async activate() {
      const { items } = await this.fidelApi.createHook({
        programId: this.programId,
        data: {
          event: this.getEvent(),
          url: this.http.endpoint,
        },
      });

      this._setHookSecret(items[0]?.secretKey);
      this._setHookId(items[0]?.id);
    },
    async deactivate() {
      await this.fidelApi.deleteHook(this._getHookId());
    },
  },
  async run(event) {
    const secret = this._getHookSecret();
    const {
      headers,
      body,
    } = event;

    if (!secureCompare(headers, body, secret, this.http.endpoint)) {
      return false;
    }

    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: Date.parse(body.created),
    });
  },
};
