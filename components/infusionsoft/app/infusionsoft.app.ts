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
} from "../types/requestParams";
import {
  Appointment,
  Company,
  Contact,
  Webhook,
  Order,
  Product,
} from "../types/responseSchemas";

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

      if (customFields?.trim()) {
        try {
          const parsed = JSON.parse(customFields);
          if (Array.isArray(parsed)) {
            body.custom_fields = parsed;
          }
        } catch (e) {
          throw new Error(`Invalid customFields JSON: ${e instanceof Error
            ? e.message
            : String(e)}`);
        }
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
      if (ownerId?.trim()) body.owner_id = parseInt(ownerId.trim(), 10);
      if (leadsourceId?.trim()) body.leadsource_id = parseInt(leadsourceId.trim(), 10);

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
      if (companyId?.trim()) company.id = parseInt(companyId.trim(), 10);
      if (companyName?.trim()) company.company_name = companyName.trim();
      if (Object.keys(company).length > 0) body.company = company;

      if (customFields?.trim()) {
        try {
          const parsed = JSON.parse(customFields);
          if (Array.isArray(parsed)) {
            body.custom_fields = parsed;
          }
        } catch (e) {
          throw new Error(`Invalid customFields JSON: ${e instanceof Error
            ? e.message
            : String(e)}`);
        }
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
        contact_id: contactId.trim(),
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
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tags/${parseInt(tagId, 10)}/contacts:applyTags`,
        method: "POST",
        data: {
          contact_ids: contactIds.map((id) => parseInt(id, 10)),
        },
      });
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
        contact_id: parseInt(contactId, 10),
        body: body.trim(),
      };
      if (title?.trim()) data.title = title.trim();
      if (userId?.trim()) data.user_id = parseInt(userId.trim(), 10);
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
      const contactIdNum = parseInt(String(contactId), 10);
      const stageIdNum = parseInt(String(stageId), 10);
      const userIdNum = parseInt(String(userId), 10);
      if (!Number.isFinite(contactIdNum) || contactIdNum < 1) {
        throw new Error("Contact ID must be a valid positive number");
      }
      if (!Number.isFinite(stageIdNum) || stageIdNum < 1) {
        throw new Error("Stage ID must be a valid positive number");
      }
      if (!Number.isFinite(userIdNum) || userIdNum < 1) {
        throw new Error("User ID must be a valid positive number");
      }

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
      if (customFields?.trim()) {
        try {
          const parsed = JSON.parse(customFields);
          if (Array.isArray(parsed)) {
            body.custom_fields = parsed
              .map((f: { id: unknown; content: unknown }) => {
                const idNum = typeof f.id === "string"
                  ? parseInt(f.id, 10)
                  : Number(f.id);
                if (isNaN(idNum)) return null;
                const content = f.content && typeof f.content === "object" && "value" in (f.content as object)
                  ? (f.content as { value: unknown }).value
                  : f.content;
                return {
                  id: idNum,
                  content,
                };
              })
              .filter(Boolean);
          }
        } catch (e) {
          throw new Error(`Invalid customFields JSON: ${e instanceof Error
            ? e.message
            : String(e)}`);
        }
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
          if (Array.isArray(parsed)) {
            body.checklist_items = parsed.map((item: { description: string; order: number; required: boolean }) => ({
              description: String(item.description).trim(),
              order: parseInt(String(item.order), 10),
              required: Boolean(item.required),
            }));
          }
        } catch (e) {
          throw new Error(`Invalid checklistItems JSON: ${e instanceof Error
            ? e.message
            : String(e)}`);
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
        assigned_to_user_id: assignedToUserId.trim(),
      };
      if (title?.trim()) body.title = title.trim();
      if (contactId?.trim()) body.contact_id = contactId.trim();
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
        contact_id: parseInt(contactId, 10),
      };
      if (userId?.trim()) {
        const uid = parseInt(userId.trim(), 10);
        if (!isNaN(uid)) params.user_id = uid;
      }
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
      if (!isNaN(size) && size >= 1 && size <= 1000) params.page_size = Math.max(size, 10);
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
        contacts: contactIds.filter((id) => typeof id === "string" && id.trim()),
      };
      if (htmlContent?.trim()) body.html_content = Buffer.from(htmlContent).toString("base64");
      if (plainContent?.trim()) body.plain_content = Buffer.from(plainContent).toString("base64");
      if (addressField?.trim()) body.address_field = addressField.trim();
      if (attachments?.trim()) {
        try {
          const parsed = JSON.parse(attachments);
          if (Array.isArray(parsed)) body.attachments = parsed;
        } catch (e) {
          throw new Error(`Invalid attachments JSON: ${e instanceof Error
            ? e.message
            : String(e)}`);
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
        contact_ids: contactIds.filter((id) => typeof id === "string" && id.trim()),
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
      return this._httpRequest({
        $,
        url: `${this._baseUrl()}/opportunities/${String(opportunityId ?? "").trim()}`,
        method: "PATCH",
        data: {
          stage: {
            id: parseInt(String(stageId ?? "").trim(), 10),
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
      if (ownerId?.trim()) body.owner_id = parseInt(ownerId.trim(), 10);
      if (leadsourceId?.trim()) body.leadsource_id = parseInt(leadsourceId.trim(), 10);
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
      if (customFields?.trim()) {
        try {
          const parsed = JSON.parse(customFields);
          if (Array.isArray(parsed)) body.custom_fields = parsed;
        } catch (e) {
          throw new Error(`Invalid customFields JSON: ${e instanceof Error
            ? e.message
            : String(e)}`);
        }
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
      if (contactId?.trim()) {
        const cid = parseInt(contactId.trim(), 10);
        if (!isNaN(cid)) body.contact = {
          id: cid,
        };
      }
      if (stageId?.trim()) {
        const sid = parseInt(stageId.trim(), 10);
        if (!isNaN(sid)) body.stage = {
          id: sid,
        };
      }
      if (userId?.trim()) {
        const uid = parseInt(userId.trim(), 10);
        if (!isNaN(uid)) body.user = {
          id: uid,
        };
      }
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
      if (customFields?.trim()) {
        try {
          const parsed = JSON.parse(customFields);
          if (Array.isArray(parsed)) {
            body.custom_fields = parsed
              .map((f: { id: unknown; content: unknown }) => {
                const idNum = typeof f.id === "string"
                  ? parseInt(f.id, 10)
                  : Number(f.id);
                if (isNaN(idNum)) return null;
                const content = f.content && typeof f.content === "object" && "value" in (f.content as object)
                  ? (f.content as { value: unknown }).value
                  : f.content;
                return {
                  id: idNum,
                  content,
                };
              })
              .filter(Boolean);
          }
        } catch (e) {
          throw new Error(`Invalid customFields JSON: ${e instanceof Error
            ? e.message
            : String(e)}`);
        }
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
      if (assignedToUserId?.trim()) body.assigned_to_user_id = assignedToUserId.trim();
      if (title?.trim()) body.title = title.trim();
      if (contactId?.trim()) body.contact_id = contactId.trim();
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
      let base64Data = fileData;
      if (fileData.startsWith("data:")) {
        const commaIdx = fileData.indexOf(",");
        if (commaIdx > 0) base64Data = fileData.substring(commaIdx + 1);
      } else {
        base64Data = Buffer.from(fileData, "utf-8").toString("base64");
      }
      const body: Record<string, unknown> = {
        file_name: fileName.trim(),
        file_data: base64Data,
        file_association: association,
        is_public: Boolean(isPublic),
      };
      if (contactId?.trim()) body.contact_id = parseInt(contactId.trim(), 10);
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
  },
});
