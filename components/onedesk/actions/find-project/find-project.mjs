import onedesk from "../../onedesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "onedesk-find-project",
  name: "Find Project",
  description: "Search for a project/space by name or ID. [See the docs](https://www.onedesk.com/developers/#_search_spaces)",
  version: "0.0.1",
  type: "action",
  props: {
    onedesk,
    spaceId: {
      propDefinition: [
        onedesk,
        "spaceId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project/space",
      optional: true,
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The project name search should be an exact match",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      spaceId,
      name,
      exactMatch,
    } = this;

    if (!spaceId && !name) {
      throw new ConfigurationError("Must enter `spaceId` or `name`.");
    }

    const data = {};

    if (spaceId) {
      data.itemIds = [
        spaceId,
      ];
    }

    if (name && exactMatch) {
      data.filters = [
        {
          propertyName: "name",
          operation: "EQ",
          value: name,
        },
      ];
    }

    const { data: { items: projects } } = await this.onedesk.searchSpaces({
      data,
      $,
    });

    let results = [];
    for (const projectId of projects) {
      const { data: projectWithData } = await this.onedesk.getSpace({
        data: {
          id: projectId,
        },
        $,
      });
      results.push(projectWithData);
    }

    if (name && !exactMatch) {
      const lowerCaseName = name.toLowerCase();
      results = results.filter((project) =>
        project.name.toLowerCase().includes(lowerCaseName));
    }

    $.export("$summary", `Found ${results.length} matching project(s).`);

    return results;
  },
};
