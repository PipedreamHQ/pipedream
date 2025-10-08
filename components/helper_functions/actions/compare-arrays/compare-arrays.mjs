import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-compare-arrays",
  name: "Compare Arrays",
  description: "Get the difference, intersection, union, or symetric difference of two arrays/sets.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helperFunctions,
    array1: {
      type: "string[]",
      label: "Array 1",
      description: "Array to compare to second array",
      default: [],
    },
    array2: {
      type: "string[]",
      label: "Array 2",
      description: "Array to be compared with first array",
      default: [],
    },
    actionType: {
      type: "string",
      label: "Compare Action",
      description: "Type of action to perform on the arrays",
      options: [
        "difference",
        "union",
        "intersection",
        "symmetric difference",
      ],
    },
  },
  methods: {
    getDifference(set1, set2) {
      return new Set([
        ...set1,
      ].filter((x) => !set2.has(x)));
    },
    getIntersection(set1, set2) {
      return new Set([
        ...set1,
      ].filter((x) => set2.has(x)));
    },
    getUnion(set1, set2) {
      for (const elem of set2) {
        set1.add(elem);
      }
      return set1;
    },
    getSymmetricDifference(set1, set2) {
      for (const elem of set2) {
        if (set1.has(elem)) {
          set1.delete(elem);
        } else {
          set1.add(elem);
        }
      }
      return set1;
    },
  },
  run() {
    const set1 = new Set(this.array1);
    const set2 = new Set(this.array2);

    let results;

    switch (this.actionType) {
    case "difference": {
      results = this.getDifference(set1, set2);
      break;
    }
    case "union": {
      results = this.getUnion(set1, set2);
      break;
    }
    case "intersection": {
      results = this.getIntersection(set1, set2);
      break;
    }
    case "symmetric difference": {
      results = this.getSymmetricDifference(set1, set2);
      break;
    }
    default:
      throw new Error(`Unknown action type: ${this.actionType}`);
    }

    return Array.from(results);
  },
};
