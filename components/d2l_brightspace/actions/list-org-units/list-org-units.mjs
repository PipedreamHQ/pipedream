import app from "../../d2l_brightspace.app.mjs";

export default {
  key: "d2l_brightspace-list-org-units",
  name: "List Organizational Units",
  description: "Retrieves a list of organizational units (courses, departments, etc.) from D2L Brightspace. [See the documentation](https://docs.valence.desire2learn.com/res/orgunit.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    orgUnitType: {
      type: "string",
      label: "Org Unit Type",
      description: "Filter by organizational unit type ID (e.g., type ID for course offerings). Leave empty to retrieve all types.",
      optional: true,
    },
    orgUnitName: {
      type: "string",
      label: "Org Unit Name Filter",
      description: "Filter by names containing this substring",
      optional: true,
    },
    orgUnitCode: {
      type: "string",
      label: "Org Unit Code Filter",
      description: "Filter by codes containing this substring",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Maximum Results",
      description: "The maximum number of organizational units to return",
      optional: true,
      default: 100,
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  async run({ $ }) {
    const {
      app,
      orgUnitType,
      orgUnitName,
      orgUnitCode,
      max,
    } = this;

    const orgUnits = [];

    const iterator = app.paginate({
      fn: app.listOrgUnits,
      params: {
        orgUnitType,
        orgUnitName,
        orgUnitCode,
      },
      maxResults: max,
    });

    for await (const orgUnit of iterator) {
      orgUnits.push(orgUnit);
    }

    $.export("$summary", `Successfully retrieved ${orgUnits.length} organizational unit${orgUnits.length === 1
      ? ""
      : "s"}`);
    return orgUnits;
  },
};
