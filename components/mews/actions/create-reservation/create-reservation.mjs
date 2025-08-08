import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Create Reservation",
  description: "Create a reservation in Mews. See reservation parameters in the docs. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#add-reservations)",
  key: "mews-create-reservation",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    startUtc: {
      propDefinition: [
        app,
        "startUtc",
      ],
    },
    endUtc: {
      propDefinition: [
        app,
        "endUtc",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
      optional: true,
    },
    resourceId: {
      propDefinition: [
        app,
        "resourceId",
      ],
      optional: true,
    },
    number: {
      propDefinition: [
        app,
        "number",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
      optional: true,
    },
    rateId: {
      propDefinition: [
        app,
        "rateId",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      optional: true,
    },
    travelAgencyId: {
      propDefinition: [
        app,
        "travelAgencyId",
      ],
      optional: true,
    },
    businessSegmentId: {
      propDefinition: [
        app,
        "businessSegmentId",
      ],
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        app,
        "additionalFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      serviceId,
      customerId,
      startUtc,
      endUtc,
      state,
      resourceId,
      number,
      notes,
      rateId,
      companyId,
      travelAgencyId,
      businessSegmentId,
      additionalFields,
    } = this;

    const response = await app.reservationsCreate({
      data: {
        Reservations: [
          {
            ServiceId: serviceId,
            CustomerId: customerId,
            StartUtc: startUtc,
            EndUtc: endUtc,
            ...(state && {
              State: state,
            }),
            ...(resourceId && {
              ResourceId: resourceId,
            }),
            ...(number && {
              Number: number,
            }),
            ...(notes && {
              Notes: notes,
            }),
            ...(rateId && {
              RateId: rateId,
            }),
            ...(companyId && {
              CompanyId: companyId,
            }),
            ...(travelAgencyId && {
              TravelAgencyId: travelAgencyId,
            }),
            ...(businessSegmentId && {
              BusinessSegmentId: businessSegmentId,
            }),
            ...(additionalFields && {
              ...utils.parseJson(additionalFields),
            }),
          },
        ],
      },
      $,
    });
    $.export("summary", "Successfully created reservation");
    return response;
  },
};
