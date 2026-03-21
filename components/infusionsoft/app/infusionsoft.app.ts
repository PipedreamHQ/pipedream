import {
  defineApp, Pipedream,
} from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddContactToAutomationParams,
  ApplyTagToContactsParams,
  CreateAffiliateParams,
  CreateCompanyParams,
  CreateContactParams,
  CreateContactNoteParams,
  CreateHookParams,
  CreateOpportunityParams,
  CreateOpportunityStageParams,
  CreateTaskParams,
  DeleteTaskParams,
  DeleteHookParams,
  CreateOrderItemParams,
  CreatePaymentParams,
  GetObjectParams,
  HttpRequestParams,
  SendEmailParams,
  SendEmailTemplateParams,
  UpdateContactParams,
  UpdateOpportunityParams,
  UpdateTaskParams,
  UploadFileParams,
} from "../common/types/requestParams";
import {
  Appointment,
  Company,
  Contact,
  Webhook,
  Order,
  Product,
} from "../common/types/responseSchemas";

export default defineApp({
  type: "app",
  app: "infusionsoft",
  methods: {
    _baseUrl(): string {
      return "https://api.infusionsoft.com/crm/rest/v1";
    },
    _baseUrlV2(): string {
      return "https://api.infusionsoft.com/crm/rest/v2";
    },
    _parseId(val: string, fieldName: string): number {
      const t = String(val ?? "").trim();
      if (!/^\d+$/.test(t)) {
        throw new Error(`${fieldName} must be a valid numeric ID`);
      }
      return parseInt(t, 10);
    },
    _parseCustomFields(customFields: unknown): unknown[] | undefined {
      if (customFields == null) return undefined;
      const parsed = typeof customFields === "string"
        ? (customFields.trim()
          ? JSON.parse(customFields)
          : undefined)
        : customFields;
      if (parsed == null) return undefined;
      if (!Array.isArray(parsed)) {
        throw new Error("customFields must be a JSON array");
      }
      return parsed;
    },
    async _httpRequest({
      $ = this,
      endpoint,
      url,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: url ?? this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async hookResponseRequest(apiUrl: string): Promise<object> {
      if (!(apiUrl && apiUrl.startsWith(this._baseUrl()))) {
        return {
          noUrl: true,
        };
      }

      return this._httpRequest({
        url: apiUrl,
      });
    },
    async createHook(data: CreateHookParams): Promise<Webhook> {
      return this._httpRequest({
        endpoint: "/hooks",
        method: "POST",
        data,
      });
    },
    async deleteHook({ key }: DeleteHookParams): Promise<number> {
      return this._httpRequest({
        endpoint: `/hooks/${key}`,
        method: "DELETE",
      });
    },
    async listCompanies(): Promise<Company[]> {
      const response = await this._httpRequest({
        endpoint: "/companies",
      });

      return response.companies;
    },
    async getCompany({
      id, ...params
    }: GetObjectParams): Promise<Company> {
      return this._httpRequest({
        endpoint: `/companies/${id}`,
        ...params,
      });
    },
    async getAppointment({
      id,
      ...params
    }: GetObjectParams): Promise<Appointment> {
      return this._httpRequest({
        endpoint: `/appointments/${id}`,
        ...params,
      });
    },
    async listContacts(): Promise<Contact[]> {
      const response = await this._httpRequest({
        endpoint: "/contacts",
      });

      return response.contacts;
    },
    async getContact({
      id, ...params
    }: GetObjectParams): Promise<Contact> {
      return this._httpRequest({
        endpoint: `/contacts/${id}`,
        ...params,
      });
    },
    async listOrders(): Promise<Order[]> {
      const response = await this._httpRequest({
        endpoint: "/orders",
      });

      return response.orders;
    },
    async getOrder({
      id, ...params
    }: GetObjectParams): Promise<Order> {
      return this._httpRequest({
        endpoint: `/orders/${id}`,
        ...params,
      });
    },
    getOrderSummary({
      contact, order_items, total,
    }: Order): string {
      return `${order_items.length} items (total $${total}) by ${contact.first_name}`;
    },
    async listProducts(): Promise<Product[]> {
      const response = await this._httpRequest({
        endpoint: "/products",
      });

      return response.products;
    },
    async createOrderItem({
      orderId,
      ...params
    }: CreateOrderItemParams): Promise<object> {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/items`,
        method: "POST",
        ...params,
      });
    },
    async createPayment({
      orderId,
      ...params
    }: CreatePaymentParams): Promise<object> {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/payments`,
        method: "POST",
        ...params,
      });
    },
    async createCompany({
      $,
      companyName,
      email,
      phoneNumber,
      website,
      addressLine1,
      addressLine2,
      locality,
      region,
      regionCode,
      postalCode,
      country,
      countryCode,
      notes,
      customFields,
    }: CreateCompanyParams): Promise<object> {
      const body: Record<string, unknown> = {
        company_name: companyName.trim(),
      };

      if (email?.trim()) {
        body.email_address = {
          email: email.trim(),
          field: "EMAIL1",
        };
      }

      if (phoneNumber?.trim()) {
        body.phone_number = {
          number: phoneNumber.trim(),
          field: "PHONE1",
        };
      }

      if (website?.trim()) {
        body.website = website.trim();
      }

      if (
        addressLine1 ||
        addressLine2 ||
        locality ||
        region ||
        regionCode ||
        postalCode ||
        country ||
        countryCode
      ) {
        const address: Record<string, string> = {};
        if (addressLine1?.trim()) address.line1 = addressLine1.trim();
        if (addressLine2?.trim()) address.line2 = addressLine2.trim();
        if (locality?.trim()) address.locality = locality.trim();
        if (region?.trim()) address.region = region.trim();
        if (regionCode?.trim()) address.region_code = regionCode.trim();
        if (postalCode?.trim()) address.postal_code = postalCode.trim();
        if (country?.trim()) address.country = country.trim();
        if (countryCode?.trim()) address.country_code = countryCode.trim();
        body.address = address;
      }

      if (notes?.trim()) {
        body.notes = notes.trim();
      }

      try {
        const parsed = this._parseCustomFields(customFields);
        if (parsed && parsed.length > 0) body.custom_fields = parsed;
      } catch (e) {
        throw new Error(e instanceof Error
          ? e.message
          : `Invalid customFields: ${String(e)}`);
      }

      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/companies`,
        method: "POST",
        data: body,
      });
    },
    async createContact({
      $,
      givenName,
      familyName,
      email,
      phoneNumber,
      companyName,
      companyId,
      jobTitle,
      ownerId,
      leadsourceId,
      customFields,
    }: CreateContactParams): Promise<object> {
      const body: Record<string, unknown> = {};

      if (givenName?.trim()) body.given_name = givenName.trim();
      if (familyName?.trim()) body.family_name = familyName.trim();
      if (jobTitle?.trim()) body.job_title = jobTitle.trim();
      if (ownerId?.trim()) body.owner_id = this._parseId(ownerId, "Owner ID");
      if (leadsourceId?.trim()) body.leadsource_id = this._parseId(leadsourceId, "Lead Source ID");

      if (email?.trim()) {
        body.email_addresses = [
          {
            email: email.trim(),
            field: "EMAIL1",
          },
        ];
      }

      if (phoneNumber?.trim()) {
        body.phone_numbers = [
          {
            number: phoneNumber.trim(),
            field: "PHONE1",
          },
        ];
      }

      const company: Record<string, unknown> = {};
      if (companyId?.trim()) company.id = this._parseId(companyId, "Company ID");
      if (companyName?.trim()) company.company_name = companyName.trim();
      if (Object.keys(company).length > 0) body.company = company;

      try {
        const parsed = this._parseCustomFields(customFields);
        if (parsed && parsed.length > 0) body.custom_fields = parsed;
      } catch (e) {
        throw new Error(e instanceof Error
          ? e.message
          : `Invalid customFields: ${String(e)}`);
      }

      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/contacts`,
        method: "POST",
        data: body,
      });
    },
    async createAffiliate({
      $,
      code,
      contactId,
      status,
      name,
    }: CreateAffiliateParams): Promise<object> {
      const body: Record<string, string> = {
        code: code.trim(),
        contact_id: this._parseId(contactId, "Contact ID").toString(),
        status: status.trim().toUpperCase(),
      };
      if (name?.trim()) {
        body.name = name.trim();
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/affiliates`,
        method: "POST",
        data: body,
      });
    },
    async applyTagToContacts({
      $,
      tagId,
      contactIds,
    }: ApplyTagToContactsParams): Promise<object> {
      const tagIdNum = this._parseId(tagId, "Tag ID");
      const contactIdsNum = contactIds.map((id, i) => this._parseId(String(id), `Contact ID at index ${i}`));
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tags/${tagIdNum}/contacts:applyTags`,
        method: "POST",
        data: {
          contact_ids: contactIdsNum,
        },
      });
    },
    async listTags(): Promise<{ id: string; name: string }[]> {
      const allTags: { id: string; name?: string }[] = [];
      let pageToken: string | undefined;
      do {
        const params: Record<string, string> = {
          page_size: "100",
        };
        if (pageToken) params.page_token = pageToken;
        const response = await this._httpRequest({
          url: `${this._baseUrlV2()}/tags`,
          params,
        }) as { tags?: { id: string; name?: string }[]; next_page_token?: string };
        const tags = response.tags ?? [];
        allTags.push(...tags);
        pageToken = response.next_page_token;
      } while (pageToken);

      return allTags.map((t) => ({
        id: String(t.id),
        name: t.name ?? String(t.id),
      }));
    },
    async listLeadSources(): Promise<{ id: string; name: string }[]> {
      try {
        const allSources: { id: string; name?: string }[] = [];
        let pageToken: string | undefined;
        do {
          const params: Record<string, string> = {
            page_size: "100",
          };
          if (pageToken) params.page_token = pageToken;
          const response = await this._httpRequest({
            url: `${this._baseUrlV2()}/leadsources`,
            params,
          }) as { leadsources?: { id: string; name?: string }[]; next_page_token?: string };
          const sources = response.leadsources ?? [];
          allSources.push(...sources);
          pageToken = response.next_page_token;
        } while (pageToken);

        return allSources.map((s) => ({
          id: String(s.id),
          name: s.name ?? String(s.id),
        }));
      } catch {
        return [];
      }
    },
    async listAutomations(): Promise<{ id: string; name: string }[]> {
      const response = await this._httpRequest({
        url: `${this._baseUrlV2()}/automations`,
      }) as { automations?: { id: string; name?: string }[] };
      const automations = response.automations ?? [];
      return automations.map((a) => ({
        id: String(a.id),
        name: a.name ?? String(a.id),
      }));
    },
    async listSequences(automationId: string): Promise<{ id: string; name: string }[]> {
      const response = await this._httpRequest({
        url: `${this._baseUrlV2()}/automations/${String(automationId).trim()}/sequences`,
      }) as { sequences?: { id: string; name?: string }[] };
      const sequences = response.sequences ?? [];
      return sequences.map((s) => ({
        id: String(s.id),
        name: s.name ?? String(s.id),
      }));
    },
    async addContactToAutomation({
      $,
      automationId,
      sequenceId,
      contactIds,
    }: AddContactToAutomationParams): Promise<object> {
      const automationIdStr = String(automationId ?? "").trim();
      const sequenceIdStr = String(sequenceId ?? "").trim();
      if (!automationIdStr) {
        throw new Error("Automation ID is required");
      }
      if (!sequenceIdStr) {
        throw new Error("Sequence ID is required");
      }

      const contactIdsStr = contactIds
        .map((id) => String(id ?? "").trim())
        .filter((s) => s.length > 0);
      if (contactIdsStr.length === 0) {
        throw new Error("At least one valid contact ID is required");
      }

      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/automations/${automationIdStr}/sequences/${sequenceIdStr}:addContacts`,
        method: "POST",
        data: {
          contact_ids: contactIdsStr,
        },
      });
    },
    async createContactNote({
      $,
      contactId,
      body,
      userId,
      title,
      type,
    }: CreateContactNoteParams): Promise<object> {
      const data: Record<string, unknown> = {
        contact_id: this._parseId(contactId, "Contact ID"),
        body: body.trim(),
      };
      if (title?.trim()) data.title = title.trim();
      if (userId?.trim()) data.user_id = this._parseId(userId, "User ID");
      if (type?.trim()) data.type = type.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/notes`,
        method: "POST",
        data,
      });
    },
    async createOpportunity({
      $,
      opportunityTitle,
      contactId,
      stageId,
      userId,
      projectedRevenueHigh,
      projectedRevenueLow,
      estimatedCloseTime,
      nextActionTime,
      nextActionNotes,
      opportunityNotes,
      includeInForecast,
      customFields,
    }: CreateOpportunityParams): Promise<object> {
      const contactIdNum = this._parseId(contactId, "Contact ID");
      const stageIdNum = this._parseId(stageId, "Stage ID");
      const userIdNum = this._parseId(userId, "User ID");
      if (contactIdNum < 1) throw new Error("Contact ID must be a positive number");
      if (stageIdNum < 1) throw new Error("Stage ID must be a positive number");
      if (userIdNum < 1) throw new Error("User ID must be a positive number");

      const body: Record<string, unknown> = {
        opportunity_title: opportunityTitle.trim(),
        contact: {
          id: contactIdNum,
        },
        stage: {
          id: stageIdNum,
        },
        user: {
          id: userIdNum,
        },
        affiliate_id: "",
      };
      if (estimatedCloseTime?.trim()) body.estimated_close_date = estimatedCloseTime.trim();
      if (nextActionTime?.trim()) body.next_action_date = nextActionTime.trim();
      if (nextActionNotes?.trim()) body.next_action_notes = nextActionNotes.trim();
      if (opportunityNotes?.trim()) body.opportunity_notes = opportunityNotes.trim();
      const highVal = parseFloat(String(projectedRevenueHigh));
      if (!isNaN(highVal)) body.projected_revenue_high = highVal;
      const lowVal = parseFloat(String(projectedRevenueLow));
      if (!isNaN(lowVal)) body.projected_revenue_low = lowVal;
      if (includeInForecast !== undefined && includeInForecast !== null) {
        body.include_in_forecast = includeInForecast
          ? 1
          : 0;
      }
      try {
        const parsed = this._parseCustomFields(customFields);
        if (parsed && parsed.length > 0) {
          body.custom_fields = parsed.map((f: { id: unknown; content: unknown }, i: number) => {
            const idVal = f.id;
            const idNum = typeof idVal === "string"
              ? parseInt(idVal, 10)
              : Number(idVal);
            if (!Number.isInteger(idNum) || idNum < 1) {
              throw new Error(`customFields[${i}].id must be a positive integer`);
            }
            const content = f.content && typeof f.content === "object" && "value" in (f.content as object)
              ? (f.content as { value: unknown }).value
              : f.content;
            if (content === undefined || content === null) {
              throw new Error(`customFields[${i}].content is required`);
            }
            return {
              id: idNum,
              content,
            };
          });
        }
      } catch (e) {
        throw new Error(e instanceof Error
          ? e.message
          : `Invalid customFields: ${String(e)}`);
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/opportunities`,
        method: "POST",
        data: body,
      });
    },
    async createOpportunityStage({
      $,
      name,
      order,
      probability,
      targetNumberDays,
      checklistItems,
    }: CreateOpportunityStageParams): Promise<object> {
      const orderNum = parseInt(String(order), 10);
      const probabilityNum = parseInt(String(probability), 10);
      const targetDaysNum = parseInt(String(targetNumberDays), 10);
      if (!Number.isFinite(orderNum)) throw new Error("Order must be a valid number");
      if (!Number.isFinite(probabilityNum) || probabilityNum < 0 || probabilityNum > 100) {
        throw new Error("Probability must be a number between 0 and 100");
      }
      if (!Number.isFinite(targetDaysNum)) throw new Error("Target number of days must be a valid number");

      const body: Record<string, unknown> = {
        name: name.trim(),
        order: orderNum,
        probability: probabilityNum,
        target_number_days: targetDaysNum,
      };
      if (checklistItems?.trim()) {
        try {
          const parsed = JSON.parse(checklistItems);
          if (!Array.isArray(parsed)) {
            throw new Error("checklistItems must be a JSON array");
          }
          body.checklist_items = parsed.map((item: { description?: unknown; order?: unknown; required?: unknown }, i: number) => {
            const desc = item.description;
            if (desc === undefined || desc === null || typeof desc !== "string") {
              throw new Error(`checklistItems[${i}].description must be a string`);
            }
            const orderVal = item.order;
            const orderNum = typeof orderVal === "string"
              ? parseInt(orderVal, 10)
              : Number(orderVal);
            if (!Number.isInteger(orderNum) || orderNum < 0) {
              throw new Error(`checklistItems[${i}].order must be a non-negative integer`);
            }
            return {
              description: desc.trim(),
              order: orderNum,
              required: Boolean(item.required),
            };
          });
        } catch (e) {
          throw new Error(e instanceof Error
            ? e.message
            : `Invalid checklistItems JSON: ${String(e)}`);
        }
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/opportunities/stages`,
        method: "POST",
        data: body,
      });
    },
    async createTask({
      $,
      assignedToUserId,
      title,
      contactId,
      description,
      dueTime,
      priority,
      type,
      completed,
      completionTime,
      remindTimeMins,
    }: CreateTaskParams): Promise<object> {
      const body: Record<string, unknown> = {
        assigned_to_user_id: this._parseId(assignedToUserId, "Assigned To User ID"),
      };
      if (title?.trim()) body.title = title.trim();
      if (contactId?.trim()) body.contact_id = this._parseId(contactId, "Contact ID");
      if (description?.trim()) body.description = description.trim();
      if (dueTime?.trim()) body.due_time = dueTime.trim();
      if (priority?.trim()) body.priority = priority.trim();
      if (type?.trim()) body.type = type.trim();
      if (completionTime?.trim()) body.completion_time = completionTime.trim();
      if (completed !== undefined && completed !== null) body.completed = Boolean(completed);
      const remindVal = parseInt(String(remindTimeMins), 10);
      if (!isNaN(remindVal)) body.remind_time_mins = remindVal;
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tasks`,
        method: "POST",
        data: body,
      });
    },
    async deleteTask({
      $,
      taskId,
    }: DeleteTaskParams): Promise<object> {
      await this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tasks/${taskId.trim()}`,
        method: "DELETE",
      });
      return {
        deleted: true,
        task_id: taskId,
      };
    },
    async listAffiliates({
      $,
      affiliateName,
      contactId,
      status,
      code,
      orderBy,
      pageSize,
      pageToken,
    }: {
      $?: Pipedream;
      affiliateName?: string;
      contactId?: string;
      status?: string;
      code?: string;
      orderBy?: string;
      pageSize?: string;
      pageToken?: string;
    }): Promise<object> {
      const params: Record<string, string | number | string[]> = {};
      const filters: string[] = [];
      if (affiliateName?.trim()) filters.push(`affiliate_name==${affiliateName.trim()}`);
      if (contactId?.trim()) filters.push(`contact_id==${contactId.trim()}`);
      if (status?.trim()) filters.push(`status==${status.trim().toUpperCase()}`);
      if (code?.trim()) filters.push(`code==${code.trim()}`);
      if (filters.length > 0) params.filter = filters.join(";");
      if (orderBy?.trim()) params.order_by = orderBy.trim();
      const size = parseInt(String(pageSize || "").trim(), 10);
      if (!isNaN(size) && size >= 1 && size <= 1000) params.page_size = size;
      if (pageToken?.trim()) params.page_token = pageToken.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/affiliates`,
        params,
      });
    },
    async listCompaniesV2({
      $,
      companyName,
      email,
      sinceTime,
      untilTime,
      fields,
      orderBy,
      pageSize,
      pageToken,
    }: {
      $?: Pipedream;
      companyName?: string;
      email?: string;
      sinceTime?: string;
      untilTime?: string;
      fields?: string;
      orderBy?: string;
      pageSize?: string;
      pageToken?: string;
    }): Promise<object> {
      const params: Record<string, string | number> = {};
      const filters: string[] = [];
      if (companyName?.trim()) filters.push(`company_name==${companyName.trim()}`);
      if (email?.trim()) filters.push(`email==${email.trim()}`);
      if (sinceTime?.trim()) filters.push(`since_time==${sinceTime.trim()}`);
      if (untilTime?.trim()) filters.push(`until_time==${untilTime.trim()}`);
      if (filters.length > 0) params.filter = filters.join(";");
      if (fields?.trim()) params.fields = fields.split(",").map((f) => f.trim())
        .filter(Boolean)
        .join(",");
      if (orderBy?.trim()) params.order_by = orderBy.trim();
      const size = parseInt(String(pageSize || "").trim(), 10);
      if (!isNaN(size) && size >= 1 && size <= 1000) params.page_size = size;
      if (pageToken?.trim()) params.page_token = pageToken.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/companies`,
        params,
      });
    },
    async listContactNotes({
      $,
      contactId,
      userId,
      limit,
      offset,
    }: {
      $?: Pipedream;
      contactId: string;
      userId?: string;
      limit?: string;
      offset?: string;
    }): Promise<object> {
      const params: Record<string, number> = {
        contact_id: this._parseId(contactId, "Contact ID"),
      };
      if (userId?.trim()) params.user_id = this._parseId(userId, "User ID");
      const limitVal = parseInt(String(limit || "").trim(), 10);
      if (!isNaN(limitVal) && limitVal > 0) params.limit = limitVal;
      const offsetVal = parseInt(String(offset || "").trim(), 10);
      if (!isNaN(offsetVal) && offsetVal >= 0) params.offset = offsetVal;
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/notes`,
        params: params as Record<string, string | number>,
      });
    },
    async listContactsV2({
      $,
      email,
      givenName,
      familyName,
      companyId,
      contactIds,
      startUpdateTime,
      endUpdateTime,
      fields,
      orderBy,
      pageSize,
      pageToken,
    }: {
      $?: Pipedream;
      email?: string;
      givenName?: string;
      familyName?: string;
      companyId?: string;
      contactIds?: string;
      startUpdateTime?: string;
      endUpdateTime?: string;
      fields?: string;
      orderBy?: string;
      pageSize?: string;
      pageToken?: string;
    }): Promise<object> {
      const params: Record<string, string | number> = {};
      const filters: string[] = [];
      if (email?.trim()) filters.push(`email==${email.trim()}`);
      if (givenName?.trim()) filters.push(`given_name==${givenName.trim()}`);
      if (familyName?.trim()) filters.push(`family_name==${familyName.trim()}`);
      if (companyId?.trim()) filters.push(`company_id==${companyId.trim()}`);
      if (contactIds?.trim()) filters.push(`contact_ids==${contactIds.trim()}`);
      if (startUpdateTime?.trim()) filters.push(`start_update_time==${startUpdateTime.trim()}`);
      if (endUpdateTime?.trim()) filters.push(`end_update_time==${endUpdateTime.trim()}`);
      if (filters.length > 0) params.filter = filters.join(";");
      if (fields?.trim()) params.fields = fields.split(",").map((f) => f.trim())
        .filter(Boolean)
        .join(",");
      if (orderBy?.trim()) params.order_by = orderBy.trim();
      const size = parseInt(String(pageSize || "").trim(), 10);
      if (!isNaN(size) && size >= 1 && size <= 1000) params.page_size = size;
      if (pageToken?.trim()) params.page_token = pageToken.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/contacts`,
        params,
      });
    },
    async listOpportunities({
      $,
      stageId,
      userId,
      fields,
      orderBy,
      pageSize,
      pageToken,
    }: {
      $?: Pipedream;
      stageId?: string;
      userId?: string;
      fields?: string;
      orderBy?: string;
      pageSize?: string;
      pageToken?: string;
    }): Promise<object> {
      const params: Record<string, string | number> = {};
      const filters: string[] = [];
      if (stageId?.trim()) filters.push(`stage_id==${stageId.trim()}`);
      if (userId?.trim()) filters.push(`user_id==${userId.trim()}`);
      if (filters.length > 0) params.filter = filters.join(";");
      const coreFields = [
        "id",
        "contact",
        "stage",
        "opportunity_title",
      ];
      if (fields?.trim()) {
        const valid = fields.split(",").map((f) => f.trim())
          .filter((f) => f && !coreFields.includes(f.toLowerCase()));
        if (valid.length > 0) params.fields = valid.join(",");
      }
      if (orderBy?.trim()) params.order_by = orderBy.trim();
      const size = parseInt(String(pageSize || "").trim(), 10);
      if (!isNaN(size) && size >= 1 && size <= 1000) params.page_size = size;
      if (pageToken?.trim()) params.page_token = pageToken.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/opportunities`,
        params,
      });
    },
    async listOpportunityStages({
      $,
      orderBy,
      pageSize,
      pageToken,
    }: {
      $?: Pipedream;
      orderBy?: string;
      pageSize?: string;
      pageToken?: string;
    }): Promise<object> {
      const params: Record<string, string | number> = {};
      if (orderBy?.trim()) params.order_by = orderBy.trim();
      const size = parseInt(String(pageSize || "").trim(), 10);
      if (!isNaN(size) && size >= 1 && size <= 1000) params.page_size = size;
      if (pageToken?.trim()) params.page_token = pageToken.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/opportunities/stages`,
        params,
      });
    },
    async listTasks({
      $,
      filter,
      orderBy,
      pageSize,
      pageToken,
    }: {
      $?: Pipedream;
      filter?: string;
      orderBy?: string;
      pageSize?: string;
      pageToken?: string;
    }): Promise<object> {
      const params: Record<string, string | number> = {};
      if (filter?.trim()) params.filter = filter.trim();
      if (orderBy?.trim()) params.order_by = orderBy.trim();
      const size = parseInt(String(pageSize || "").trim(), 10);
      if (!isNaN(size) && size >= 1 && size <= 1000) params.page_size = size;
      if (pageToken?.trim()) params.page_token = pageToken.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tasks`,
        params,
      });
    },
    async listUsers({
      $,
      email,
      givenName,
      userIds,
      includeInactive,
      includePartners,
      orderBy,
      pageSize,
      pageToken,
    }: {
      $?: Pipedream;
      email?: string;
      givenName?: string;
      userIds?: string;
      includeInactive?: boolean;
      includePartners?: boolean;
      orderBy?: string;
      pageSize?: string;
      pageToken?: string;
    }): Promise<object> {
      const params: Record<string, string | number> = {};
      const filters: string[] = [];
      if (email?.trim()) filters.push(`email==${email.trim()}`);
      if (givenName?.trim()) filters.push(`given_name==${givenName.trim()}`);
      if (userIds?.trim()) filters.push(`user_ids==${userIds.trim()}`);
      if (includeInactive) filters.push("include_inactive==true");
      if (includePartners) filters.push("include_partners==true");
      if (filters.length > 0) params.filter = filters.join(";");
      if (orderBy?.trim()) params.order_by = orderBy.trim();
      let size = 10;
      const sizeVal = parseInt(String(pageSize || "").trim(), 10);
      if (!isNaN(sizeVal) && sizeVal >= 1 && sizeVal <= 100) size = sizeVal;
      params.page_size = size;
      if (pageToken?.trim()) params.page_token = pageToken.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/users`,
        params,
      });
    },
    async retrieveContactModel({ $ }: { $?: Pipedream }): Promise<object> {
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/contacts/model`,
      });
    },
    async retrieveOpportunity({
      $,
      opportunityId,
      fields,
    }: {
      $?: Pipedream;
      opportunityId: string;
      fields?: string;
    }): Promise<object> {
      const params: Record<string, string> = {};
      if (fields?.trim()) params.optional_properties = fields.split(",").map((f) => f.trim())
        .filter(Boolean)
        .join(",");
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/opportunities/${String(opportunityId ?? "").trim()}`,
        params,
      });
    },
    async retrieveOpportunityCustomFieldsModel({ $ }: { $?: Pipedream }): Promise<object> {
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/opportunities/model`,
      });
    },
    async retrieveTask({
      $,
      taskId,
    }: {
      $?: Pipedream;
      taskId: string;
    }): Promise<object> {
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tasks/${taskId.trim()}`,
      });
    },
    async retrieveUser({
      $,
      userId,
    }: {
      $?: Pipedream;
      userId: string;
    }): Promise<object> {
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/users/${userId.trim()}`,
      });
    },
    async sendEmail({
      $,
      userId,
      subject,
      contactIds,
      htmlContent,
      plainContent,
      addressField,
      attachments,
    }: SendEmailParams): Promise<object> {
      const body: Record<string, unknown> = {
        user_id: userId.trim(),
        subject: subject.trim(),
        contacts: contactIds
          .map((id) => (typeof id === "string"
            ? id.trim()
            : ""))
          .filter((s) => s.length > 0),
      };
      if (htmlContent?.trim()) body.html_content = Buffer.from(htmlContent).toString("base64");
      if (plainContent?.trim()) body.plain_content = Buffer.from(plainContent).toString("base64");
      if (addressField?.trim()) body.address_field = addressField.trim();
      if (attachments?.trim()) {
        try {
          const parsed = JSON.parse(attachments);
          if (!Array.isArray(parsed)) {
            throw new Error("attachments must be a JSON array");
          }
          body.attachments = parsed;
        } catch (e) {
          throw new Error(e instanceof Error
            ? e.message
            : `Invalid attachments JSON: ${String(e)}`);
        }
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/emails:send`,
        method: "POST",
        data: body,
      });
    },
    async sendEmailTemplate({
      $,
      templateId,
      userId,
      contactIds,
      addressField,
    }: SendEmailTemplateParams): Promise<object> {
      const body: Record<string, unknown> = {
        template_id: templateId.trim(),
        user_id: userId.trim(),
        contact_ids: contactIds
          .map((id) => (typeof id === "string"
            ? id.trim()
            : ""))
          .filter((s) => s.length > 0),
      };
      if (addressField?.trim()) body.address_field = addressField.trim();
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/emails/templates:send`,
        method: "POST",
        data: body,
      });
    },
    async setOpportunityStage({
      $,
      opportunityId,
      stageId,
    }: {
      $?: Pipedream;
      opportunityId: string;
      stageId: string;
    }): Promise<object> {
      const stageIdNum = parseInt(String(stageId ?? "").trim(), 10);
      if (!Number.isFinite(stageIdNum)) {
        throw new Error("Stage ID must be a valid number");
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/opportunities/${String(opportunityId ?? "").trim()}`,
        method: "PATCH",
        data: {
          stage: {
            id: stageIdNum,
          },
        },
      });
    },
    async updateContact({
      $,
      contactId,
      givenName,
      familyName,
      email,
      phoneNumber,
      companyName,
      jobTitle,
      ownerId,
      leadsourceId,
      customFields,
    }: UpdateContactParams): Promise<object> {
      const body: Record<string, unknown> = {};
      if (givenName?.trim()) body.given_name = givenName.trim();
      if (familyName?.trim()) body.family_name = familyName.trim();
      if (jobTitle?.trim()) body.job_title = jobTitle.trim();
      if (ownerId?.trim()) body.owner_id = this._parseId(ownerId, "Owner ID");
      if (leadsourceId?.trim()) body.leadsource_id = this._parseId(leadsourceId, "Lead Source ID");
      if (email?.trim()) body.email_addresses = [
        {
          email: email.trim(),
          field: "EMAIL1",
        },
      ];
      if (phoneNumber?.trim()) body.phone_numbers = [
        {
          number: phoneNumber.trim(),
          field: "PHONE1",
        },
      ];
      if (companyName?.trim()) body.company = {
        company_name: companyName.trim(),
      };
      try {
        const parsed = this._parseCustomFields(customFields);
        if (parsed && parsed.length > 0) body.custom_fields = parsed;
      } catch (e) {
        throw new Error(e instanceof Error
          ? e.message
          : `Invalid customFields: ${String(e)}`);
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/contacts/${String(contactId ?? "").trim()}`,
        method: "PATCH",
        data: body,
      });
    },
    async updateOpportunity({
      $,
      opportunityId,
      opportunityTitle,
      contactId,
      stageId,
      userId,
      projectedRevenueHigh,
      projectedRevenueLow,
      estimatedCloseTime,
      nextActionTime,
      nextActionNotes,
      opportunityNotes,
      includeInForecast,
      customFields,
    }: UpdateOpportunityParams): Promise<object> {
      const body: Record<string, unknown> = {};
      if (opportunityTitle?.trim()) body.opportunity_title = opportunityTitle.trim();
      if (contactId?.trim()) body.contact = {
        id: this._parseId(contactId, "Contact ID"),
      };
      if (stageId?.trim()) body.stage = {
        id: this._parseId(stageId, "Stage ID"),
      };
      if (userId?.trim()) body.user = {
        id: this._parseId(userId, "User ID"),
      };
      if (estimatedCloseTime?.trim()) body.estimated_close_date = estimatedCloseTime.trim();
      if (nextActionTime?.trim()) body.next_action_date = nextActionTime.trim();
      if (nextActionNotes?.trim()) body.next_action_notes = nextActionNotes.trim();
      if (opportunityNotes?.trim()) body.opportunity_notes = opportunityNotes.trim();
      const highVal = parseFloat(String(projectedRevenueHigh));
      if (!isNaN(highVal)) body.projected_revenue_high = highVal;
      const lowVal = parseFloat(String(projectedRevenueLow));
      if (!isNaN(lowVal)) body.projected_revenue_low = lowVal;
      if (includeInForecast !== undefined && includeInForecast !== null) {
        body.include_in_forecast = includeInForecast
          ? 1
          : 0;
      }
      try {
        const parsed = this._parseCustomFields(customFields);
        if (parsed && parsed.length > 0) {
          body.custom_fields = parsed.map((f: { id: unknown; content: unknown }, i: number) => {
            const idVal = f.id;
            const idNum = typeof idVal === "string"
              ? parseInt(idVal, 10)
              : Number(idVal);
            if (!Number.isInteger(idNum) || idNum < 1) {
              throw new Error(`customFields[${i}].id must be a positive integer`);
            }
            const content = f.content && typeof f.content === "object" && "value" in (f.content as object)
              ? (f.content as { value: unknown }).value
              : f.content;
            if (content === undefined || content === null) {
              throw new Error(`customFields[${i}].content is required`);
            }
            return {
              id: idNum,
              content,
            };
          });
        }
      } catch (e) {
        throw new Error(e instanceof Error
          ? e.message
          : `Invalid customFields: ${String(e)}`);
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/opportunities/${String(opportunityId ?? "").trim()}`,
        method: "PATCH",
        data: body,
      });
    },
    async updateTask({
      $,
      taskId,
      assignedToUserId,
      title,
      contactId,
      description,
      dueTime,
      priority,
      type,
      completed,
      completionTime,
      remindTimeMins,
    }: UpdateTaskParams): Promise<object> {
      const body: Record<string, unknown> = {};
      if (assignedToUserId?.trim()) body.assigned_to_user_id = this._parseId(assignedToUserId, "Assigned To User ID");
      if (title?.trim()) body.title = title.trim();
      if (contactId?.trim()) body.contact_id = this._parseId(contactId, "Contact ID");
      if (description?.trim()) body.description = description.trim();
      if (dueTime?.trim()) body.due_time = dueTime.trim();
      if (priority?.trim()) body.priority = priority.trim();
      if (type?.trim()) body.type = type.trim();
      if (completionTime?.trim()) body.completion_time = completionTime.trim();
      if (completed !== undefined && completed !== null) body.completed = Boolean(completed);
      const remindVal = parseInt(String(remindTimeMins), 10);
      if (!isNaN(remindVal)) body.remind_time_mins = remindVal;
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tasks/${taskId.trim()}`,
        method: "PATCH",
        data: body,
      });
    },
    async uploadFile({
      $,
      fileData,
      fileName,
      fileAssociation,
      contactId,
      userId,
      companyId,
      isPublic,
    }: UploadFileParams): Promise<object> {
      const association = fileAssociation.trim().toUpperCase();
      if (![
        "CONTACT",
        "USER",
        "COMPANY",
      ].includes(association)) {
        throw new Error("File association must be CONTACT, USER, or COMPANY");
      }
      if (association === "CONTACT" && !contactId?.trim()) {
        throw new Error("Contact ID is required for CONTACT association");
      }
      if (association === "USER" && !userId?.trim()) {
        throw new Error("User ID is required for USER association");
      }
      if (association === "COMPANY" && !companyId?.trim()) {
        throw new Error("Company ID is required for COMPANY association");
      }
      const raw = String(fileData ?? "");
      const fileDataTrimmed = raw.trim();
      let base64Data: string;
      if (fileDataTrimmed.startsWith("data:")) {
        const commaIdx = fileDataTrimmed.indexOf(",");
        base64Data = commaIdx > 0
          ? fileDataTrimmed.substring(commaIdx + 1)
          : "";
      } else {
        base64Data = Buffer.from(raw, "utf-8").toString("base64");
      }
      const body: Record<string, unknown> = {
        file_name: fileName.trim(),
        file_data: base64Data,
        file_association: association,
        is_public: Boolean(isPublic),
      };
      if (contactId?.trim()) body.contact_id = this._parseId(contactId, "Contact ID");
      if (userId?.trim()) body.user_id = this._parseId(userId, "User ID");
      if (companyId?.trim()) body.company_id = this._parseId(companyId, "Company ID");
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/files`,
        method: "POST",
        data: body,
      });
    },
  },
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company",
      description: `Select a **Company** from the list.
        \\
        Alternatively, you can provide a custom *Company ID*.`,
      async options() {
        const companies: Company[] = await this.listCompanies();

        return companies.map(({
          company_name, id,
        }) => ({
          label: company_name,
          value: id,
        }));
      },
    },
    ownerId: {
      type: "string",
      label: "Owner",
      description: `Select the **User** who owns this contact.
        \\
        Alternatively, you can provide a custom *Owner ID*.`,
      async options({ $ }: { $?: Pipedream }) {
        const allUsers: { id: string; email?: string }[] = [];
        let pageToken: string | undefined;
        do {
          const response = await this.listUsers({
            $,
            pageSize: "100",
            pageToken,
          }) as { users?: { id: string; email?: string }[]; next_page_token?: string };
          const users = response.users ?? [];
          allUsers.push(...users);
          pageToken = response.next_page_token;
        } while (pageToken);

        return allUsers.map((u) => ({
          label: u.email ?? String(u.id),
          value: String(u.id),
        }));
      },
    },
    leadsourceId: {
      type: "string",
      label: "Lead Source",
      description: `Select a **Lead Source** from the list.
        \\
        Alternatively, you can provide a custom *Lead Source ID*.`,
      async options() {
        const sources = await this.listLeadSources();

        return sources.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    tagId: {
      type: "string",
      label: "Tag",
      description: `Select a **Tag** from the list.
        \\
        Alternatively, you can provide a custom *Tag ID*.`,
      async options() {
        const tags = await this.listTags();

        return tags.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    contactId: {
      type: "integer",
      label: "Contact",
      description: `Select a **Contact** from the list.
        \\
        Alternatively, you can provide a custom *Contact ID*.`,
      async options() {
        const contacts: Contact[] = await this.listContacts();

        return contacts.map(({
          given_name, id,
        }) => ({
          label: given_name ?? id.toString(),
          value: id,
        }));
      },
    },
    orderId: {
      type: "integer",
      label: "Order",
      description: `Select an **Order** from the list.
        \\
        Alternatively, you can provide a custom *Order ID*.`,
      async options() {
        const orders: Order[] = await this.listOrders();

        return orders.map((order) => ({
          label: this.getOrderSummary(order),
          value: order.id,
        }));
      },
    },
    productId: {
      type: "integer",
      label: "Product",
      description: `Select a **Product** from the list.
        \\
        Alternatively, you can provide a custom *Product ID*.`,
      async options() {
        const products: Product[] = await this.listProducts();

        return products.map(({
          product_name, product_price, id,
        }) => ({
          label: `${product_name} ($${product_price})`,
          value: id,
        }));
      },
    },
    automationId: {
      type: "string",
      label: "Automation",
      description: `Select an **Automation** from the list.
        \\
        Alternatively, you can provide a custom *Automation ID*.`,
      async options() {
        const automations = await this.listAutomations();

        return automations.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    sequenceId: {
      type: "string",
      label: "Sequence",
      description: `Select a **Sequence** from the list.
        \\
        Alternatively, you can provide a custom *Sequence ID*.`,
      async options({ automationId }: { automationId: string }) {
        if (!automationId) return [];

        const sequences = await this.listSequences(automationId);

        return sequences.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    stageId: {
      type: "string",
      label: "Opportunity Stage",
      description: `Select an **Opportunity Stage** from the list.
        \\
        Alternatively, you can provide a custom *Stage ID*.`,
      async options({ $ }: { $?: Pipedream }) {
        const allStages: { id: string; name?: string }[] = [];
        const seen = new Set<string>();
        let pageToken: string | undefined;
        do {
          const response = await this.listOpportunityStages({
            $,
            pageSize: "100",
            pageToken,
          }) as { stages?: { id: string; name?: string }[]; next_page_token?: string };
          const stages = response.stages ?? [];
          for (const s of stages) {
            const id = String(s.id);
            if (!seen.has(id)) {
              seen.add(id);
              allStages.push(s);
            }
          }
          pageToken = response.next_page_token;
        } while (pageToken);

        return allStages.map((s) => ({
          label: s.name ?? String(s.id),
          value: String(s.id),
        }));
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: `Select a **User** from the list.
        \\
        Alternatively, you can provide a custom *User ID*.`,
      async options({ $ }: { $?: Pipedream }) {
        const allUsers: { id: string; email?: string }[] = [];
        let pageToken: string | undefined;
        do {
          const response = await this.listUsers({
            $,
            pageSize: "100",
            pageToken,
          }) as { users?: { id: string; email?: string }[]; next_page_token?: string };
          const users = response.users ?? [];
          allUsers.push(...users);
          pageToken = response.next_page_token;
        } while (pageToken);

        return allUsers.map((u) => ({
          label: u.email ?? String(u.id),
          value: String(u.id),
        }));
      },
    },
    opportunityId: {
      type: "string",
      label: "Opportunity",
      description: `Select an **Opportunity** from the list.
        \\
        Alternatively, you can provide a custom *Opportunity ID*.`,
      async options({ $ }: { $?: Pipedream }) {
        const response = await this.listOpportunities({
          $,
        }) as { opportunities?: { id: string; opportunity_title?: string }[] };
        const opportunities = response.opportunities ?? [];

        return opportunities.map((o) => ({
          label: o.opportunity_title ?? String(o.id),
          value: String(o.id),
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: `Select a **Task** from the list.
        \\
        Alternatively, you can provide a custom *Task ID*.`,
      async options({ $ }: { $?: Pipedream }) {
        const allTasks: { id: string; title?: string }[] = [];
        let pageToken: string | undefined;
        do {
          const response = await this.listTasks({
            $,
            pageSize: "100",
            pageToken,
          }) as { tasks?: { id: string; title?: string }[]; next_page_token?: string };
          const tasks = response.tasks ?? [];
          allTasks.push(...tasks);
          pageToken = response.next_page_token;
        } while (pageToken);

        return allTasks.map((t) => ({
          label: t.title ?? String(t.id),
          value: String(t.id),
        }));
      },
    },
  },
});
