using NetoAPI.Models;

namespace NetoAPI.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllByUserAsync(Guid userId, string? search, bool? hasExpenses);
    Task<Category?> GetByIdAsync(Guid id, Guid userId);
    Task AddAsync(Category category);
    Task DeleteAsync(Category category);
    Task SaveAsync();
}