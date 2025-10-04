import riskadvisor from "../../riskadvisor.app.mjs";
import lodash from "lodash";

export default {
  key: "riskadvisor-update-client",
  name: "Update Client",
  description: "Updates an existing in RiskAdvisor. [See the documentation](https://api.riskadvisor.insure/clients#update-a-client)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    riskadvisor,
    clientId: {
      propDefinition: [
        riskadvisor,
        "clientId",
      ],
    },
    firstName: {
      propDefinition: [
        riskadvisor,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        riskadvisor,
        "lastName",
      ],
      optional: true,
    },
    phoneNumber: {
      propDefinition: [
        riskadvisor,
        "phoneNumber",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        riskadvisor,
        "email",
      ],
      optional: true,
    },
    middleName: {
      propDefinition: [
        riskadvisor,
        "middleName",
      ],
    },
    suffix: {
      propDefinition: [
        riskadvisor,
        "suffix",
      ],
    },
    dateOfBirth: {
      propDefinition: [
        riskadvisor,
        "dateOfBirth",
      ],
    },
    contactPreference: {
      propDefinition: [
        riskadvisor,
        "contactPreference",
      ],
    },
    gender: {
      propDefinition: [
        riskadvisor,
        "gender",
      ],
    },
    education: {
      propDefinition: [
        riskadvisor,
        "education",
      ],
    },
    occupation: {
      propDefinition: [
        riskadvisor,
        "occupation",
      ],
    },
  },
  methods: {
    // getClient endpoint "/api/clients/:id" not yet implemented in the RiskAdvisor API
    // todo: update to use getClient endpoint when implemented
    async getClient(clientId) {
      const clients = this.riskadvisor.paginate({
        resourceFn: this.riskadvisor.listClients,
      });

      for await (const client of clients) {
        if (client.id === clientId) {
          return client;
        }
      }
    },
  },
  async run({ $ }) {
    const client = await this.getClient(this.clientId);

    const response = await this.riskadvisor.updateClient({
      clientId: this.clientId,
      data: lodash.pickBy({
        first_name: this.firstName || client.first_name,
        last_name: this.lastName || client.last_name,
        phone_number: this.phoneNumber || client.phone_number,
        email: this.email || client.email,
        middle_name: this.middleName,
        suffix: this.suffix,
        date_of_birth: this.dateOfBirth,
        contact_preference: this.contactPreference,
        gender: this.gender,
        education: this.education,
        occupation: this.occupation,
      }),
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully updated client with ID ${response.id}.`);
    }

    return response;
  },
};
