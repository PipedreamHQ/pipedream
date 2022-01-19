<template>
  <svg
    class="sidebar-arrow"
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.484 28.284"
    @click.prevent="$emit('toggle')"
  >
    <g transform="translate(-229 -126.358)">
      <rect fill="currentColor" width="35" height="5" rx="2" transform="translate(229 151.107) rotate(-45)"/>
      <rect fill="currentColor" width="35" height="5" rx="2" transform="translate(274.949 154.642) rotate(-135)"/>
    </g>
  </svg>
</template>

<style lang="stylus">
.sidebar-heading
  .sidebar-arrow
    position absolute
    right 0.5rem
    width: 1rem
    height: 1rem
    transition transform .15s ease
    &.right
      transform: rotate(90deg)
    &.down
      transform: rotate(180deg)
</style>
