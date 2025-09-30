import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-create-requisition-link",
  name: "Create Requisition Link",
  description: "Create a requisition link and id to be used in other Nordigen actions. [See the docs](https://nordigen.com/en/account_information_documenation/integration/quickstart_guide/)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nordigen,
    countryCode: {
      propDefinition: [
        nordigen,
        "countryCode",
      ],
    },
    institutionId: {
      propDefinition: [
        nordigen,
        "institutionId",
        (({ countryCode }) => ({
          countryCode,
        })),
      ],
    },
    accessValidForDays: {
      propDefinition: [
        nordigen,
        "accessValidForDays",
      ],
    },
    maxHistoricalDays: {
      propDefinition: [
        nordigen,
        "maxHistoricalDays",
      ],
    },
    accessScope: {
      propDefinition: [
        nordigen,
        "accessScope",
      ],
    },
  },
  async run({ $ }) {
    const requisition = await this.nordigen.createRequisitionLink({
      institutionId: this.institutionId,
      maxHistoricalDays: this.maxHistoricalDays,
      accessValidForDays: this.accessValidForDays,
      accessScope: this.accessScope,
    });

    $.export("$summary", `Successfully createed requisition link with ID ${requisition.id}.`);

    return requisition;
  },
};
