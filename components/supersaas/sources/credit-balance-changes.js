const supersaas = require('../supersaas.app.js');

// Changed user: Manual credit change and starting credit.

module.exports = {
  key: 'supersaas-credit-balance-updates',
  name: 'Credit balance updates',
  description: `This event source tracks credit balance update events from the selected schedules and emits them.`,
  version: '0.0.1',

  props: {
    supersaas,
    schedules: { propDefinition: [supersaas, 'schedules'] },
    http: '$.interface.http',
  },

  hooks: {
    async activate() {
      const { schedules } = this;

      console.log('huhhh:', {
        schedules,
        endpoint: this.http.endpoint,
        axios: this.supersaas.axios, // ???
      });

      // Create webhooks?
    },

    async deactivate() {
      const { schedules } = this;
      console.log('deactivate:', { schedules });

      // Destroy webhooks?
    },
  },

  async run() {
    this.$emit({ message: 'hello, world!' });
  },
};
