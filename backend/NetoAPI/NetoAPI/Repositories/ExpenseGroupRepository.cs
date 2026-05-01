using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;

namespace NetoAPI.Repositories;

public class ExpenseGroupRepository(AppDbContext db) : IExpenseGroupRepository
{
    public Task<ExpenseGroup?> GetByIdAsync(Guid id, Guid userId) =>
        db.ExpenseGroups.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

    public Task<List<ExpenseGroup>> GetRecurringAsync(Guid userId) =>
        db.ExpenseGroups.Where(g => g.UserId == userId && g.IsRecurring).ToListAsync();

    public async Task AddAsync(ExpenseGroup group) => await db.ExpenseGroups.AddAsync(group);

    public Task DeleteAsync(ExpenseGroup group)
    {
        db.ExpenseGroups.Remove(group);
        return Task.CompletedTask;
    }

    public Task SaveAsync() => db.SaveChangesAsync();
}