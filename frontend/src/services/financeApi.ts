import type {
  CategoryResponse,
  CreateProjectPayload,
  DashboardData,
  ExpenseResponse,
  ExpenseEntry,
  FixedIncomeResponse,
  InvoiceResponse,
  ProjectResponse,
  TransactionResponse,
} from "../types/finance";
import { request } from "./http";

const normalize = (value: string) => value.trim().toLowerCase();

const getExpenseType = (categoryName: string): "work" | "personal" => {
  const normalized = normalize(categoryName);
  return normalized.includes("meal") ||
    normalized.includes("food") ||
    normalized.includes("personal")
    ? "personal"
    : "work";
};

const mapCategoriesToExpenses = (
  categories: CategoryResponse[],
): ExpenseResponse[] => {
  return categories.flatMap((category) =>
    category.expenseGroups.map((group) => ({
      id: group.id,
      vendor: category.name,
      name: group.name,
      description: group.name,
      category: category.name,
      type: getExpenseType(category.name),
      amount: group.amount,
      date: group.createdAt,
      isRecurring: group.isRecurring,
    })),
  );
};

export const financeApi = {

  async updateProject(
  userId: string,
  projectId: string,
  payload: {
    name: string
    clientName: string
    amount: number
    date: string
  }
) {
  return request(`/project/${userId}/${projectId}`, {
    method: "PUT",
    body: payload,
  })
},

async getProjectsWithoutInvoice(userId: string) {
  return request(`/project/${userId}/without-invoice`)
},
  
  getTransactions: async (
  userId: string,
  params?: { from?: string; to?: string; type?: string },
): Promise<TransactionResponse[]> => {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  return request<TransactionResponse[]>(
    `/transaction/${userId}?${query}`
  );
},
  addExpenseGroup: async (
    userId: string,
    categoryId: string,
    payload: { name: string; amount: number; isRecurring: boolean },
  ) => {
    const res = await fetch(`/category/${userId}/${categoryId}/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getDashboard(userId: string): Promise<DashboardData> {
    return request<DashboardData>(`/dashboard/${userId}`);
  },

  async getFixedIncome(userId: string): Promise<FixedIncomeResponse[]> {
    return request<FixedIncomeResponse[]>(`/fixedincome/${userId}`);
  },

  async getProjects(userId: string): Promise<ProjectResponse[]> {
    return request<ProjectResponse[]>(`/project/${userId}`);
  },

  async getExpenses(userId: string): Promise<ExpenseResponse[]> {
    const categories = await request<CategoryResponse[]>(`/category/${userId}`);
    return mapCategoriesToExpenses(categories);
  },

  async addFixedIncome(
    userId: string,
    label: string,
    amount: number,
  ): Promise<void> {
    await request<void>(`/fixedincome/${userId}`, {
      method: "POST",
      body: { label, amount },
    });
  },

  async addExpense(
    userId: string,
    payload: Omit<ExpenseEntry, "id">,
  ): Promise<void> {
    const categoryName = payload.category.trim() || "General";
    const groupName =
      payload.description.trim() || payload.vendor.trim() || categoryName;

    const categories = await request<CategoryResponse[]>(`/category/${userId}`);
    const existingCategory = categories.find(
      (category) => normalize(category.name) === normalize(categoryName),
    );

    let categoryId = existingCategory?.id;

    if (!categoryId) {
      const createdCategory = await request<CategoryResponse | undefined>(
        `/category/${userId}`,
        {
          method: "POST",
          body: { name: categoryName },
        },
      );
      categoryId = createdCategory?.id;
    }

    if (!categoryId) {
      const refreshedCategories = await request<CategoryResponse[]>(
        `/category/${userId}`,
      );
      categoryId = refreshedCategories.find(
        (category) => normalize(category.name) === normalize(categoryName),
      )?.id;
    }

    if (!categoryId) {
      throw new Error(`Unable to create category: ${categoryName}`);
    }

    await request<void>(`/category/${userId}/${categoryId}/groups`, {
      method: "POST",
      body: {
        name: groupName,
        amount: payload.amount,
        isRecurring: payload.isRecurring ?? false,
      },
    });
  },

  async deleteExpense(userId: string, expenseId: string): Promise<void> {
    await request<void>(`/category/${userId}/groups/${expenseId}`, {
      method: "DELETE",
    });
  },

  async createProject(
    userId: string,
    payload: CreateProjectPayload,
  ): Promise<ProjectResponse | undefined> {
    return request<ProjectResponse | undefined>(`/project/${userId}`, {
      method: "POST",
      body: payload,
    });
  },

  

  async receiveProject(userId: string, projectId: string): Promise<void> {
    await request<void>(`/project/${userId}/${projectId}/receive`, {
      method: "PATCH",
    });
  },

  async createProjectInvoice(
  userId: string,
  projectId: string,
  payload: {
    clientName: string;
    description: string;
    amount: number;
    dueDate: string;
  }
): Promise<InvoiceResponse> {

  const invoice = await request<InvoiceResponse>(
    `/invoice/${userId}/${projectId}`,
    {
      method: "POST",
      body: payload,
    }
  );

  await this.receiveProject(userId, projectId);

  return invoice;
}
};
