import app from "../../recruit_crm.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "recruit_crm-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate. [See the documentation](https://docs.recruitcrm.io/docs/rcrm-api-reference/ba451e2a3bd63-creates-a-new-candidate)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the candidate",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the candidate",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the candidate",
      optional: true,
    },
    contactNumber: {
      label: "Contact Number",
      description: "The contact number of the candidate",
      propDefinition: [
        app,
        "contactId",
        () => ({
          mapper: ({
            contact_number: value, first_name: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    avatar: {
      type: "string",
      label: "Avatar",
      description: "The avatar URL of the candidate",
      optional: true,
    },
    genderId: {
      type: "integer",
      label: "Gender ID",
      description: "Gender ID of the candidate",
      optional: true,
      options: Object.values(constants.GENDER),
    },
    specialization: {
      type: "string",
      label: "Specialization",
      description: "Candidate's Sepcialisation. Example: `Computer Science`",
      optional: true,
    },
  },
  methods: {
    createCandidate(args = {}) {
      return this.app.post({
        path: "/candidates",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      createCandidate,
      ...data
    } = this;

    const response = await createCandidate({
      step,
      data,
    });

    step.export("$summary", `Successfully created candidate with ID \`${response.id}\``);

    return response;
  },
};
