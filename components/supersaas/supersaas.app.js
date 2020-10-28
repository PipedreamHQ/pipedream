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
    async axios(path, opts = {}) {
      const { axios } = await require('@pipedreamhq/platform');

      return await axios(this, {
        url: `https://guiprav.pagekite.me${path}`,

        ...opts,

        params: {
          account: this.$auth.account,
          api_key: this.$auth.api_key,

          ...opts.params || {},
        },
      });
    },

    async getSchedules() {
      const xs = await this.axios('/api/schedules.json');
      return xs.map(x => ({ value: x.id, label: x.name }));
    },

    async createHooks(hookParams) {
      const { axios } = this;

      console.log('Creating hooks:', hookParams);

      return await Promise.all(hookParams.map(
        x => axios('/api/hooks', { method: 'POST', params: x }),
      ));
    },

    async destroyHooks(activeHooks) {
      const { axios } = this;

      console.log('Destroying hooks:', activeHooks);

      return await Promise.all(activeHooks.map(x => axios('/api/hooks', {
        method: 'DELETE',
        params: { id: x.id, parent_id: x.parent_id },
      })));
    },
  },
};
