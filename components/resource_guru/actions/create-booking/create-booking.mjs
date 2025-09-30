import {
  convertTime, parseObject,
} from "../../common/utils.mjs";
import resourceGuru from "../../resource_guru.app.mjs";

export default {
  key: "resource_guru-create-booking",
  name: "Create Booking",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new booking for an account. [See the documentation](https://resourceguruapp.com/docs/api#tag/booking/paths/~1v1~1%7Baccount%7D~1bookings/post)",
  type: "action",
  props: {
    resourceGuru,
    resourceIds: {
      propDefinition: [
        resourceGuru,
        "resourceIds",
      ],
    },
    startDate: {
      propDefinition: [
        resourceGuru,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        resourceGuru,
        "endDate",
      ],
    },
    duration: {
      propDefinition: [
        resourceGuru,
        "duration",
      ],
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
      resourceIds,
      startDate,
      endDate,
      startTime,
      bookerId,
      projectId,
      rrule,
      clientId,
      clashResolution,
      ...data
    } = this;

    const response = await resourceGuru.createBooking({
      $,
      data: {
        ...data,
        resource_ids: resourceIds,
        start_date: startDate,
        end_date: endDate,
        start_time: convertTime(startTime),
        booker_id: bookerId,
        project_id: projectId,
        client_id: clientId,
        clash_resolution: clashResolution,
        rrule: parseObject(rrule),
      },
    });

    $.export("$summary", `A new booking with Id: ${response.id} was successfully created!`);
    return response;
  },
};
