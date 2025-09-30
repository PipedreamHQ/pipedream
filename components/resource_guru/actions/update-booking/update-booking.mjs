import { parseObject } from "../../common/utils.mjs";
import resourceGuru from "../../resource_guru.app.mjs";

export default {
  key: "resource_guru-update-booking",
  name: "Update Booking",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific booking identified by Id. [See the documentation](https://resourceguruapp.com/docs/api#tag/booking/paths/~1v1~1%7Baccount%7D~1bookings~1%7Bid%7D/put)",
  type: "action",
  props: {
    resourceGuru,
    bookingId: {
      propDefinition: [
        resourceGuru,
        "bookingId",
      ],
    },
    affects: {
      type: "string",
      label: "Affects",
      description: "Specify how the operation affects other occurrences of a repeat booking.",
      options: [
        "all",
        "following",
        "single",
      ],
    },
    resourceIds: {
      propDefinition: [
        resourceGuru,
        "resourceIds",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        resourceGuru,
        "startDate",
      ],
      optional: true,
    },
    endDate: {
      propDefinition: [
        resourceGuru,
        "endDate",
      ],
      optional: true,
    },
    duration: {
      propDefinition: [
        resourceGuru,
        "duration",
      ],
      optional: true,
    },
    startTime: {
      propDefinition: [
        resourceGuru,
        "startTime",
      ],
      optional: true,
    },
    details: {
      propDefinition: [
        resourceGuru,
        "details",
      ],
      optional: true,
    },
    bookerId: {
      propDefinition: [
        resourceGuru,
        "bookerId",
      ],
      optional: true,
    },
    billable: {
      propDefinition: [
        resourceGuru,
        "billable",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        resourceGuru,
        "projectId",
      ],
      optional: true,
    },
    clientId: {
      propDefinition: [
        resourceGuru,
        "clientId",
      ],
      optional: true,
    },
    rrule: {
      propDefinition: [
        resourceGuru,
        "rrule",
      ],
      optional: true,
    },
    timezone: {
      propDefinition: [
        resourceGuru,
        "timezone",
      ],
      optional: true,
    },
    tentative: {
      propDefinition: [
        resourceGuru,
        "tentative",
      ],
      optional: true,
    },
    clashResolution: {
      propDefinition: [
        resourceGuru,
        "clashResolution",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      resourceGuru,
      bookingId,
      affects,
      resourceIds,
      startDate,
      endDate,
      startTime,
      bookerId,
      projectId,
      clientId,
      clashResolution,
      rrule,
      ...data
    } = this;

    const response = await resourceGuru.updateBooking({
      $,
      bookingId,
      params: {
        affects,
      },
      data: {
        ...data,
        resource_ids: resourceIds,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        booker_id: bookerId,
        project_id: projectId,
        client_id: clientId,
        clash_resolution: clashResolution,
        rrule: parseObject(rrule),
      },
    });

    $.export("$summary", `The booking with Id: ${bookingId} was successfully updated!`);
    return response;
  },
};
