import fynk from "../../fynk.app.mjs";

export default {
  key: "fynk-update-contract-party",
  name: "Update Contract Party",
  description: "Update the details of a party associated with a contract in Fynk. See [documentation](https://app.fynk.com/v1/docs#/operations/v1.documents.parties.update).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fynk,
    documentUuid: {
      propDefinition: [
        fynk,
        "documentUuid",
      ],
    },
    partyUuid: {
      propDefinition: [
        fynk,
        "partyUuid",
        (c) => ({
          documentUuid: c.documentUuid,
        }),
      ],
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "A generic reference for the party",
      optional: true,
    },
    entityType: {
      propDefinition: [
        fynk,
        "entityType",
      ],
    },
    entityName: {
      type: "string",
      label: "Entity Name",
      description: "The actual name of the party (i.e., name of the company or person). Must be non-null in order for the document to proceed to the signing stage",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The party's address",
      optional: true,
    },
    scope: {
      propDefinition: [
        fynk,
        "scope",
      ],
    },
  },
  async run({ $ }) {
    const {
      documentUuid,
      partyUuid,
      reference,
      entityType,
      entityName,
      address,
      scope,
    } = this;

    const data = {
      reference,
      entity_type: entityType,
      entity_name: entityName,
      address,
      scope,
    };

    const response = await this.fynk.updateDocumentParty({
      $,
      documentUuid,
      partyUuid,
      data,
    });

    $.export("$summary", `Successfully updated party ${partyUuid} for contract ${documentUuid}`);
    return response;
  },
};

