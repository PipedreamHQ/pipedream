import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-new-course-lesson",
  name: "New Course Lesson",
  description: "Emits an event when a new lesson for a specific course is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    illumidesk,
    courseId: {
      propDefinition: [
        illumidesk,
        "courseId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getCourseId() {
      return this.db.get("courseId") ?? "";
    },
    _setCourseId(courseId) {
      this.db.set("courseId", courseId);
    },
    generateMeta(lesson) {
      const {
        id,
        created_at: ts,
        name,
      } = lesson;
      return {
        id,
        summary: `New Lesson: ${name}`,
        ts: Date.parse(ts),
      };
    },
  },
  hooks: {
    async deploy() {
      const courseId = this._getCourseId();
      if (courseId) {
        const lesson = await this.illumidesk.createCourseLesson({
          courseId,
        });
        this.$emit(lesson, this.generateMeta(lesson));
      }
    },
  },
  async run() {
    const courseId = this._getCourseId();
    if (courseId !== this.courseId) {
      const lesson = await this.illumidesk.createCourseLesson({
        courseId: this.courseId,
      });
      this.$emit(lesson, this.generateMeta(lesson));
      this._setCourseId(this.courseId);
    }
  },
};
