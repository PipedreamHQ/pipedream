<script>
export default {
  functional: true,
  props: {
    type: {
      type: String,
      default: 'tip'
    },
    text: String,
    vertical: {
      type: String,
      default: 'top'
    }
  },
  render (h, { props, slots }) {
    return h('span', {
      class: ['badge', props.type, props.vertical]
    }, props.text || slots().default)
  }
}
</script>

<style lang="stylus" scoped>
.badge
  display inline-block
  font-size 14px
  font-weight 600
  height 18px
  line-height 18px
  border-radius 3px
  padding 0 20px
  color $tertiary
  margin-right 5px
  background-color $tertiary-ltr
  &.middle
    vertical-align middle
  &.top
    vertical-align top
  &.tip, &.green
    color $success
    background-color $succcess-ltr
  &.error
    color $danger
    background-color $danger-ltr
  &.warning, &.warn, &.yellow
    color $warning
    background-color $warning-ltr
  &.info
    color $primary
    background-color $primary-ltr
  &.light
    background-color $black-ltr
    color $black
</style>
