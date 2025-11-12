import { ConfigurationError } from "@pipedream/platform";
import app from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-add-person-position",
  name: "Add Position",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a position to a specific person. [See the documentation](https://app.swaggerhub.com/apis-docs/clockwork-recruiting/cw-public-api/3.0.0#/Person%20Positions/post_people__person_id__positions)",
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the position.",
      optional: true,
    },
    startMonth: {
      type: "integer",
      label: "Start Month",
      description: "The month that the person will start the position.",
      optional: true,
    },
    startYear: {
      type: "integer",
      label: "Start Year",
      description: "The year that the person will start the position.",
      optional: true,
    },
    endMonth: {
      type: "integer",
      label: "End Month",
      description: "The month that the person will leave the position.",
      optional: true,
    },
    endYear: {
      type: "integer",
      label: "End Year",
      description: "The year that the person will leave the position.",
      optional: true,
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company where the position is open. **If `Company Id` is set, this field will be overwritten**",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      personId,
      ...data
    } = this;

    if (!Object.entries(data).length) {
      throw new ConfigurationError("At least one field must be provided.");
    }

    const response = await app.createPosition({
      $,
      personId,
      data: {
        position: data,
      },
    });

    $.export("$summary", `Successfully created new position with ID ${response.position?.id}`);
    return response;
  },
};
