/* eslint-disable no-case-declarations */
import pick from "lodash-es/pick.js";
import NOTION_ICONS from "../../common/notion-icons.mjs";
import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-page-from-database",
  name: "Create Page from Data Source",
  description: "Create a page from a data source. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "2.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    parentDataSource: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
      label: "Parent Data Source ID",
      description: "Select a parent data source or provide a data source ID",
    },
    templateType: {
      type: "string",
      label: "Template Type",
      description: "The type of template to use for the page. [See the documentation](https://developers.notion.com/docs/creating-pages-from-templates) for more information.",
      options: [
        {
          label: "No template. Provided children and properties are immediately applied.",
          value: "none",
        },
        {
          label: "Applies the data source's default template to the newly created page. `children` cannot be specified in the create page request.",
          value: "default",
        },
        {
          label: "Indicates which exact template to apply to the newly created page. children cannot be specified in the create page request.",
          value: "template_id",
        },
      ],
      reloadProps: true,
    },
    propertyTypes: {
      propDefinition: [
        notion,
        "propertyTypes",
        (c) => ({
          parentId: c.parentDataSource,
          parentType: "data_source",
        }),
      ],
      description: "Select one or more page properties. Willl override properties set in the `Properties` prop below.",
      reloadProps: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "The values of the page's properties. The schema must match the parent data source's properties. [See the documentation](https://developers.notion.com/reference/property-object) for information on various property types. Example: `{ \"Tags\": [ \"tag1\" ], \"Link\": \"https://pipedream.com\" }`",
      optional: true,
    },
    icon: {
      type: "string",
      label: "Icon Emoji",
      description: "Page Icon [Emoji](https://developers.notion.com/reference/emoji-object)",
      options: NOTION_ICONS,
      optional: true,
    },
    cover: {
      type: "string",
      label: "Cover URL",
      description: "Cover [External URL](https://developers.notion.com/reference/file-object#external-file-objects)",
      optional: true,
    },
    pageContent: {
      propDefinition: [
        notion,
        "pageContent",
      ],
    },
  },
  async additionalProps() {
    switch (this.templateType) {
    case "none":
      const { properties } = await this.notion.retrieveDataSource(this.parentDataSource);
      const selectedProperties = pick(properties, this.propertyTypes);
      return {
        alert: {
          type: "alert",
          alertType: "info",
          content: "This action will create an empty page by default. To add content, use the `Page Content` prop below.",
        },
        ...this.buildAdditionalProps({
          properties: selectedProperties,
        }),
      };
    case "default":
      return {
        alert: {
          type: "alert",
          alertType: "info",
          content: "This action will create a page using the data source's default template. Using the `Page Content` prop below will `not` apply to the page.",
        },
      };
    case "template_id":
      return {
        templateId: {
          type: "string",
          label: "Template ID",
          description: "The ID of the template to use for the page. [See the documentation](https://developers.notion.com/docs/creating-pages-from-templates) for more information.",
          options: async({ prevContext }) => {
            const {
              templates, next_cursor: nCursor,
            } = await this.notion.listTemplates({
              data_source_id: this.parentDataSource,
              start_cursor: prevContext?.nCursor,
            });
            return {
              options: templates.map(({
                name: label, id: value,
              }) => ({
                label,
                value,
              })),
              context: {
                nCursor,
              },
            };
          },
        },
        alert: {
          type: "alert",
          alertType: "info",
          content: "This action will create a page using the selected template. Using the `Page Content` prop below will `not` apply to the page.",
        },
      };
    }
  },
  methods: {
    ...base.methods,
    /**
     * Builds a page from a parent data source
     * @param parentDataSource - the parent data source
     * @returns the constructed page in Notion format
     */
    buildPage(parentDataSource) {
      const meta = this.buildDataSourceMeta(parentDataSource);
      this.properties = utils.parseObject(this.properties);
      const properties = this.buildPageProperties(parentDataSource.properties);
      const children = this.createBlocks(this.pageContent);
      return {
        ...meta,
        properties,
        children,
      };
    },
  },
  async run({ $ }) {
    const MAX_BLOCKS = 100;
    const parentPage = await this.notion.retrieveDataSource(this.parentDataSource);
    const {
      children, ...page
    } = this.buildPage(parentPage);
    const data = this.templateId
      ? {
        template: {
          type: this.templateType,
          template_id: this.templateId,
        },
      }
      : {
        children: children.slice(0, MAX_BLOCKS),
      };
    const response = await this.notion.createPage({
      ...data,
      ...page,
      parent: {
        data_source_id: this.parentDataSource,
      },
    });
    let remainingBlocks = children.slice(MAX_BLOCKS);
    while (remainingBlocks.length > 0) {
      await this.notion.appendBlock(response.id, remainingBlocks.slice(0, MAX_BLOCKS));
      remainingBlocks = remainingBlocks.slice(MAX_BLOCKS);
    }
    $.export("$summary", "Created page successfully");
    return response;
  },
};
