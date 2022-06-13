import utils from "./utils.mjs";

/**
 * Notion Page Properties - https://developers.notion.com/reference/property-value-object
 *
 * type: Pipedream corresponding type
 * example: helpful text to show in prop description
 * options: the options available for selection in the Notion Property
 * convertToNotion: converts the prop values to send to the Notion API
 */
const NOTION_PAGE_PROPERTIES = {
  title: {
    type: "string",
    example: "New Beauty Title",
    options: () => undefined,
    convertToNotion: (property) => ({
      title: utils.buildTextProperty(property.value),
    }),
  },
  rich_text: {
    type: "string",
    example: "A beauty text value",
    options: () => undefined,
    convertToNotion: (property) => ({
      rich_text: utils.buildTextProperty(property.value),
    }),
  },
  number: {
    type: "integer",
    example: "59",
    options: () => undefined,
    convertToNotion: (property) => ({
      number: property.value,
    }),
  },
  select: {
    type: "string",
    example: "3f806034-9c48-4519-871e-60c9c32d73d8",
    options: (property) => property.select.options.map((option) => option.name),
    convertToNotion: (property) => ({
      select: {
        name: property.value,
      },
    }),
  },
  multi_select: {
    type: "string[]",
    example: "[\"Tasks\", \"Sprints\"]",
    options: (property) => property.multi_select.options?.map((option) => option.name)
      ?? property.multi_select.map((option) => option.name),
    convertToNotion: (property) => ({
      multi_select: property.value.map((name) => ({
        name,
      })),
    }),
  },
  date: {
    type: "string",
    example: "2022-05-15T18:47:00.000Z",
    options: () => undefined,
    convertToNotion: (property) => ({
      date: {
        start: property.value,
      },
    }),
  },
  people: {
    type: "string[]",
    example: "[\"16799fa1-f1f7-437e-8a12-5eb2eedc1b05\"]",
    options: () => undefined,
    convertToNotion: (property) => ({
      people: property.value.map((id) => ({
        id,
      })),
    }),
  },
  files: {
    type: "string[]",
    example: "[\"https://site.com/image1.png\", \"https://site.com/image2.png\"]",
    options: () => undefined,
    convertToNotion: (property) => ({
      files: property.value.map((url) => ({
        name: url.slice(0, 99),
        type: "external",
        external: {
          url,
        },
      })),
    }),
  },
  checkbox: {
    type: "boolean",
    options: () => undefined,
    convertToNotion: (property) => ({
      checkbox: property.value,
    }),
  },
  url: {
    type: "string",
    example: "https://pipedream.com",
    options: () => undefined,
    convertToNotion: (property) => ({
      url: property.value,
    }),
  },
  email: {
    type: "string",
    example: "example@pipedream.com",
    options: () => undefined,
    convertToNotion: (property) => ({
      email: property.value,
    }),
  },
  phone_number: {
    type: "string",
    example: "999-999-9999",
    options: () => undefined,
    convertToNotion: (property) => ({
      phone_number: property.value,
    }),
  },
  relation: {
    type: "string[]",
    example: "[\"cd11c7df-d793-49cf-9501-70c7ba59950d\", \"532c3f83-51c0-4789-b53c-f05461582f73\"]",
    options: () => undefined,
    convertToNotion: (property) => ({
      relation: property.value.map((id) => ({
        id,
      })),
    }),
  },
};

export default NOTION_PAGE_PROPERTIES;
