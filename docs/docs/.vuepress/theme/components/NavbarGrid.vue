
<script setup lang="ts">
import AutoLink from "@theme/AutoLink.vue";
import DropdownTransition from "@theme/DropdownTransition.vue";
import workflow from '../components/svgs/workflow.vue';
import trigger from '../components/svgs/trigger.vue'
import { computed, ref, toRefs, watch } from "vue";
import type { PropType } from "vue";
import { useRoute } from "vue-router";
import type {
  NavbarItem,
  ResolvedNavbarItem,
} from "@vuepress/theme-default/lib/shared";

const props = defineProps({
  item: {
    type: Object as PropType<Exclude<ResolvedNavbarItem, NavbarItem>>,
    required: true,
  },
});

const { item } = toRefs(props);
console.log(item.grid);

const dropdownAriaLabel = computed(
  () => item.value.ariaLabel || item.value.text
);

const open = ref(false);
const route = useRoute();
watch(
  () => route.path,
  () => {
    open.value = false;
  }
);

/**
 * Open the dropdown when user tab and click from keyboard.
 *
 * Use event.detail to detect tab and click from keyboard.
 * The Tab + Click is UIEvent > KeyboardEvent, so the detail is 0.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
 */
const handleDropdown = (e): void => {
  const isTriggerByTab = e.detail === 0;
  if (isTriggerByTab) {
    open.value = !open.value;
  } else {
    open.value = false;
  }
};

const isLastItemOfArray = (item: unknown, arr: unknown[]): boolean =>
  arr[arr.length - 1] === item;
</script>

<template>
  <div class="navbar-dropdown-wrapper" :class="{ open }" @blur="open = !open">
    <button
      class="navbar-dropdown-title"
      type="button"
      :aria-label="dropdownAriaLabel"
      @click="open = !open"
    >
      <span class="title">{{ item.text }}</span>
      <span class="arrow" :class="open ? 'down' : 'right'" />
    </button>

    <button
      class="navbar-dropdown-title-mobile"
      type="button"
      :aria-label="dropdownAriaLabel"
      @click="open = !open"
    >
      <span class="title">{{ item.text }}</span>
      <span class="arrow" :class="open ? 'down' : 'right'" />
    </button>

    <!-- <DropdownTransition> -->
    <div
      v-show="open"
      class="
        navbar-grid
        hover:block
        absolute
        right-0
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
          shadow-lg
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
              items-start
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
              <component :is="child.icon"></component>
            </div>
            <div class="ml-3">
              <p class="font-semibold">{{ child.title }}</p>
              <p class="text-sm font-light text-gray-600">
                {{ child.subtitle }}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- <li
          v-for="child in item.grid"
          :key="child.text"
          class="navbar-dropdown-item"
        >
          <AutoLink
            :item="child"
            @focusout="isLastItemOfArray(child, item.grid) && (open = false)"
          />
        </li>
      </ul> -->
    <!-- </DropdownTransition> -->
  </div>
</template>
