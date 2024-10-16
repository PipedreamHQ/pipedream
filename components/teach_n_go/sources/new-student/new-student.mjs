import teachNGo from "../../teach_n_go.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "teach_n_go-new-student",
  name: "New Student Registration",
  description: "Emit an event when a new student is registered. [See the documentation](https://intercom.help/teach-n-go/en/articles/6807235-new-student-and-class-registration-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    teachNGo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    studentName: {
      propDefinition: [
        teachNGo,
        "studentName",
      ],
    },
    dateOfBirth: {
      propDefinition: [
        teachNGo,
        "dateOfBirth",
      ],
    },
    contactNumber: {
      propDefinition: [
        teachNGo,
        "contactNumber",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        teachNGo,
        "email",
      ],
      optional: true,
    },
  },
  methods: {
    async fetchStudents() {
      return this.teachNGo._makeRequest({
        method: "GET",
        path: "/student",
      });
    },
    emitStudentRegistrationEvent(student) {
      const {
        id, fname, lname, registration_date: registrationDate, date_of_birth: dateOfBirth, email_address: email, mobile_phone: contactNumber,
      } = student;
      const summary = `New Student: ${fname} ${lname}`;
      this.$emit(student, {
        id,
        summary,
        ts: Date.parse(registrationDate),
      });
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") ?? 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  hooks: {
    async deploy() {
      const students = await this.fetchStudents();
      students.slice(-50).forEach(this.emitStudentRegistrationEvent.bind(this));
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const students = await this.fetchStudents();
    let maxTimestamp = lastTimestamp;

    students.forEach((student) => {
      const studentTimestamp = new Date(student.registration_date).getTime();
      if (studentTimestamp > lastTimestamp) {
        this.emitStudentRegistrationEvent(student);
        maxTimestamp = Math.max(maxTimestamp, studentTimestamp);
      }
    });

    this._setLastTimestamp(maxTimestamp);
  },
};
