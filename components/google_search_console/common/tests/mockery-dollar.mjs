// This is just mockery for test runs. Imitates $ runtime.
export default {
  $: {
    export: (a, b) => console.log(a, b),
  },
};
