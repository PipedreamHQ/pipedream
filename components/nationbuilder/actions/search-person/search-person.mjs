import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-search-person",
  name: "Search Person",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new person with the provided data. [See the documentation](https://nationbuilder.com/people_api)",
  type: "action",
  props: {
    nationbuilder,
    firstName: {
      propDefinition: [
        nationbuilder,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        nationbuilder,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        nationbuilder,
        "email",
      ],
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the primary address of people to match.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the primary address of people tto match.",
      optional: true,
    },
    sex: {
      propDefinition: [
        nationbuilder,
        "sex",
      ],
      optional: true,
    },
    birthdate: {
      type: "string",
      label: "Birthdate",
      description: "date of birth of the people to match.",
      optional: true,
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "People updated since the given date.",
      optional: true,
    },
    withMobile: {
      type: "string",
      label: "With Mobile",
      description: "Only people with mobile phone numbers.",
      optional: true,
    },
    customValues: {
      type: "object",
      label: "Custom Values",
      description: "Match custom field values.",
      optional: true,
    },
    civicrmId: {
      type: "string",
      label: "Civicrm Id",
      description: "Civicrm id of the person to match.",
      optional: true,
    },
    countyFileId: {
      type: "string",
      label: "County File Id",
      description: "Count File Id of the person to match.",
      optional: true,
    },
    stateFileId: {
      type: "string",
      label: "State File Id",
      description: "State File id of the person to match.",
      optional: true,
    },
    datatrustId: {
      type: "string",
      label: "Datatrust Id",
      description: "Datatrust Id of the person to match.",
      optional: true,
    },
    dwId: {
      type: "string",
      label: "DW Id",
      description: "DW Id of the person to match.",
      optional: true,
    },
    mediaMarketId: {
      type: "string",
      label: "Media Market Id",
      description: "Media market Id of the person to match.",
      optional: true,
    },
    ngpId: {
      propDefinition: [
        nationbuilder,
        "ngpId",
      ],
      optional: true,
    },
    pfStratId: {
      type: "string",
      label: "PF Strat Id",
      description: "PD Strat Id of the person to match.",
      optional: true,
    },
    vanId: {
      type: "string",
      label: "Van Id",
      description: "Van Id of the person to match.",
      optional: true,
    },
    salesforceId: {
      type: "string",
      label: "Salesforce Id",
      description: "Salesforce Id of the person to match.",
      optional: true,
    },
    rncId: {
      type: "string",
      label: "RNC Id",
      description: "RNC Id of the person to match.",
      optional: true,
    },
    rncRegid: {
      type: "string",
      label: "RNC Reg Id",
      description: "RNC Reg Id of the person to match.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "External Id of the person to match.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nationbuilder,
      firstName,
      lastName,
      updatedSince,
      withMobile,
      customValues,
      civicrmId,
      countyFileId,
      stateFileId,
      datatrustId,
      dwId,
      mediaMarketId,
      ngpId,
      pfStratId,
      vanId,
      salesforceId,
      rncId,
      rncRegid,
      externalId,
      ...data
    } = this;

    // const response = await nationbuilder.searchPeople({
    const items = await nationbuilder.paginate({
      $,
      fn: nationbuilder.searchPeople,
      params: {
        first_name: firstName,
        last_name: lastName,
        updated_since: updatedSince,
        with_mobile: withMobile,
        custom_values: customValues,
        civicrm_id: civicrmId,
        county_file_id: countyFileId,
        state_file_id: stateFileId,
        datatrust_id: datatrustId,
        sw_id: dwId,
        media_market_id: mediaMarketId,
        ngp_id: ngpId,
        pf_strat_id: pfStratId,
        van_id: vanId,
        salesforce_id: salesforceId,
        rnc_id: rncId,
        rnc_regid: rncRegid,
        external_id: externalId,
        ...data,
      },
    });

    const responseArray = [];

    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} ${responseArray.length > 1
      ? "people were"
      : "person was"} successfully fetched!`);
    return responseArray;
  },
};
