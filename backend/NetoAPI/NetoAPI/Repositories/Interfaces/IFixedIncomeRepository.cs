using NetoAPI.Models;

namespace NetoAPI.Repositories.Interfaces;

public interface IFixedIncomeRepository
{
    Task<List<FixedIncome>> GetAllByUserAsync(Guid userId);
    Task<FixedIncome?> GetByIdAsync(Guid id, Guid userId);
    Task AddAsync(FixedIncome income);
    Task DeleteAsync(FixedIncome income);
    Task SaveAsync();
}