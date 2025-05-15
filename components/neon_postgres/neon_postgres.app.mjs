import postgresql from "@pipedream/postgresql";

export default {
  type: "app",
  app: "neon_postgres",
  propDefinitions: {
    ...postgresql.propDefinitions,
  },
  methods: {
    ...postgresql.methods,
    getClientConfiguration() {
      const {
        host,
        port,
        user,
        password,
        database,
      } = this.$auth;

      return {
        host,
        port,
        user,
        password,
        database,
        ssl: this._getSslConfig(),
      };
    },
  },
};
