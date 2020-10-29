const supersaas = require('../supersaas.app.js');

module.exports = {
  key: 'supersaas-credit-balance-changes',
  name: 'Credit balance changes',
  description: `This event source tracks credit balance change events from the selected schedules and emits them.`,
  version: '0.0.1',

  props: {
    supersaas,
    schedules: { propDefinition: [supersaas, 'schedules'] },
    db: "$.service.db",
    http: '$.interface.http',
  },

  hooks: {
    async activate() {
      const { $auth } = this.supersaas;
      const { http, schedules } = this;

      this.db.set('activeHooks', await this.supersaas.createHooks([
        {
          event: 'M', // modified_user
          parent_id: $auth.account,
          target_url: http.endpoint,
        },

        {
          event: 'P', // purchase
          parent_id: $auth.account,
          target_url: http.endpoint,
        },

        ...schedules.map(x => ({
          event: 'C', // change_appointment
          parent_id: Number(x),
          target_url: http.endpoint,
        })),
      ]));
    },

    async deactivate() {
      await this.supersaas.destroyHooks(this.db.get('activeHooks'));
      this.db.set('activeHooks', []);
    },
  },

  async run(ev) {
    // TODO: Authenticate requests? (see GitHub's HMAC signature approach)

    if (ev.body.event === 'edit' && !ev.body.deleted) {
      console.log('Ignoring:', ev.body.event, '(but ev.body.deleted === false)');
      return;
    }

    console.log('Emitting:', ev.body);
    this.$emit(ev.body);
  },
};
