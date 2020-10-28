const supersaas = require('../supersaas.app.js');

module.exports = {
  key: 'supersaas-changed-users',
  name: 'New or changed users',
  description: `This event source tracks new and changed user events and emits them.`,
  version: '0.0.1',

  props: {
    supersaas,
    db: "$.service.db",
    http: '$.interface.http',
  },

  hooks: {
    async activate() {
      const { $auth } = this.supersaas;
      const { http } = this;

      this.db.set('activeHooks', await this.supersaas.createHooks([{
        event: 'M', // change_appointment
        parent_id: $auth.account,
        target_url: http.endpoint,
      }]));
    },

    async deactivate() {
      await this.supersaas.destroyHooks(this.db.get('activeHooks') || []);
      this.db.set('activeHooks', []);
    },
  },

  async run(ev) {
    // TODO: Authenticate requests? (see GitHub's HMAC signature approach)

    console.log('Emitting:', ev.body);
    this.$emit(ev.body);
  },
};
