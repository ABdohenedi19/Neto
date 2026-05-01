
using NetoAPI.DTOs.FixedIncome;
using NetoAPI.Models;

namespace NetoAPI.Services.Interfaces;

public interface IFixedIncomeService
{
    Task<List<FixedIncome>> GetAllAsync(Guid userId);
    Task<FixedIncome> CreateAsync(Guid userId, CreateFixedIncomeRequest request);
    Task<bool> ToggleAsync(Guid id, Guid userId);   // activate / deactivate
    Task<bool> DeleteAsync(Guid id, Guid userId);
}