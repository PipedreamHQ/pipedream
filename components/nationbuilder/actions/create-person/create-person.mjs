import { ConfigurationError } from "@pipedream/platform";
import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-create-person",
  name: "Create Person",
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
    facebookUsername: {
      propDefinition: [
        nationbuilder,
        "facebookUsername",
      ],
      optional: true,
    },
    twitterLogin: {
      propDefinition: [
        nationbuilder,
        "twitterLogin",
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
      firstName,
      lastName,
      email,
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
      facebookUsername,
      twitterLogin,
      ...data
    } = this;

    if (!firstName && !email && !phone) {
      throw new ConfigurationError("You must supply at least a first and last name, an email address, or a phone number.");
    }

    const response = await nationbuilder.createPerson({
      $,
      data: {
        person: {
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
          facebook_username: facebookUsername,
          twitter_login: twitterLogin,
          ...data,
        },
      },
    });

    $.export("$summary", `A new person with Id: ${response.person?.id} was successfully created!`);
    return response;
  },
};
