import { gql } from "graphql-request";

export default {
  createPod: gql`
    mutation createPod($input: PodRentInterruptableInput!) {
      podRentInterruptable(input: $input) {
        id
      }
    }
  `,
  startPod: gql`
    mutation startPod($input: PodBidResumeInput!) {
      podResume(input: $input) {
        id
      }
    }
  `,
  stopPod: gql`
    mutation stopPod($input: PodStopInput!) {
      podStop(input: $input) {
        id
      }
    }
  `,
};
