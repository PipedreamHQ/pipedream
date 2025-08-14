import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Update Reservation",
  description: "Update an existing reservation in Mews.",
  key: "mews-update-reservation",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reservationId: {
      propDefinition: [
        app,
        "reservationId",
      ],
    },
    startUtc: {
      propDefinition: [
        app,
        "startUtc",
      ],
      optional: true,
    },
    endUtc: {
      propDefinition: [
        app,
        "endUtc",
      ],
      optional: true,
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
      reservationId,
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

    const response = await app.reservationsUpdate({
      $,
      data: {
        Reservations: [
          {
            Id: reservationId,
            ...(startUtc && {
              StartUtc: startUtc,
            }),
            ...(endUtc && {
              EndUtc: endUtc,
            }),
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
            ...utils.parseJson(additionalFields),
          },
        ],
      },
    });
    $.export("summary", "Successfully updated reservation");
    return response;
  },
};

