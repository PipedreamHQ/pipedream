import mysqlApp from "../mysql/mysql.app.mjs";

export default {
  ...mysqlApp,
  app: "mysql_ssl",
};
