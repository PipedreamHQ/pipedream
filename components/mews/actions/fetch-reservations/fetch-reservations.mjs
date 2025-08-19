import app from "../../mews.app.mjs";

export default {
  name: "Fetch Reservations",
  description: "Retrieve reservations using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#get-all-reservations-ver-2023-06-06)",
  key: "mews-fetch-reservations",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    createdStartUtc: {
      description: "Start of the interval in which Reservation was created. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "createdStartUtc",
      ],
    },
    createdEndUtc: {
      description: "End of the interval in which Reservation was created. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "createdEndUtc",
      ],
    },
    updatedStartUtc: {
      description: "Start of the interval in which Reservations were updated. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedStartUtc",
      ],
    },
    updatedEndUtc: {
      description: "End of the interval in which Reservations were updated. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedEndUtc",
      ],
    },
    collidingStartUtc: {
      type: "string",
      label: "Colliding Start (UTC)",
      description: "Start of the interval in which reservations are active. Reservation is selected if any part of its interval intersects with the interval specified. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    collidingEndUtc: {
      type: "string",
      label: "Colliding End (UTC)",
      description: "End of the interval in which reservations are active. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    scheduledStartStartUtc: {
      type: "string",
      label: "Scheduled Start - Start (UTC)",
      description: "Start of the interval filtering Reservations by their scheduled start time. Cannot be used with Actual Start. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    scheduledStartEndUtc: {
      type: "string",
      label: "Scheduled Start - End (UTC)",
      description: "End of the interval filtering Reservations by their scheduled start time. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    scheduledEndStartUtc: {
      type: "string",
      label: "Scheduled End - Start (UTC)",
      description: "Start of the interval filtering Reservations by their scheduled end time. Cannot be used with Actual End. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    scheduledEndEndUtc: {
      type: "string",
      label: "Scheduled End - End (UTC)",
      description: "End of the interval filtering Reservations by their scheduled end time. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    actualStartStartUtc: {
      type: "string",
      label: "Actual Start - Start (UTC)",
      description: "Start of the interval filtering Reservations by their actual start (check-in) time. Cannot be used with Scheduled Start. Note that the filter applies only to started or processed reservations. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    actualStartEndUtc: {
      type: "string",
      label: "Actual Start - End (UTC)",
      description: "End of the interval filtering Reservations by their actual start (check-in) time. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    actualEndStartUtc: {
      type: "string",
      label: "Actual End - Start (UTC)",
      description: "Start of the interval filtering Reservations by their actual end (check-out) time. Cannot be used with Scheduled End. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    actualEndEndUtc: {
      type: "string",
      label: "Actual End - End (UTC)",
      description: "End of the interval filtering Reservations by their actual end (check-out) time. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    enterpriseIds: {
      propDefinition: [
        app,
        "enterpriseIds",
      ],
    },
    reservationIds: {
      type: "string[]",
      label: "Reservation IDs",
      description: "Unique identifiers of the Reservations. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "reservationId",
      ],
    },
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Unique identifiers of the Services. If not provided, all bookable services are used. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    reservationGroupIds: {
      propDefinition: [
        app,
        "reservationGroupIds",
      ],
    },
    accountIds: {
      type: "string[]",
      label: "Account IDs",
      description: "Unique identifiers of accounts (currently only Customers, in the future also Companies) the reservation is associated with. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "accountId",
        () => ({
          accountType: "customer",
        }),
      ],
    },
    partnerCompanyIds: {
      type: "string[]",
      label: "Partner Company IDs",
      description: "Unique identifiers of the Companies on behalf of which the reservations were made. Max 100 items.",
      optional: true,
      propDefinition: [
        app,
        "companyId",
      ],
    },
    travelAgencyIds: {
      type: "string[]",
      label: "Travel Agency IDs",
      description: "Identifier of the Travel Agencies (Company) that mediated the reservations. Max 100 items. (Company with a TravelAgencyContract)",
      optional: true,
      propDefinition: [
        app,
        "companyId",
        () => ({
          filter: (company) => {
            return company.NchClassifications?.OnlineTravelAgency === true;
          },
        }),
      ],
    },
    numbers: {
      type: "string[]",
      label: "Confirmation Numbers",
      description: "Reservation confirmation numbers. Max 1000 items.",
      optional: true,
    },
    channelNumbers: {
      type: "string[]",
      label: "Channel Numbers",
      description: "Numbers or references used by a Channel (OTA, GDS, CRS, etc.) in case the reservation group originates there, e.g. Booking.com confirmation numbers. Max 100 items.",
      optional: true,
    },
    assignedResourceIds: {
      type: "string[]",
      label: "Assigned Resource IDs",
      description: "Unique identifiers of the Resources assigned to the reservations. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "resourceId",
      ],
    },
    availabilityBlockIds: {
      type: "string[]",
      label: "Availability Block IDs",
      description: "Unique identifiers of the Availability blocks assigned to the reservations. Max 100 items.",
      optional: true,
    },
    states: {
      type: "string[]",
      label: "States",
      description: "A list of service order states to filter by.",
      optional: true,
      options: [
        "Inquired",
        "Requested",
        "Optional",
        "Confirmed",
        "Started",
        "Processed",
        "Canceled",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      createdStartUtc,
      createdEndUtc,
      updatedStartUtc,
      updatedEndUtc,
      collidingStartUtc,
      collidingEndUtc,
      scheduledStartStartUtc,
      scheduledStartEndUtc,
      scheduledEndStartUtc,
      scheduledEndEndUtc,
      actualStartStartUtc,
      actualStartEndUtc,
      actualEndStartUtc,
      actualEndEndUtc,
      enterpriseIds,
      reservationIds,
      serviceIds,
      reservationGroupIds,
      accountIds,
      partnerCompanyIds,
      travelAgencyIds,
      numbers,
      channelNumbers,
      assignedResourceIds,
      availabilityBlockIds,
      states,
    } = this;

    const items = await app.paginate({
      requester: app.reservationsGetAll,
      requesterArgs: {
        $,
        data: {
          ...(createdStartUtc || createdEndUtc) && {
            CreatedUtc: {
              StartUtc: createdStartUtc,
              EndUtc: createdEndUtc,
            },
          },
          ...(updatedStartUtc || updatedEndUtc) && {
            UpdatedUtc: {
              StartUtc: updatedStartUtc,
              EndUtc: updatedEndUtc,
            },
          },
          ...(collidingStartUtc || collidingEndUtc) && {
            CollidingUtc: {
              StartUtc: collidingStartUtc,
              EndUtc: collidingEndUtc,
            },
          },
          ...(scheduledStartStartUtc || scheduledStartEndUtc) && {
            ScheduledStartUtc: {
              StartUtc: scheduledStartStartUtc,
              EndUtc: scheduledStartEndUtc,
            },
          },
          ...(scheduledEndStartUtc || scheduledEndEndUtc) && {
            ScheduledEndUtc: {
              StartUtc: scheduledEndStartUtc,
              EndUtc: scheduledEndEndUtc,
            },
          },
          ...(actualStartStartUtc || actualStartEndUtc) && {
            ActualStartUtc: {
              StartUtc: actualStartStartUtc,
              EndUtc: actualStartEndUtc,
            },
          },
          ...(actualEndStartUtc || actualEndEndUtc) && {
            ActualEndUtc: {
              StartUtc: actualEndStartUtc,
              EndUtc: actualEndEndUtc,
            },
          },
          EnterpriseIds: enterpriseIds,
          ReservationIds: reservationIds,
          ServiceIds: serviceIds,
          ReservationGroupIds: reservationGroupIds,
          AccountIds: accountIds,
          PartnerCompanyIds: partnerCompanyIds,
          TravelAgencyIds: travelAgencyIds,
          Numbers: numbers,
          ChannelNumbers: channelNumbers,
          AssignedResourceIds: assignedResourceIds,
          AvailabilityBlockIds: availabilityBlockIds,
          States: states,
        },
      },
      resultKey: "Reservations",
    });

    $.export("$summary", `Successfully fetched ${items.length} reservation${items.length !== 1
      ? "s"
      : ""}`);
    return items;
  },
};

