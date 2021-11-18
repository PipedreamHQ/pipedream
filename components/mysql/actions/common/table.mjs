import mysql from "../../mysql.app.mjs";

export default {
  props: {
    mysql,
    table: {
      propDefinition: [
        mysql,
        "table",
      ],
    },
  },
};
