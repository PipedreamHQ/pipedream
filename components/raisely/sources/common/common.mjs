import raisely from "../../raisely.app.mjs";

export default {
  props: {
    raisely,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    campaignId: {
      propDefinition: [
        raisely,
        "campaignId",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = {
        data: {
          events: [
            this.getEvent(),
          ],
          url: this.http.endpoint,
        },
      };
      if (this.campaignId) {
        data.data.campaignUuid = this.campaignId;
      }
      const webhook = await this.raisely.createWebhook({
        data,
      });
      if (webhook?.data && webhook?.data?.uuid) {
        this._setHookId(webhook?.data?.uuid);
      }
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) {
        return;
      }
      await this.raisely.deleteWebhook({
        hookId,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    console.log(event);
  },
};
