import googleClassroom from "../../google_classroom.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    googleClassroom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    courseStates: {
      propDefinition: [
        googleClassroom,
        "courseStates",
      ],
    },
    course: {
      propDefinition: [
        googleClassroom,
        "course",
        (c) => ({
          courseStates: c.courseStates,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const { courseWork } = await this.googleClassroom.listCoursework({
        ...this.getParams(),
        pageSize: 25,
      });
      let maxUpdatedTime = 0;
      for (const assignment of courseWork.reverse()) {
        this.emitIfRelevant(assignment);

        const updated = Date.parse(assignment.updateTime);
        if (updated > maxUpdatedTime) {
          maxUpdatedTime = updated;
        }
      }
      this._setAfter(maxUpdatedTime);
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after");
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    isRelevant() {
      return true;
    },
    getParams() {
      return {
        courseId: this.course,
        courseWorkStates: this.courseStates,
      };
    },
    emitIfRelevant(item, after) {
      if (this.isRelevant(item, after)) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
  },
  async run() {
    const after = this._getAfter();
    let maxUpdatedTime = after;
    const params = this.getParams();
    let done = false;
    do {
      const {
        courseWork, nextPageToken,
      } = await this.googleClassroom.listCoursework(params);
      params.pageToken = nextPageToken;

      for (const assignment of courseWork) {
        this.emitIfRelevant(assignment, after);

        const updated = Date.parse(assignment.updateTime);
        if (updated > maxUpdatedTime) {
          maxUpdatedTime = updated;
        }
        if (updated <= after) {
          done = true;
          break;
        }
      }
    } while (params.pageToken && !done);
    this._setAfter(maxUpdatedTime);
  },
};
