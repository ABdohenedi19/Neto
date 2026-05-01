
using NetoAPI.DTOs.FixedIncome;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Services;

public class FixedIncomeService(IFixedIncomeRepository repo) : IFixedIncomeService
{
    public Task<List<FixedIncome>> GetAllAsync(Guid userId) =>
        repo.GetAllByUserAsync(userId);

    public async Task<FixedIncome> CreateAsync(Guid userId, CreateFixedIncomeRequest request)
    {
        var income = new FixedIncome
        {
            UserId = userId,
            Label = request.Label,
            Amount = request.Amount,
            IsActive = true
        };
        await repo.AddAsync(income);
        await repo.SaveAsync();
        return income;
    }

    public async Task<bool> ToggleAsync(Guid id, Guid userId)
    {
        var income = await repo.GetByIdAsync(id, userId);
        if (income is null) return false;

        income.IsActive = !income.IsActive;
        await repo.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var income = await repo.GetByIdAsync(id, userId);
        if (income is null) return false;

        await repo.DeleteAsync(income);
        await repo.SaveAsync();
        return true;
    }
}