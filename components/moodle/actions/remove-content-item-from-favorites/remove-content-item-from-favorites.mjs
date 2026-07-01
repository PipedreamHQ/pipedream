import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-remove-content-item-from-favorites",
  name: "Remove a Content Item from Favourites",
  description: "Removes a specific content item from a user's list of favourites in Moodle. [See the documentation](https://moodledev.io/docs/5.2)",
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
    const response = await this.moodle.removeContentItemFromFavorites({
      $,
      params: {
        componentname,
        contentitemid: this.contentItemId,
      },
    });
    $.export("$summary", `Successfully removed content item (${this.contentItemId}) from favourites`);
    return response;
  },
};
