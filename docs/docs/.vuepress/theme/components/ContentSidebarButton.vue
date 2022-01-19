<template>
  <div class="content-sidebar-button" @click="$emit('toggle-content-sidebar')">
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  </div>
</template>

<style lang="stylus">
.content-sidebar-button
  cursor pointer
  display none
  width 1.25rem
  height 1.25rem
  position absolute
  padding 0.6rem
  top 0.6rem
  right 1rem
  .icon
    display block
    width 1.25rem
    height 1.25rem

@media (max-width: $MQMobile)
  .content-sidebar-button
    display block
</style>
