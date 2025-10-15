import {
  ELECTION_CODES,
  FEC_CODES, PAYMENT_CODES,
} from "../../common/constants.mjs";
import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-create-donation",
  name: "Create Donation",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new donation with the provided data. [See the documentation](https://nationbuilder.com/donations_api)",
  type: "action",
  props: {
    nationbuilder,
    amountInCents: {
      propDefinition: [
        nationbuilder,
        "amountInCents",
      ],
    },
    authorId: {
      propDefinition: [
        nationbuilder,
        "personId",
      ],
      label: "Author Id",
      description: "Id of the person who created the donation.",
      optional: true,
    },
    billingAddress1: {
      propDefinition: [
        nationbuilder,
        "registeredAddress1",
      ],
      label: "Billing Address 1",
      optional: true,
    },
    billingAddress2: {
      propDefinition: [
        nationbuilder,
        "registeredAddress2",
      ],
      label: "Billing Address 2",
      optional: true,
    },
    billingAddress3: {
      propDefinition: [
        nationbuilder,
        "registeredAddress3",
      ],
      label: "Billing Address 3",
      optional: true,
    },
    billingAddressCity: {
      propDefinition: [
        nationbuilder,
        "registeredAddressCity",
      ],
      label: "Billing Address City",
      description: "The city of the billing address.",
      optional: true,
    },
    billingAddressState: {
      propDefinition: [
        nationbuilder,
        "registeredAddressState",
      ],
      label: "Billing Address State",
      description: "The state of the billing address.",
      optional: true,
    },
    billingAddressZip: {
      propDefinition: [
        nationbuilder,
        "registeredAddressZip",
      ],
      label: "Billing Address Zip",
      description: "The zip code of the billing address.",
      optional: true,
    },
    billingAddressCountryCode: {
      propDefinition: [
        nationbuilder,
        "registeredAddressCountryCode",
      ],
      label: "Billing Address Country Code",
      description: "The country code of the billing address (using ISO-3166-1 alpha-2).",
      optional: true,
    },
    billingAddressLat: {
      propDefinition: [
        nationbuilder,
        "registeredAddressLat",
      ],
      label: "Billing Address Lat",
      description: "The latitude of the billing address (using WGS-84).",
      optional: true,
    },
    billingAddressLng: {
      propDefinition: [
        nationbuilder,
        "registeredAddressLng",
      ],
      label: "Billing Address Lng",
      description: "The longitude of the billing address (using WGS-84).",
      optional: true,
    },
    checkNumber: {
      propDefinition: [
        nationbuilder,
        "checkNumber",
      ],
      optional: true,
    },
    corporateContribution: {
      propDefinition: [
        nationbuilder,
        "corporateContribution",
      ],
      optional: true,
    },
    donorId: {
      propDefinition: [
        nationbuilder,
        "personId",
      ],
      label: "Donor Id",
      description: "The person id of the donor.",
    },
    isPrivate: {
      propDefinition: [
        nationbuilder,
        "isPrivate",
      ],
      optional: true,
    },
    note: {
      propDefinition: [
        nationbuilder,
        "note",
      ],
      optional: true,
    },
    paymentTypeName: {
      propDefinition: [
        nationbuilder,
        "paymentTypeName",
      ],
      optional: true,
    },
    recruiterNameOrEmail: {
      propDefinition: [
        nationbuilder,
        "recruiterNameOrEmail",
      ],
      optional: true,
    },
    trackingCodeSlug: {
      propDefinition: [
        nationbuilder,
        "trackingCodeSlug",
      ],
      optional: true,
    },
    workAddress1: {
      propDefinition: [
        nationbuilder,
        "registeredAddress1",
      ],
      label: "Work Address 1",
      optional: true,
    },
    workAddress2: {
      propDefinition: [
        nationbuilder,
        "registeredAddress2",
      ],
      label: "Work Address 2",
      optional: true,
    },
    workAddress3: {
      propDefinition: [
        nationbuilder,
        "registeredAddress3",
      ],
      label: "Work Address 3",
      optional: true,
    },
    workAddressCity: {
      propDefinition: [
        nationbuilder,
        "registeredAddressCity",
      ],
      label: "Work Address City",
      description: "The city of the work address.",
      optional: true,
    },
    workAddressState: {
      propDefinition: [
        nationbuilder,
        "registeredAddressState",
      ],
      label: "Work Address State",
      description: "The state of the work address.",
      optional: true,
    },
    workAddressZip: {
      propDefinition: [
        nationbuilder,
        "registeredAddressZip",
      ],
      label: "Work Address Zip",
      description: "The zip code of the work address.",
      optional: true,
    },
    workAddressCountryCode: {
      propDefinition: [
        nationbuilder,
        "registeredAddressCountryCode",
      ],
      label: "Work Address Country Code",
      description: "The country code of the work address (using ISO-3166-1 alpha-2).",
      optional: true,
    },
    workAddressLat: {
      propDefinition: [
        nationbuilder,
        "registeredAddressLat",
      ],
      label: "Work Address Lat",
      description: "The latitude of the work address (using WGS-84).",
      optional: true,
    },
    workAddressLng: {
      propDefinition: [
        nationbuilder,
        "registeredAddressLng",
      ],
      label: "Work Address Lng",
      description: "The longitude of the work address (using WGS-84).",
      optional: true,
    },
    actblueOrderNumber: {
      propDefinition: [
        nationbuilder,
        "actblueOrderNumber",
      ],
      optional: true,
    },
    fecType: {
      propDefinition: [
        nationbuilder,
        "fecType",
      ],
      optional: true,
    },
    cycle: {
      propDefinition: [
        nationbuilder,
        "cycle",
      ],
      optional: true,
    },
    period: {
      propDefinition: [
        nationbuilder,
        "period",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nationbuilder,
      amountInCents,
      authorId,
      billingAddress1,
      billingAddress2,
      billingAddress3,
      billingAddressCity,
      billingAddressState,
      billingAddressZip,
      billingAddressCountryCode,
      billingAddressLat,
      billingAddressLng,
      checkNumber,
      corporateContribution,
      donorId,
      isPrivate,
      paymentTypeName,
      recruiterNameOrEmail,
      trackingCodeSlug,
      workAddress1,
      workAddress2,
      workAddress3,
      workAddressCity,
      workAddressState,
      workAddressZip,
      workAddressCountryCode,
      workAddressLat,
      workAddressLng,
      actblueOrderNumber,
      fecType,
      cycle,
      period,
      ...data
    } = this;

    const response = await nationbuilder.createDonation({
      $,
      data: {
        donation: {
          amount_in_cents: amountInCents,
          author_id: authorId,
          billing_address: {
            address1: billingAddress1,
            address2: billingAddress2,
            address3: billingAddress3,
            city: billingAddressCity,
            state: billingAddressState,
            zip: billingAddressZip,
            country_code: billingAddressCountryCode,
            lat: billingAddressLat,
            lng: billingAddressLng,
          },
          check_number: checkNumber,
          corporate_contribution: corporateContribution,
          donor_id: donorId,
          is_private: isPrivate,
          payment_type_name: paymentTypeName,
          payment_type_ngp_code: PAYMENT_CODES[paymentTypeName],
          recruiter_name_or_email: recruiterNameOrEmail,
          tracking_code_slug: trackingCodeSlug,
          work_address: {
            address1: workAddress1,
            address2: workAddress2,
            address3: workAddress3,
            city: workAddressCity,
            state: workAddressState,
            zip: workAddressZip,
            country_code: workAddressCountryCode,
            lat: workAddressLat,
            lng: workAddressLng,
          },
          actblue_order_number: actblueOrderNumber,
          fec_type: fecType,
          fec_type_ngp_code: FEC_CODES[fecType],
          election: {
            cycle,
            period,
            period_ngp_code: ELECTION_CODES[period],
          },
          ...data,
        },
      },
    });

    $.export("$summary", `A new donation with Id: ${response.donation?.id} was successfully created!`);
    return response;
  },
};
