using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;

namespace NetoAPI.Repositories;

public class CategoryRepository(AppDbContext db) : ICategoryRepository
{
    public Task<List<Category>> GetAllByUserAsync(Guid userId, string? search, bool? hasExpenses)
    {
        var query = db.Categories
            .Include(c => c.ExpenseGroups)
            .Where(c => c.UserId == userId);

        // Filter by search term on category name
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.Name.Contains(search));

        // Filter categories that have at least one expense group with amount > 0
        if (hasExpenses == true)
            query = query.Where(c => c.ExpenseGroups.Any(g => g.Amount > 0));

        return query.ToListAsync();
    }

    public Task<Category?> GetByIdAsync(Guid id, Guid userId) =>
        db.Categories
            .Include(c => c.ExpenseGroups)
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

    public async Task AddAsync(Category category) => await db.Categories.AddAsync(category);

    public Task DeleteAsync(Category category)
    {
        db.Categories.Remove(category);
        return Task.CompletedTask;
    }

    public Task SaveAsync() => db.SaveChangesAsync();
}