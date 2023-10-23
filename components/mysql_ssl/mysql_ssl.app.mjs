import mysqlApp from "../mysql/mysql.app.mjs";

export default {
  ...mysqlApp,
  app: "mysql_ssl",
  methods: {
    ...mysqlApp.methods,
    getConfig() {
      const {
        host,
        port,
        username,
        password,
        database,
        ca,
        key,
        cert,
        rejectUnauthorized,
      } = this.$auth;
      return {
        host,
        port,
        user: username,
        password,
        database,
        ssl: {
          rejectUnauthorized: rejectUnauthorized === "true",
          ca,
          key,
          cert,
        },
      };
    },
  },
};
