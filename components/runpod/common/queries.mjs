import { gql } from "graphql-request";

export default {
  getPod: gql`
    query pod($input: PodFilter) {
      pod(input: $input) {
        lowestBidPriceToResume
        aiApiId
        apiKey
        consumerUserId
        containerDiskInGb
        containerRegistryAuthId
        costMultiplier
        costPerHr
        createdAt
        adjustedCostPerHr
        desiredStatus
        dockerArgs
        dockerId
        env
        gpuCount
        gpuPowerLimitPercent
        gpus {
          ...GpuFragment
        }
        id
        imageName
        lastStatusChange
        locked
        machineId
        memoryInGb
        name
        podType
        port
        ports
        registry {
          ...PodRegistryFragment
        }
        templateId
        uptimeSeconds
        vcpuCount
        version
        volumeEncrypted
        volumeInGb
        volumeKey
        volumeMountPath
        lastStartedAt
        cpuFlavorId
        machineType
        slsVersion
        networkVolumeId
        cpuFlavor {
          ...CpuFlavorFragment
        }
        runtime {
          ...PodRuntimeFragment
        }
        machine {
          ...PodMachineInfoFragment
        }
        latestTelemetry {
          ...PodTelemetryFragment
        }
        endpoint {
          ...EndpointFragment
        }
        networkVolume {
          ...NetworkVolumeFragment
        }
        savingsPlans {
          ...SavingsPlanFragment
        }
      }
    }
  `,
  listPods: gql`
    query listPods {
      myself {
        pods {
          id
          name
        }
      }
    }
  `,
  listGpuTypes: gql`
    query listGpuTypes($input: GpuTypeFilter) {
      gpuTypes(input: $input) {
        id
        displayName
      }
    }
  `,
};
