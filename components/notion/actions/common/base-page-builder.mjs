import { markdownToBlocks } from "@tryfabric/martian";
import {
  NOTION_DATA_SOURCE_META,
  NOTION_PAGE_META,
} from "../../common/notion-meta-properties.mjs";
import NOTION_META from "../../common/notion-meta-selection.mjs";
import NOTION_PAGE_PROPERTIES from "../../common/notion-page-properties.mjs";
import {
  createPage, createNotionBuilder,
} from "notion-helper";
import { ConfigurationError } from "@pipedream/platform";

export default {
  methods: {
    /**
     * Creates additional props for page properties and the selected block children
     * @param properties - The selected (data source) properties from the page obtained from Notion
     * @param meta - The selected meta properties
     * @param blocks - The selected block children from the workflow UI
     * @returns additional props
     */
    buildAdditionalProps({
      properties = {},
      meta = [],
    }) {
      const propertyProps = this._buildPropertyProps(properties);

      const metaProps = meta.reduce((props, metaType) => ({
        ...props,
        ...NOTION_META[metaType].additionalProps,
      }), {});

      return {
        ...metaProps,
        ...propertyProps,
      };
    },
    /**
     * Builds the additional prop description
     * @param type - Notion property type
     * @param example - A text example for the description
     * @returns prop description
     */
    _buildPropDescription(type, example) {
      const typeName = type.replace(/_/g, "-");
      const description = `The type of this property is \`${type}\`. [See ${type} type documentation here](https://developers.notion.com/reference/property-object#${typeName}).`;
      const descriptionExample = example
        ? `e.g. ${example}.`
        : "";
      return `${description} ${descriptionExample}`;
    },
    /**
     * Builds props for each Notion Page Property
     * @param properties - Properties from the selected page obtained from Notion
     * @returns page property props
     */
    _buildPropertyProps(properties = {}) {
      const props = {};
      for (const propertyName in properties) {
        const property = properties[propertyName];
        const propData = NOTION_PAGE_PROPERTIES[property.type];

        if (!propData) continue;

        props[propertyName] = {
          type: propData.type,
          label: propertyName,
          description: this._buildPropDescription(property.type, propData.example),
          options: propData.options(property),
          optional: true,
        };
      }
      return props;
    },
    /**
     * Select props that were inputted by the user through the workflow UI and are Notion Page
     * Properties
     * @param properties - Properties from the selected page obtained from Notion
     * @returns the selected props inputted by the user with the following attributes:
     *            - type: the Notion property type used in notion-page-properties.mjs
     *            - label: the property ID for API calls
     *              (was property name before data source migration)
     *            - value: the property value inputted by the user
     */
    _filterProps(properties = {}) {
      return Object.keys(properties)
        .filter((property) => this[property] != null
          || (this.properties && this.properties[property]))
        .map((property) => ({
          type: properties[property]?.type ?? property,
          label: properties[property]?.id || property,
          value: this[property] || this.properties?.[property],
          name: properties[property]?.name || property,
        }));
    },
    /**
     * Converts properties inputted by the user to Notion format
     * @param properties - properties inputted by the user
     * @param NOTION_CONVERTER - Notion defined objects that contain convertToNotion() function
     * @returns the Notion properties in Notion format
     */
    _convertPropertiesToNotion(properties = [], NOTION_CONVERTER = {}) {
      const notionProperties = {};
      for (const property of properties) {
        // If the property value is already in Notion format, use it directly
        if (this._isAlreadyNotionFormat(property.value, property.type)) {
          notionProperties[property.label] = property.value;
        } else {
          // Otherwise, convert using the appropriate converter
          const notionProperty = NOTION_CONVERTER[property.type];
          try {
            notionProperties[property.label] = notionProperty?.convertToNotion(property);
          } catch {
            throw new ConfigurationError(`Error converting property \`${property.name}\` to Notion format. Must be of type \`${NOTION_CONVERTER[property.type]?.type}\`.`);
          }
        }
      }
      return notionProperties;
    },
    /**
     * Builds page meta properties (parent, icon, cover, archived) from a parent data source
     * Uses the property label as its type to be able to select in notion-meta-properties.mjs
     * @param properties - list of Notion page properties inputted by the user
     * @returns the meta properties in Notion format inputted by the user
     */
    _buildNotionDataSourceMeta(properties = []) {
      properties.forEach((property) => property.type = property.label);
      return this._convertPropertiesToNotion(properties, NOTION_DATA_SOURCE_META);
    },
    /**
     * Builds page meta properties (parent, icon, cover, archived) from a parent page
     * Uses the property label as its type to be able to select in notion-meta-properties.mjs
     * @param properties - list of Notion page properties inputted by the user
     * @returns the meta properties in Notion format inputted by the user
     */
    _buildNotionPageMeta(properties = []) {
      properties.forEach((property) => property.type = property.label);
      return this._convertPropertiesToNotion(properties, NOTION_PAGE_META);
    },
    /**
     * Builds page properties from a parent data source/page
     * @param properties - list of Notion page properties inputted by the user
     * @returns the properties in Notion format inputted by the user
     */
    _buildNotionPageProperties(properties = []) {
      return this._convertPropertiesToNotion(properties, NOTION_PAGE_PROPERTIES);
    },
    /**
     * Builds the page meta inputted by the user in Notion format from a parent data source
     * @param parentDataSource - the parent data source that contains the meta properties
     * @returns the meta properties in Notion format
     */
    buildDataSourceMeta(parentDataSource) {
      const filteredMeta = this._filterProps(parentDataSource);
      return this._buildNotionDataSourceMeta(filteredMeta);
    },
    /**
     * Builds the page meta inputted by the user in Notion format from a parent page
     * @param parentPage - the parent page that contains the meta properties
     * @returns the meta properties in Notion format
     */
    buildPageMeta(parentPage) {
      const filteredMeta = this._filterProps(parentPage);
      return this._buildNotionPageMeta(filteredMeta);
    },
    /**
     * Builds the page properties inputted by the user in Notion format from a parent page
     * @param parentPage - the parent page that contains the properties
     * @returns the page properties in Notion format
     */
    buildPageProperties(parentProperties) {
      const filteredProperties = this._filterProps(parentProperties);
      return this._buildNotionPageProperties(filteredProperties);
    },
    /**
     * Checks if a property value is already in Notion format
     * @param value - the property value to check
     * @returns true if already in Notion format, false otherwise
     */
    _isAlreadyNotionFormat(value) {
      if (!value || typeof value !== "object") return false;

      // Check for common Notion property structures
      const notionKeys = [
        "title",
        "rich_text",
        "number",
        "select",
        "multi_select",
        "date",
        "people",
        "files",
        "checkbox",
        "url",
        "email",
        "phone_number",
        "relation",
      ];
      return notionKeys.some((key) => key in value);
    },
    /**
     * Creates the block children inputted by the user in Notion format
     * @returns the block children in Notion format
     */
    createBlocks(pageContent) {
      return markdownToBlocks(pageContent);
    },
    isSupportedVideoType(url) {
      if (!url) {
        return false;
      }
      const supportedTypes = [
        ".mkv",
        ".flv",
        ".gifv",
        ".avi",
        ".mov",
        ".qt",
        ".wmv",
        ".asf",
        ".amv",
        ".mp4",
        ".m4v",
        ".mpeg",
        ".mpv",
        ".mpg",
        ".f4v",
      ];
      const extension = url.split(".").pop();
      return supportedTypes.includes(extension);
    },
    // creating a new file object is not currently supported by the API
    // https://developers.notion.com/reference/file-object
    isFile(block) {
      return (block?.type === "file");
    },
    // returns false if the child block is a video of an unsupported type,
    // an image file, or a column-list with less than 2 children
    notValid(child, c) {
      return (
        (child.type === "video" && !this.isSupportedVideoType(child.video?.external?.url))
        || (child.type === "image" && this.isFile(child.image))
        || (child.type === "column_list" && c.length < 2));
    },
    childPageToLink(block) {
      return {
        object: "block",
        type: "link_to_page",
        link_to_page: {
          type: "page_id",
          page_id: block.id,
        },
      };
    },
    childDataSourceToLink(block) {
      return {
        object: "block",
        type: "link_to_page",
        link_to_page: {
          type: "data_source_id",
          data_source_id: block.id,
        },
      };
    },
    /**
     * Formats the children of an existing block for creating/appending
     * to a new page/block
     */
    async formatChildBlocks(block) {
      const children = block.children;
      if (!block.has_children) {
        return [];
      }

      (await Promise.all(children.map((child) => this.formatChildBlocks(child))))
        .forEach((c, i) => {
          const child = children[i];
          if (child.type === "child_page") {
            // convert child pages to links
            children[i] = this.childPageToLink(child);
          } else if (child.type === "child_data_source") {
            // convert child data sources to links
            children[i] = this.childDataSourceToLink(child);
          } else {
            if (this.notValid(child, c)) {
              children[i] = undefined;
            } else {
              children[i] = {
                object: "block",
                type: child.type,
                [child.type]: child[child.type],
              };

              if (c.length > 0) {
                children[i][child.type].children = c;
              } else if (Object.keys(children[i][child.type]).length === 0) {
                // block has no children and no content
                children[i] = undefined;
              }
            }
          }
        });
      return children.filter((child) => child !== undefined);
    },
    async buildPageFromDataSource({
      pageContent, parentDataSourceId, parentPageId, properties = [], icon, cover,
    }) {
      let pageBlocks = [];
      if (pageContent && pageContent.trim()) {
        try {
          pageBlocks = markdownToBlocks(pageContent);
        } catch (error) {
          throw new ConfigurationError(`Failed to convert Markdown content to Notion blocks: ${error.message}`);
        }
      }

      // Build the Notion page using notion-helper
      let pageBuilder = createNotionBuilder({
        limitChildren: false,
        limitNesting: false,
        allowBlankParagraphs: true,
      });
      if (parentDataSourceId) {
        pageBuilder = pageBuilder.parentDataSource(parentDataSourceId);
      }
      if (parentPageId) {
        pageBuilder = pageBuilder.parentPage(parentPageId);
      }

      for (const property of properties) {
        const propertyTypeCamelCase = property.type.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        pageBuilder = pageBuilder[propertyTypeCamelCase](property.label, property.value);
      }

      if (icon) {
        pageBuilder = pageBuilder.icon(icon);
      }

      if (cover) {
        pageBuilder = pageBuilder.cover(cover);
      }

      if (pageBlocks.length > 0) {
        pageBuilder = pageBuilder.loop(
          (page, block) => {
            return page.addExistingBlock(block);
          },
          pageBlocks,
        );
      }

      const page = pageBuilder.build();
      const response = await createPage({
        client: await this.notion._getNotionClient(),
        data: page.content,
      });
      return response.apiResponse;
    },
  },
};
