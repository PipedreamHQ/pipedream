import teamioo from "../../teamioo.app.mjs";

export default {
  key: "teamioo-create-bookmark",
  name: "Create Bookmark",
  description: "Saves a website URL to the bookmarks. The 'url' and 'bookmark_type' are required. 'bookmark_type' can either be 'personal' or 'group'. An optional prop 'title' can be included to give the bookmark a custom name. [See the documentation](https://demo.teamioo.com/teamiooapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamioo,
    bookmarkType: {
      type: "string",
      label: "Event Type",
      description: "The type of the bookmark, either 'personal' or 'group'",
      options: [
        "personal",
        "group",
      ],
      reloadProps: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to bookmark",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Uses bookmared website's title if omitted.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Bookmark comment (markdown supported).",
      optional: true,
    },
    taggedUsers: {
      propDefinition: [
        teamioo,
        "userId",
      ],
      type: "string[]",
      label: "Tagged Users",
      description: "Tagged users.",
      optional: true,
    },
    tags: {
      propDefinition: [
        teamioo,
        "tags",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.bookmarkType === "group") {
      props.groupId = {
        type: "string",
        label: "Group ID",
        description: "The ID of the group.",
        options: async () => {
          const groups = await this.teamioo.listGroups();

          return groups.map(({
            displayName: label, _id: value,
          }) => ({
            label,
            value,
          }));
        },
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      teamioo,
      bookmarkType,
      groupId,
      ...data
    } = this;

    const response = await teamioo.createBookmark({
      $,
      data: {
        groupId: (bookmarkType === "personal")
          ? "personal"
          : groupId,
        ...data,
      },
    });

    $.export("$summary", `Successfully saved the bookmark with Id: ${response.newDocId}`);
    return response;
  },
};
