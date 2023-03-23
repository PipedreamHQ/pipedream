import exact from "../../exact.app.mjs";

export default {
  key: "exact-new-subscriber-created",
  name: "New Subscriber Created",
  description: "Emit new event each time a new subscriber is created. [See the docs](https://start.exactonline.nl/docs/HlpRestAPIResourcesDetails.aspx?name=WebhooksWebhookSubscriptions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    exact,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  /*  hooks: {
    async activate() {
      const division = await this.exact.getDivision();
      const hook = await this.exact.createWebhook(division, {
        data: {
          CallbackURL: this.http.endpoint,
          Topic: "Subscriptions",
        },
      });
      console.log(hook);
      this._setDivision(division);
      this._setHookId(hook.Content.Key);
    },
    async deactivate() {
      const division = this._getDivision();
      const key = this._getHookId();
      const x = await this.exact.deleteWebhook(division, key);
      console.log(x);
    },
  }, */
  methods: {
    _getDivision() {
      return this.db.get("division");
    },
    _setDivision(division) {
      this.db.set("division", division);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run() {
  /*  const { body } = event;

    this.http.respond({
      status: 200,
    }); */
    const division = await this.exact.getDivision();
    const x = await this.exact.getSubscriptions(division); console.log(x.d.results);
  },
};
