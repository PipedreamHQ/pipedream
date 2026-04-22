import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-add-content-item-to-favorites",
  name: "Add a Content Item to a User's Favorites",
  description: "Adds a content item (activity, resource, or subtype) to the user's list of favorites. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    courseId: {
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
    sectionId: {
      propDefinition: [
        moodle,
        "sectionId",
        ({ courseId }) => ({
          courseId,
        }),
      ],
    },
    contentItemId: {
      propDefinition: [
        moodle,
        "contentItemId",
        ({
          courseId, sectionId,
        }) => ({
          courseId,
          sectionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { content_items: contentItems } = await this.moodle.getCourseContentItems({
      $,
      params: {
        courseid: this.courseId,
        sectionid: this.sectionId,
      },
    });
    const contentItem = contentItems.find(({ id }) => id == this.contentItemId);
    const componentname = contentItem?.componentname;
    const response = await this.moodle.addContentItemToFavorites({
      $,
      params: {
        componentname,
        contentitemid: this.contentItemId,
      },
    });
    $.export("$summary", `Successfully added content item (${this.contentItemId}) to favorites`);
    return response;
  },
};
