
using NetoAPI.DTOs.Category;
using NetoAPI.Models;

namespace NetoAPI.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync(Guid userId, string? search, bool? hasExpenses);
    Task<CategoryDto?> CreateAsync(Guid userId, CreateCategoryRequest request);
    Task<bool> UpdateAsync(Guid categoryId, Guid userId, UpdateCategoryRequest request);
    Task<bool> DeleteAsync(Guid categoryId, Guid userId);
    Task<ExpenseGroupDto?> AddExpenseGroupAsync(Guid categoryId, Guid userId, CreateExpenseGroupRequest request);
    Task<bool> UpdateExpenseGroupAsync(Guid groupId, Guid userId, UpdateExpenseGroupRequest request);
    Task<bool> DeleteExpenseGroupAsync(Guid groupId, Guid userId);
    Task<List<ExpenseGroupDto>> GetRecurringGroupsAsync(Guid userId);
}