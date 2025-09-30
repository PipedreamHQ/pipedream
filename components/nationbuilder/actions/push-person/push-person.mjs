import { ConfigurationError } from "@pipedream/platform";
import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-push-person",
  name: "Push Person",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "This endpoint attempts to match the input person resource to a person already in the nation. If a match is found, the matched person is updated and a 200 status code is returned. If a match is not found, a new person is created and a 201 status code is returned. Matches are found by including one of the following IDs in the request: `civicrm_id`,  `county_file_id`,  `dw_id`,  `external_id`,  `email`,  `facebook_username`,  `ngp_id`,  `salesforce_id`,  `twitter_login`, `van_id`. [See the documentation](https://nationbuilder.com/people_api)",
  type: "action",
  props: {
    nationbuilder,
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
    dwId: {
      type: "string",
      label: "DW Id",
      description: "DW Id of the person to match.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "External Id of the person to match.",
      optional: true,
    },
    email: {
      propDefinition: [
        nationbuilder,
        "email",
      ],
      optional: true,
    },
    facebookUsername: {
      propDefinition: [
        nationbuilder,
        "facebookUsername",
      ],
      optional: true,
    },
    ngpId: {
      propDefinition: [
        nationbuilder,
        "ngpId",
      ],
      optional: true,
    },
    salesforceId: {
      type: "string",
      label: "Salesforce Id",
      description: "Salesforce Id of the person to match.",
      optional: true,
    },
    twitterLogin: {
      propDefinition: [
        nationbuilder,
        "twitterLogin",
      ],
      optional: true,
    },
    vanId: {
      type: "string",
      label: "Van Id",
      description: "Van Id of the person to match.",
      optional: true,
    },
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
    phone: {
      propDefinition: [
        nationbuilder,
        "phone",
      ],
      optional: true,
    },
    sex: {
      propDefinition: [
        nationbuilder,
        "sex",
      ],
      optional: true,
    },
    signupType: {
      propDefinition: [
        nationbuilder,
        "signupType",
      ],
      optional: true,
    },
    employer: {
      propDefinition: [
        nationbuilder,
        "employer",
      ],
      optional: true,
    },
    party: {
      propDefinition: [
        nationbuilder,
        "party",
      ],
      optional: true,
    },
    registeredAddress1: {
      propDefinition: [
        nationbuilder,
        "registeredAddress1",
      ],
      optional: true,
    },
    registeredAddress2: {
      propDefinition: [
        nationbuilder,
        "registeredAddress2",
      ],
      optional: true,
    },
    registeredAddress3: {
      propDefinition: [
        nationbuilder,
        "registeredAddress3",
      ],
      optional: true,
    },
    registeredAddressCity: {
      propDefinition: [
        nationbuilder,
        "registeredAddressCity",
      ],
      optional: true,
    },
    registeredAddressState: {
      propDefinition: [
        nationbuilder,
        "registeredAddressState",
      ],
      optional: true,
    },
    registeredAddressZip: {
      propDefinition: [
        nationbuilder,
        "registeredAddressZip",
      ],
      optional: true,
    },
    registeredAddressCountryCode: {
      propDefinition: [
        nationbuilder,
        "registeredAddressCountryCode",
      ],
      optional: true,
    },
    registeredAddressLat: {
      propDefinition: [
        nationbuilder,
        "registeredAddressLat",
      ],
      optional: true,
    },
    registeredAddressLng: {
      propDefinition: [
        nationbuilder,
        "registeredAddressLng",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        nationbuilder,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nationbuilder,
      civicrmId,
      countyFileId,
      dwId,
      externalId,
      email,
      facebookUsername,
      ngpId,
      salesforceId,
      twitterLogin,
      vanId,
      firstName,
      lastName,
      phone,
      signupType,
      registeredAddress1,
      registeredAddress2,
      registeredAddress3,
      registeredAddressCity,
      registeredAddressState,
      registeredAddressZip,
      registeredAddressCountryCode,
      registeredAddressLat,
      registeredAddressLng,
      ...data
    } = this;

    if (!firstName && !email && !phone) {
      throw new ConfigurationError("You must supply at least a first and last name, an email address, or a phone number.");
    }

    const response = await nationbuilder.pushPerson({
      $,
      data: {
        person: {
          civicrm_id: civicrmId,
          county_file_id: countyFileId,
          dw_id: dwId,
          external_id: externalId,
          facebook_username: facebookUsername,
          ngp_id: ngpId,
          salesforce_id: salesforceId,
          twitter_login: twitterLogin,
          van_id: vanId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          signup_type: signupType,
          registered_address: {
            address1: registeredAddress1,
            address2: registeredAddress2,
            address3: registeredAddress3,
            city: registeredAddressCity,
            state: registeredAddressState,
            zip: registeredAddressZip,
            country_code: registeredAddressCountryCode,
            lat: registeredAddressLat,
            lng: registeredAddressLng,
          },
          ...data,
        },
      },
    });

    $.export("$summary", `The person with Id: ${response.person?.id} was successfully pushed!`);
    return response;
  },
};
