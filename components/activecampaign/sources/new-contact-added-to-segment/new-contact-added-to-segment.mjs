import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import activecampaign from "../../activecampaign.app.mjs";
import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  name: "New Contact Added to Segment",
  key: "activecampaign-new-contact-added-to-segment",
  description: "Emit new event each time a new contact is added to a segment.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    segmentId: {
      propDefinition: [
        activecampaign,
        "segment",
      ],
    },
  },
  methods: {
    _getInitKey(segmentId) {
      return `segment_${segmentId}_initialized`;
    },
    _isInitialized(segmentId) {
      return !!this.db.get(this._getInitKey(segmentId));
    },
    _setInitialized(segmentId) {
      this.db.set(this._getInitKey(segmentId), true);
    },
    _getSegmentKey(segmentId) {
      return `segment_${segmentId}_contacts`;
    },
    _getStoredContactIds(segmentId) {
      return this.db.get(this._getSegmentKey(segmentId)) || [];
    },
    _setStoredContactIds(segmentId, contactIds) {
      this.db.set(this._getSegmentKey(segmentId), contactIds);
    },
    _getFieldMappingKey() {
      return "custom_field_mapping";
    },
    _getFieldMapping() {
      return this.db.get(this._getFieldMappingKey()) || null;
    },
    _setFieldMapping(mapping) {
      this.db.set(this._getFieldMappingKey(), mapping);
    },
    async getCustomFieldMapping() {
      const cachedMapping = this._getFieldMapping();
      if (cachedMapping) {
        return cachedMapping;
      }

      const fieldMapping = {};
      const limit = constants.DEFAULT_LIMIT;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await this.activecampaign.listContactCustomFields({
          params: {
            limit,
            offset,
          },
        });

        if (response.fields && response.fields.length > 0) {
          for (const field of response.fields) {
            fieldMapping[field.id] = field.title;
          }
          offset += limit;
          hasMore = response.fields.length === limit;
        } else {
          hasMore = false;
        }
      }

      this._setFieldMapping(fieldMapping);
      return fieldMapping;
    },
    generateMeta(contact, segmentInfo) {
      return {
        id: `${segmentInfo.segmentId}-${contact.id}`,
        summary: `Contact ${contact.email} added to segment: ${segmentInfo.name}`,
        ts: Date.now(),
      };
    },
    async getSegmentContacts(segmentId) {
      const contacts = [];
      const limit = constants.DEFAULT_LIMIT;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await this.activecampaign.listContacts({
          params: {
            segmentid: segmentId,
            limit,
            offset,
            forceQuery: true,
          },
        });

        if (response.contacts && response.contacts.length > 0) {
          contacts.push(...response.contacts);
          offset += limit;
          hasMore = response.contacts.length === limit;
        } else {
          hasMore = false;
        }
      }

      return contacts;
    },
  },
  async run() {
    if (!this.segmentId) {
      console.warn("No segment selected to monitor");
      return;
    }

    const segmentId = this.segmentId;

    let segmentName = `Segment ${segmentId}`;
    try {
      const response = await this.activecampaign.listAudiences({
        params: {
          page: 1,
        },
      });
      const segment = response.data?.find((s) => s.id === segmentId);
      if (segment?.attributes?.name) {
        segmentName = segment.attributes.name;
      }
    } catch (error) {
      console.warn("Error fetching segment info:", error);
    }

    const segmentInfo = {
      segmentId,
      name: segmentName,
    };

    let currentContacts;
    try {
      currentContacts = await this.getSegmentContacts(segmentId);
    } catch (error) {
      console.warn("Error fetching segment contacts, skipping this poll cycle:", error);
      return;
    }

    const currentContactIds = new Set(currentContacts.map((c) => c.id));

    const previousContactIds = new Set(this._getStoredContactIds(segmentId));

    const newContactIds = [
      ...currentContactIds,
    ].filter(
      (id) => !previousContactIds.has(id),
    );

    if (!this._isInitialized(segmentId)) {
      console.log(`First run: storing ${currentContactIds.size} contact IDs`);
      this._setStoredContactIds(segmentId, [
        ...currentContactIds,
      ]);
      this._setInitialized(segmentId);
      return;
    }

    if (newContactIds.length > 0) {
      console.log(`Found ${newContactIds.length} new contacts in segment`);

      const fieldMapping = await this.getCustomFieldMapping();

      for (const contactId of newContactIds) {
        const contact = currentContacts.find((c) => c.id === contactId);
        if (contact) {
          try {
            const { fieldValues } = await this.activecampaign.getContactFieldValues({
              contactId: contact.id,
            });

            if (fieldValues && fieldValues.length > 0) {
              for (const fieldValue of fieldValues) {
                const fieldTitle = fieldMapping[fieldValue.field];
                if (fieldTitle) {
                  contact[fieldTitle] = fieldValue.value;
                }
              }
            }
          } catch (error) {
            console.warn(`Error fetching custom fields for contact ${contact.id}:`, error);
          }

          const eventData = {
            segmentId: segmentInfo.segmentId,
            segmentName: segmentInfo.name,
            contactId: contact.id,
            contact,
            addedAt: new Date().toISOString(),
          };

          const meta = this.generateMeta(contact, segmentInfo);
          this.$emit(eventData, meta);
        }
      }
    }

    this._setStoredContactIds(segmentId, [
      ...currentContactIds,
    ]);
  },
};
