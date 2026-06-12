import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-get-classes",
  name: "Get Classes",
  description:
    "Returns upcoming group class sessions at the studio, including class name, start/end time, instructor, location, and remaining capacity."
    + " Use `startDateTime` and `endDateTime` to filter by date range (ISO 8601 format, e.g., `2026-07-01T00:00:00`)."
    + " Use `staffId` to find classes taught by a specific instructor — see **List Staff** for IDs."
    + " Use `locationId` to filter by studio location — see **Get Site Info** for location IDs."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/class/get-classes)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    startDateTime: {
      type: "string",
      label: "Start Date/Time",
      description: "Return classes starting on or after this datetime. ISO 8601 format: `YYYY-MM-DDTHH:MM:SS` (e.g., `2026-07-01T00:00:00`). Defaults to today.",
      optional: true,
    },
    endDateTime: {
      type: "string",
      label: "End Date/Time",
      description: "Return classes starting on or before this datetime. ISO 8601 format: `YYYY-MM-DDTHH:MM:SS` (e.g., `2026-07-14T23:59:59`).",
      optional: true,
    },
    staffId: {
      type: "string",
      label: "Staff ID",
      description: "Filter classes by instructor. Use **List Staff** to find staff IDs.",
      optional: true,
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of class sessions to return. Defaults to 20.",
      default: 20,
      optional: true,
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      Limit: this.limit,
      Offset: this.offset,
    };
    params.StartDateTime = this.startDateTime;
    params.EndDateTime = this.endDateTime;
    if (this.staffId) params.StaffIds = [
      this.staffId,
    ];
    if (this.locationId) params.LocationIds = [
      this.locationId,
    ];

    const response = await this.app.getClasses({
      $,
      params,
    });
    const classes = (response.Classes || []).map((c) => ({
      Id: c.Id,
      Name: c.ClassDescription?.Name,
      StartDateTime: c.StartDateTime,
      EndDateTime: c.EndDateTime,
      Staff: c.Staff
        ? {
          Id: c.Staff.Id,
          Name: `${c.Staff.FirstName} ${c.Staff.LastName}`,
        }
        : null,
      Location: c.Location
        ? {
          Id: c.Location.Id,
          Name: c.Location.Name,
        }
        : null,
      TotalBooked: c.TotalBooked,
      MaxCapacity: c.MaxCapacity,
      IsCancelled: c.IsCancelled,
      IsWaitlistAvailable: c.IsWaitlistAvailable,
    }));
    $.export("$summary", `Found ${classes.length} class session${classes.length === 1
      ? ""
      : "s"}`);
    return {
      PaginationResponse: response.PaginationResponse,
      Classes: classes,
    };
  },
};
