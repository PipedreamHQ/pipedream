<style lang="stylus"></style>

<template>
  <div class="m-auto">
    <div class="m-auto my-8">
      <h2 class="text-xl">Search PyPI Mappings</h2>
      <p>
        Alternatively, search for the PyPI package you're intending to use, and
        use the shorthand <code>import module</code> shortcut to import them
        into a Python step.
      </p>
      <div
        class="
          bg-gray-100
          py-8
          px-4
          w-full
          border-l-8 border-red-500 border-solid
        "
      >
        <span>
          Using
          <a href="/docs/code/python/import-mappings/#using-magic-comments"
            >magic comments</a
          >
          to import Python packages is the recommended approach to adding
          packages with different exported module names.
        </span>
      </div>
      <label class="text-sm font-semibold text-gray-400 my-4"
        >Search for PyPI package</label
      >
      <input
        v-model="query"
        placeholder="PyPI package name"
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
        <th>PyPI Package Name</th>
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
              >PyPI Project

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
      requestedPackage: "",
      errorMessage: "",
      successMessage: "",
      loading: false,
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
    submitPackageRequest() {
      this.successMessage = "";
      this.errorMessage = "";

      fetch("https://eo7sttetfpbyysz.m.pipedream.net", {
        body: JSON.stringify({
          requestedPackage: this.requestedPackage,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          this.successMessage = `Requested support for ${this.requestedPackage}`;
          this.requestedPackage = "";
        })
        .catch(() => {
          this.errorMessage =
            "Unable to request for package, please contact support";
        });
    },
  },
  mounted() {
    this.mappings = Object.entries(rawMappings);
  },
};
</script>

