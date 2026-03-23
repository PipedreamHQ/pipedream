import { allOptional } from "../../common/action-schema.mjs";

/**
 * ServiceM8 job category create/update body fields.
 * Aligned with [Create categories](https://developer.servicem8.com/reference/createcategories)
 * and [Update categories](https://developer.servicem8.com/reference/updatecategories).
 */
export const categoryCreateFields = [
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    description:
      "Job category name (required by API). Used to classify and organize jobs.",
  },
  {
    prop: "colour",
    api: "colour",
    type: "string",
    label: "Colour",
    optional: true,
    description:
      "Hex colour (6 characters 0-9a-f) for the dispatch board and calendar.",
  },
];

export const categoryUpdateFields = allOptional(categoryCreateFields);
