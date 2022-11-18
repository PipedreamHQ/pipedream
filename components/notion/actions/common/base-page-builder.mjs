import { markdownToBlocks } from "@tryfabric/martian";
import {
  NOTION_DATABASE_META,
  NOTION_PAGE_META,
} from "../../common/notion-meta-properties.mjs";
import NOTION_META from "../../common/notion-meta-selection.mjs";
import NOTION_PAGE_PROPERTIES from "../../common/notion-page-properties.mjs";

export default {
  methods: {
    /**
     * Creates additional props for page properties and the selected block children
     * @param properties - The selected (database) properties from the page obtained from Notion
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
      const description = `The type of this property is \`${type}\`. [See ${type} type docs here](https://developers.notion.com/reference/property-object#${type}-configuration).`;
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
     *            - label: the page's property name
     *            - value: the property value inputted by the user
     */
    _filterProps(properties = {}) {
      return Object.keys(properties)
        .filter((property) => this[property] != null)
        .map((property) => ({
          type: properties[property]?.type ?? property,
          label: property,
          value: this[property],
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
        const notionProperty = NOTION_CONVERTER[property.type];
        notionProperties[property.label] = notionProperty?.convertToNotion(property);
      }
      return notionProperties;
    },
    /**
     * Builds page meta properties (parent, icon, cover, archived) from a parent database
     * Uses the property label as its type to be able to select in notion-meta-properties.mjs
     * @param properties - list of Notion page properties inputted by the user
     * @returns the meta properties in Notion format inputted by the user
     */
    _buildNotionDatabaseMeta(properties = []) {
      properties.forEach((property) => property.type = property.label);
      return this._convertPropertiesToNotion(properties, NOTION_DATABASE_META);
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
     * Builds page properties from a parent database/page
     * @param properties - list of Notion page properties inputted by the user
     * @returns the properties in Notion format inputted by the user
     */
    _buildNotionPageProperties(properties = []) {
      return this._convertPropertiesToNotion(properties, NOTION_PAGE_PROPERTIES);
    },
    /**
     * Builds the page meta inputted by the user in Notion format from a parent database
     * @param parentDatabase - the parent database that contains the meta properties
     * @returns the meta properties in Notion format
     */
    buildDatabaseMeta(parentDatabase) {
      const filteredMeta = this._filterProps(parentDatabase);
      return this._buildNotionDatabaseMeta(filteredMeta);
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
    childDatabaseToLink(block) {
      return {
        object: "block",
        type: "link_to_page",
        link_to_page: {
          type: "database_id",
          database_id: block.id,
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
          } else if (child.type === "child_database") {
            // convert child databases to links
            children[i] = this.childDatabaseToLink(child);
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
  },
};
