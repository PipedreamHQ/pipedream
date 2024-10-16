import { axios } from "@pipedream/platform";
import teachNGo from "../../teach_n_go.app.mjs";

export default {
  key: "teach_n_go-new-class",
  name: "New Class Created",
  description: "Emit a new event when a class is created. [See the documentation](https://intercom.help/teach-n-go/en/articles/8727904-api-endpoints)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    teachNGo,
    db: "$.service.db",
    courseTitle: {
      propDefinition: [
        teachNGo,
        "courseTitle",
      ],
    },
    dateAndTime: {
      propDefinition: [
        teachNGo,
        "dateAndTime",
      ],
    },
    classDescription: {
      propDefinition: [
        teachNGo,
        "classDescription",
      ],
      optional: true,
    },
    teacher: {
      propDefinition: [
        teachNGo,
        "teacher",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const classes = await this.fetchClasses();
      for (const classData of classes.slice(-50).reverse()) {
        this.$emit(classData, {
          id: classData.id,
          summary: `New Class: ${classData.title}`,
          ts: Date.parse(classData.dateAndTime),
        });
      }
    },
    async activate() {
      // Activation logic if any
    },
    async deactivate() {
      // Deactivation logic if any
    },
  },
  methods: {
    async fetchClasses() {
      return this.teachNGo._makeRequest({
        path: "/classes",
      });
    },
    async emitNewClassEvent() {
      const courseTitle = this.courseTitle;
      const dateAndTime = this.dateAndTime;
      const classDescription = this.classDescription || null;
      const teacher = this.teacher || null;

      const classData = {
        courseTitle,
        dateAndTime,
        classDescription,
        teacher,
      };

      this.$emit(classData, {
        summary: `New Class: ${courseTitle}`,
        ts: new Date().getTime(),
      });
    },
  },
  async run() {
    const classes = await this.fetchClasses();
    for (const classData of classes) {
      this.$emit(classData, {
        id: classData.id,
        summary: `New Class: ${classData.title}`,
        ts: Date.parse(classData.dateAndTime),
      });
    }
  },
};
