import qntrl from "../../qntrl.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "qntrl-new-job-comment",
  name: "New Comment Posted",
  description: "Emit new event when a comment is posted to a job. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=GetAllComments)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    jobId: {
      propDefinition: [
        qntrl,
        "jobId",
        (({ orgId }) => ({
          orgId,
        })),
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary({ comment }) {
      return `New Comment: "${comment.length > 40
        ? `${comment.slice(0, 40)}...`
        : comment}"`;
    },
    getItems() {
      const {
        orgId, jobId,
      } = this;
      return this.app.listJobComments({
        orgId,
        jobId,
      });
    },
    getItemId(item) {
      return item.comment_id;
    },
  },
};
