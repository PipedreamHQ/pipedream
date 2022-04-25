<style lang="stylus"></style>

<template>
  <div class="md:w-3/4 m-auto">
    <div
      class="
        bg-gray-100
        py-8
        px-4
        w-full
        border-l-8 border-green-500 border-solid
      "
    >
      <h3 class="text-bold text-xl text-green-500 mb-2">
        Don't see a package listed?
      </h3>
      Request to have a custom package mapping added:
      <form
        class="grid grid-cols-12"
        action="https://eo7sttetfpbyysz.m.pipedream.net"
        method="post"
      >
        <input
          v-model="requested_package"
          placeholder="PyPi package name"
          class="
            my-3
            px-3
            py-3
            placeholder-slate-300
            text-slate-600
            relative
            bg-white
            rounded-l
            text-sm
            border-0
            shadow
            outline-none
            focus:outline-none focus:ring
            w-full
            m-auto
            col-span-10
          "
        />
        <button
          :disabled="!requested_package"
          class="
            bg-green-500
            border-green-500
            text-white
            font-bold
            border-4
            py-3
            my-3
            col-span-2
            rounded-r
            disabled:opacity-50
          "
        >
          Submit
        </button>
      </form>
    </div>
    <div class="m-auto my-8">
      <label class="text-sm font-semibold text-gray-400 my-4"
        >Search for PyPi package</label
      >
      <input
        v-model="query"
        placeholder="PyPi package name"
        class="
          my-3
          px-3
          py-3
          placeholder-slate-300
          text-slate-600
          relative
          bg-white
          rounded
          text-sm
          border-0
          shadow
          outline-none
          focus:outline-none focus:ring
          w-full
          m-auto
        "
      />
    </div>
    <table class="m-auto table w-full">
      <tr>
        <th>PyPi Package Name</th>
        <th>Import into Pipedream with</th>
      </tr>
      <tr v-for="mapping in mappings" :key="mapping[0]">
        <td>
          <span class="font-mono text-lg">{{ mapping[0] }}</span>
          <p>
            <a
              target="_blank"
              class="text-sm external"
              :href="`https://pypi.org/project/${mapping[0]}`"
              >PyPi Project

              <OutboundLink />
            </a>
          </p>
        </td>
        <td>
          <code>import {{ mapping[1] }}</code>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import orderBy from "lodash/orderBy";
import rawMappings from "./python-mappings";

export default {
  name: "PythonMappings",
  data() {
    return {
      mappings: [],
      query: "",
      requested_package: "",
    };
  },
  watch: {
    query(newQuery, oldQuery) {
      this.search(newQuery);
    },
  },
  methods: {
    search(query) {
      if (query === "") {
        this.mappings = Object.entries(rawMappings);
      }

      this.mappings = this.mappings.filter((mapping) =>
        new RegExp(query, "i").test(mapping[0])
      );
    },
  },
  mounted() {
    this.mappings = Object.entries(rawMappings);
  },
};
</script>

