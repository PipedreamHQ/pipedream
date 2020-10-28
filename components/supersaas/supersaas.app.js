module.exports = {
  type: 'app',
  app: 'supersaas',

  propDefinitions: {
    schedules: {
      type: 'string[]',
      label: 'Schedules',
      description: `The schedules you'd like to watch for changes`,
      async options() {
        return await this.getSchedules();
      },
    },
  },

  methods: {
    async axios(opts) {
      const { axios } = await require('@pipedreamhq/platform');

      return await axios(this, {
        ...opts,

        params: {
          account: this.$auth.account,
          api_key: this.$auth.api_key,

          ...opts.params || {},
        },
      });
    },

    async getSchedules() {
      const xs = await this.axios({ url: 'https://guiprav.pagekite.me/api/schedules.json' });
      return xs.map(x => ({ value: x.id, label: x.name }));
    },
  },
};
