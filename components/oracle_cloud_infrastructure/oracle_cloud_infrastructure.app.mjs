import ociCommon from "oci-common";
import ociCore from "oci-core";
import ociObjectStorage from "oci-objectstorage";
import ociDataCatalog from "oci-datacatalog";
import ociIdentity from "oci-identity";
import { createLogger } from "bunyan";

ociCommon.LOG.logger = createLogger({
  name: "Pipedream",
  level: "error",
});

export default {
  type: "app",
  app: "oracle_cloud_infrastructure",
  propDefinitions: {
    compartmentId: {
      type: "string",
      label: "Compartment ID",
      description: "The OCID of the compartment in Oracle Cloud Infrastructure.",
      async options() {
        const compartmentId = this.getCompartmentId();
        const { items } = await this.listCompartments({
          compartmentId,
        });
        const options = items.map(({
          id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
        return [
          {
            label: "root",
            value: compartmentId,
          },
          ...options,
        ];
      },
    },
    namespaceName: {
      type: "string",
      label: "Namespace Name",
      description: "The name of the namespace in Oracle Cloud Infrastructure Object Storage.",
      async options({ catalogId }) {
        const { namespaceCollection: { items } } = await this.listNamespaces({
          catalogId,
        });
        return items.map(({
          key: value,
          displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    bucketName: {
      type: "string",
      label: "Bucket Name",
      description: "The name of the bucket in Oracle Cloud Infrastructure Object Storage.",
      async options({ compartmentId }) {
        const { value: namespaceName } = await this.getNamespace({
          compartmentId,
        });

        const { items } = await this.listBuckets({
          compartmentId,
          namespaceName,
        });
        return items.map(({ name }) => name);
      },
    },
    objectName: {
      type: "string",
      label: "Object Name",
      description: "The name of the object in Oracle Cloud Infrastructure Object Storage.",
      async options({
        compartmentId,
        bucketName,
      }) {
        const { value: namespaceName } = await this.getNamespace({
          compartmentId,
        });

        const { listObjects: { objects } } = await this.listObjects({
          namespaceName,
          bucketName,
        });

        return objects?.map(({ name }) => name);
      },
    },
    putObjectBody: {
      type: "string",
      label: "Content",
      description: "The content of the object to upload to Oracle Cloud Infrastructure Object Storage.",
    },
    instanceId: {
      type: "string",
      label: "Instance ID",
      description: "The OCID of the instance in Oracle Cloud Infrastructure.",
      async options({ compartmentId }) {
        const { items } = await this.listInstances({
          compartmentId: compartmentId || this.getCompartmentId(),
        });
        return items.map(({
          id: value,
          displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getCompartmentId() {
      return this.$auth.tenancy_id;
    },
    getProvider() {
      const {
        tenancy_id: tenancyId,
        user_id: userId,
        fingerprint,
        private_key: privateKey,
        region,
        passphrase = null,
      } = this.$auth;
      return new ociCommon.SimpleAuthenticationDetailsProvider(
        tenancyId,
        userId,
        fingerprint,
        privateKey,
        passphrase,
        ociCommon.Region.fromRegionId(region),
      );
    },
    initClient(clientClass) {
      const provider = this.getProvider();
      return new clientClass({
        authenticationDetailsProvider: provider,
      });
    },
    getObjectStorageClient() {
      return this.initClient(ociObjectStorage.ObjectStorageClient);
    },
    getDataCatalogClient() {
      return this.initClient(ociDataCatalog.DataCatalogClient);
    },
    getIdentityClient() {
      return this.initClient(ociIdentity.IdentityClient);
    },
    getComputeClient() {
      return this.initClient(ociCore.ComputeClient);
    },
    async makeRequest({
      getClient,
      method,
      ...args
    }) {
      const client = getClient();
      try {
        const response = await client[method](args);
        client.close && client.close();
        return response;

      } catch (error) {
        console.log(`Error in ${method}:`, error);
        throw error;
      }
    },
    listCompartments(args = {}) {
      return this.makeRequest({
        getClient: this.getIdentityClient,
        method: "listCompartments",
        ...args,
      });
    },
    listNamespaces(args = {}) {
      return this.makeRequest({
        getClient: this.getDataCatalogClient,
        method: "listNamespaces",
        ...args,
      });
    },
    listBuckets(args = {}) {
      return this.makeRequest({
        getClient: this.getObjectStorageClient,
        method: "listBuckets",
        ...args,
      });
    },
    listObjects(args = {}) {
      return this.makeRequest({
        getClient: this.getObjectStorageClient,
        method: "listObjects",
        ...args,
      });
    },
    getNamespace(args = {}) {
      return this.makeRequest({
        getClient: this.getObjectStorageClient,
        method: "getNamespace",
        ...args,
      });
    },
    updateBucket(args = {}) {
      return this.makeRequest({
        getClient: this.getObjectStorageClient,
        method: "updateBucket",
        ...args,
      });
    },
    listInstances(args = {}) {
      return this.makeRequest({
        getClient: this.getComputeClient,
        method: "listInstances",
        ...args,
      });
    },
  },
};
