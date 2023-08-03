import zohoRecruit from "../../zohoRecruit.app.mjs";

export default {
  key: "zoho_recruit-create-record",
  name: "Create Record",
  description: "Creates a new record. [See the documentation](https://www.zoho.com/recruit/developer-guide/apiv2/insert-records.html)",
  version: "0.0.1",
  type: "action",
  props: {
    zohoRecruit,
    module: {
      propDefinition: [
        zohoRecruit,
        "module",
      ],
    },
    fields: {
      propDefinition: [
        zohoRecruit,
        "fields",
        (c) => ({
          module: c.module,
        }),
      ],
    },
  },
  /*async run({ $ }) {
    const data = {
        data: [{
        }],
    };
  },*/
};
