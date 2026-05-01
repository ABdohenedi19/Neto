
using NetoAPI.DTOs.Category;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Services;

public class CategoryService(
    ICategoryRepository categoryRepo,
    IExpenseGroupRepository groupRepo,
    IWalletRepository walletRepo) : ICategoryService
{
    public async Task<List<CategoryDto>> GetAllAsync(Guid userId, string? search, bool? hasExpenses)
    {
        var categories = await categoryRepo.GetAllByUserAsync(userId, search, hasExpenses);
        return categories.Select(MapCategoryToDto).ToList();
    }

    public async Task<CategoryDto?> CreateAsync(Guid userId, CreateCategoryRequest request)
    {
        var category = new Category
        {
            UserId = userId,
            Name = request.Name,
            Icon = request.Icon,
            Color = request.Color
        };
        await categoryRepo.AddAsync(category);
        await categoryRepo.SaveAsync();
        return MapCategoryToDto(category);
    }

    public async Task<bool> UpdateAsync(Guid categoryId, Guid userId, UpdateCategoryRequest request)
    {
        var category = await categoryRepo.GetByIdAsync(categoryId, userId);
        if (category is null) return false;

        category.Name = request.Name;
        category.Icon = request.Icon;
        category.Color = request.Color;

        await categoryRepo.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid categoryId, Guid userId)
    {
        var category = await categoryRepo.GetByIdAsync(categoryId, userId);
        if (category is null) return false;

        await categoryRepo.DeleteAsync(category);
        await categoryRepo.SaveAsync();
        return true;
    }

    public async Task<ExpenseGroupDto?> AddExpenseGroupAsync(Guid categoryId, Guid userId, CreateExpenseGroupRequest request)
    {
        var category = await categoryRepo.GetByIdAsync(categoryId, userId);
        if (category is null) return null;

        var wallet = await walletRepo.GetByUserIdAsync(userId);
        if (wallet is null) return null;

        var group = new ExpenseGroup
        {
            CategoryId = categoryId,
            UserId = userId,
            Name = request.Name,
            Amount = request.Amount,
            IsRecurring = request.IsRecurring
        };

        // Deduct expense from wallet immediately
        wallet.Balance -= request.Amount;
        await walletRepo.AddTransactionAsync(new WalletTransaction
        {
            WalletId = wallet.Id,
            Type = TransactionType.Expense,
            Amount = request.Amount,
            Reference = $"{category.Name} → {request.Name}"
        });
        await walletRepo.UpdateBalanceAsync(userId, wallet.Balance);
        await walletRepo.SaveAsync();

        await groupRepo.AddAsync(group);
        await groupRepo.SaveAsync();

        return MapGroupToDto(group);
    }

    public async Task<bool> UpdateExpenseGroupAsync(Guid groupId, Guid userId, UpdateExpenseGroupRequest request)
    {
        var group = await groupRepo.GetByIdAsync(groupId, userId);
        if (group is null) return false;

        var wallet = await walletRepo.GetByUserIdAsync(userId);
        if (wallet is null) return false;

        // Adjust wallet by the difference only
        var diff = request.Amount - group.Amount;
        if (diff != 0)
        {
            wallet.Balance -= diff;
            await walletRepo.AddTransactionAsync(new WalletTransaction
            {
                WalletId = wallet.Id,
                Type = TransactionType.Expense,
                Amount = Math.Abs(diff),
                Reference = $"Update: {group.Name} adjustment"
            });
            await walletRepo.UpdateBalanceAsync(userId, wallet.Balance);
            await walletRepo.SaveAsync();
        }

        group.Name = request.Name;
        group.Amount = request.Amount;
        group.IsRecurring = request.IsRecurring;

        await groupRepo.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteExpenseGroupAsync(Guid groupId, Guid userId)
    {
        var group = await groupRepo.GetByIdAsync(groupId, userId);
        if (group is null) return false;

        await groupRepo.DeleteAsync(group);
        await groupRepo.SaveAsync();
        return true;
    }

    public async Task<List<ExpenseGroupDto>> GetRecurringGroupsAsync(Guid userId)
    {
        var groups = await groupRepo.GetRecurringAsync(userId);
        return groups.Select(MapGroupToDto).ToList();
    }

    // ── Mappers ───────────────────────────────────────────────────────────────

    private static CategoryDto MapCategoryToDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Icon = c.Icon,
        Color = c.Color,
        CreatedAt = c.CreatedAt,
        ExpenseGroups = c.ExpenseGroups.Select(MapGroupToDto).ToList()
    };

    private static ExpenseGroupDto MapGroupToDto(ExpenseGroup g) => new()
    {
        Id = g.Id,
        CategoryId = g.CategoryId,
        Name = g.Name,
        Amount = g.Amount,
        IsRecurring = g.IsRecurring,
        CreatedAt = g.CreatedAt
    };
}