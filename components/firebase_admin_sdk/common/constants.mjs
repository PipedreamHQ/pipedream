const DEFAULT_PAGE_SIZE = 20;

// https://firebase.google.com/docs/projects/locations#rtdb-locations
const DATABASE_REGION_OPTIONS = [
  {
    label: "us-central1",
    value: "firebaseio.com",
  },
  {
    label: "europe-west1",
    value: "europe-west1.firebasedatabase.app",
  },
  {
    label: "asia-southeast1",
    value: "asia-southeast1.firebasedatabase.app",
  },
];

export default {
  DEFAULT_PAGE_SIZE,
  DATABASE_REGION_OPTIONS,
};
