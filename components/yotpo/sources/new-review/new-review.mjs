import common from '../common/common.mjs'

export default {
  ...common,
  name: "New Review",
  description: "Emit new event on a review is created",
  key: "yotpo-new-review",
  version: '0.0.1',
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(event) {
      console.log(event)

      this.$emit(data, {
        id: event.id,
        summary: `New review created with id ${event.id}`,
        ts: Date.parse(event.createdAt),
      });
    },
    getWebhookEventType() {
      return 'review_create'
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
    },
  },
  // async run(event) {
  //   const id = _get(event, "body.data.id")
  //   const updatedAt = _get(event, "body.data.updated_at")
  //   if (id && updatedAt) {
  //     const dedupeId = `${id}-${updatedAt}`
  //     const flag = _get(event, "body.data.new") ? "" : " [UPDATED]"
  //     const score = _get(event, "body.data.score", "?")
  //     const text = _truncate(he.decode(_get(event, "body.data.title", _get(event, "body.data.content", "- no content -"))))
  //     const summary = `${score} stars:${flag} ${text}`
  //     const ts = moment(updatedAt).valueOf()
  //     this.$emit(event.body, { id: dedupeId, summary, ts })
  //   }
  // },
}
