using NetoAPI.Models;

namespace NetoAPI.Repositories.Interfaces;

public interface IExpenseGroupRepository
{
    Task<ExpenseGroup?> GetByIdAsync(Guid id, Guid userId);
    Task<List<ExpenseGroup>> GetRecurringAsync(Guid userId);
    Task AddAsync(ExpenseGroup group);
    Task DeleteAsync(ExpenseGroup group);
    Task SaveAsync();
}