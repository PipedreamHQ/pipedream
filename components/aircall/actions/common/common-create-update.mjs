import aircall from "../../aircall.app.mjs";

export default {
  props: {
    aircall,
    firstName: {
      propDefinition: [
        aircall,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        aircall,
        "lastName",
      ],
    },
    companyName: {
      propDefinition: [
        aircall,
        "companyName",
      ],
    },
    information: {
      propDefinition: [
        aircall,
        "information",
      ],
    },
  },
  methods: {
    getCommonData() {
      return {
        first_name: this.firstName,
        last_name: this.lastName,
        company_name: this.companyName,
        information: this.information,
      };
    },
  },
};
