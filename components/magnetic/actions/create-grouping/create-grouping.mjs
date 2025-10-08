import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-create-grouping",
  name: "Create Opportunity/Job",
  description: "Create a new opportunity/job. [See docs here](https://app.magnetichq.com/Magnetic/API.do#ta-f-grouping)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    magnetic,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new opportunity/job",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new opportunity/job",
      optional: true,
    },
    user: {
      propDefinition: [
        magnetic,
        "user",
      ],
      label: "Owner",
      description: "The user who will be the owner of the opportunity/job",
    },
    contact: {
      propDefinition: [
        magnetic,
        "contact",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        magnetic,
        "company",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      extra: this.description,
      owner: {
        id: this.user,
      },
      contact: this.contact
        ? {
          id: this.contact,
        }
        : undefined,
      contactCompany: this.company
        ? {
          id: this.company,
        }
        : undefined,
    };

    const response = await this.magnetic.createGrouping({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created grouping with ID ${response.id}`);
    }

    return response;
  },
};
