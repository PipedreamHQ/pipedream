import freshlearn from "../../freshlearn.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "freshlearn-new-product-bundle-enrollment",
  name: "New Product Bundle Enrollment",
  description: "Emit new event when there's a new product bundle enrollment",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    freshlearn,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    memberId: {
      propDefinition: [
        freshlearn,
        "memberId",
      ],
    },
    courseId: {
      propDefinition: [
        freshlearn,
        "courseId",
      ],
    },
    productBundleId: {
      propDefinition: [
        freshlearn,
        "productBundleId",
      ],
    },
    memberDetails: {
      propDefinition: [
        freshlearn,
        "memberDetails",
      ],
    },
  },
  methods: {
    _getLastEnrollmentId() {
      return this.db.get("lastEnrollmentId") || 0;
    },
    _setLastEnrollmentId(id) {
      this.db.set("lastEnrollmentId", id);
    },
  },
  async run() {
    const lastEnrollmentId = this._getLastEnrollmentId();
    const enrollments = await this.freshlearn.emitNewProductBundleEnrollmentEvent();

    for (const enrollment of enrollments) {
      if (enrollment.enrollmentId > lastEnrollmentId) {
        this.$emit(enrollment, {
          id: enrollment.enrollmentId,
          summary: `New Product Bundle Enrollment: ${enrollment.memberEmail}`,
          ts: Date.now(),
        });
        this._setLastEnrollmentId(enrollment.enrollmentId);
      }
    }
  },
};
