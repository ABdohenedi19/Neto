using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;

namespace NetoAPI.Repositories;

public class FixedIncomeRepository(AppDbContext db) : IFixedIncomeRepository
{
    public Task<List<FixedIncome>> GetAllByUserAsync(Guid userId) =>
        db.FixedIncomes.Where(f => f.UserId == userId).ToListAsync();

    public Task<FixedIncome?> GetByIdAsync(Guid id, Guid userId) =>
        db.FixedIncomes.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

    public async Task AddAsync(FixedIncome income) => await db.FixedIncomes.AddAsync(income);

    public Task DeleteAsync(FixedIncome income)
    {
        db.FixedIncomes.Remove(income);
        return Task.CompletedTask;
    }

    public Task SaveAsync() => db.SaveChangesAsync();
}