const ALL_FIELDS = "all_fields";

export default {
  API_BASE_URL_VERSIONS: {
    "v1": "https://track.toggl.com/webhooks/api/v1",
    "v8": "https://api.track.toggl.com/api/v8",
    "v9": "https://api.track.toggl.com/api/v9",
    "reportsV3": "https://api.track.toggl.com/reports/api/v3",
  },
  ALL_FIELDS,
  DEFAULT_PROJECT_FIELDS: [
    "name",
    "client_id",
    "active",
    "billable",
    "color",
    "start_date",
    "end_date",
    "created_at",
  ],
  PROJECT_FIELD_OPTIONS: [
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Client ID",
      value: "client_id",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Billable",
      value: "billable",
    },
    {
      label: "Color",
      value: "color",
    },
    {
      label: "Start Date",
      value: "start_date",
    },
    {
      label: "End Date",
      value: "end_date",
    },
    {
      label: "Created At",
      value: "created_at",
    },
    {
      label: "Estimated Hours",
      value: "estimated_hours",
    },
    {
      label: "Private",
      value: "is_private",
    },
    {
      label: "Rate",
      value: "rate",
    },
    {
      label: "All Fields",
      value: ALL_FIELDS,
    },
  ],
};
