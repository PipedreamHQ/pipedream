
<script>
import workflowIcon from "./svgs/workflow-icon.vue";
import stepIcon from "./svgs/step-icon.vue";
import triggerIcon from "./svgs/trigger-icon.vue";
import codeIcon from "./svgs/code-icon.vue";
import integrationIcon from "./svgs/integration-icon.vue";
import componentIcon from "./svgs/component-icon.vue";

export default {
  props: {
    item: {
      required: true,
    },
  },

  components: {
    "workflow-icon": workflowIcon,
    "step-icon": stepIcon,
    "trigger-icon": triggerIcon,
    "code-icon": codeIcon,
    "integration-icon": integrationIcon,
    "component-icon": componentIcon,
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {
    dropdownAriaLabel() {
      return this.item?.ariaLabel || this.item?.text;
    },
  },
};
</script>

<template>
  <div class="navbar-dropdown-wrapper" :class="{ open }" @blur="open = !open">
    <button
      class="navbar-dropdown-title font-medium leading-normal"
      type="button"
      :aria-label="dropdownAriaLabel"
      @click="open = !open"
    >
      <span class="title">{{ item.text }}</span>
      <span class="arrow" :class="open ? 'down' : 'right'" />
    </button>

    <div
      v-show="open"
      class="
        navbar-grid
        hover:block
        md:absolute
        w-full
        md:max-w-screen-sm md:w-screen
        mt-2
        origin-top-right
      "
    >
      <div
        class="
          px-2
          pt-2
          pb-4
          bg-white
          rounded-md
          md:shadow-lg
          dark-mode:bg-gray-700
        "
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            v-for="child in item.grid"
            :key="child.title"
            class="
              flex
              row
              items-center
              rounded-lg
              bg-transparent
              p-2
              dark-mode:hover:bg-gray-600
              dark-mode:focus:bg-gray-600
              dark-mode:focus:text-white
              dark-mode:hover:text-white
              dark-mode:text-gray-200
              hover:text-gray-900
              focus:text-gray-900
              hover:bg-gray-200
              focus:bg-gray-200 focus:outline-none focus:shadow-outline
            "
            :href="child.link"
          >
            <div class="bg-green-500 text-white rounded-lg p-3">
              <component :is="child.icon" class="inline-block"></component>
            </div>
            <div class="ml-3">
              <span class="block font-semibold">{{ child.title }}</span>
              <span class="block text-sm font-light text-gray-600 hidden md:block">
                {{ child.subtitle }}
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
