using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Models;

namespace NetoAPI.Services;

// Runs every day at midnight — applies fixed income + recurring expenses on the 1st of each month
public class MonthlyJobService(IServiceScopeFactory scopeFactory, ILogger<MonthlyJobService> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;

            // Only run on the 1st day of the month
            if (now.Day == 1)
            {
                logger.LogInformation("Running monthly job for {Date}", now.ToString("MMM yyyy"));
                await ApplyMonthlyCreditsAsync();
            }

            // Wait until next midnight check
            var nextMidnight = now.Date.AddDays(1);
            await Task.Delay(nextMidnight - now, stoppingToken);
        }
    }

    private async Task ApplyMonthlyCreditsAsync()
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var users = await db.Users.Include(u => u.Wallet).ToListAsync();

        foreach (var user in users)
        {
            if (user.Wallet is null) continue;

            // ── Apply active fixed incomes ──────────────────────────────────
            var fixedIncomes = await db.FixedIncomes
                .Where(f => f.UserId == user.Id && f.IsActive)
                .ToListAsync();

            foreach (var income in fixedIncomes)
            {
                user.Wallet.Balance += income.Amount;
                db.WalletTransactions.Add(new WalletTransaction
                {
                    WalletId = user.Wallet.Id,
                    Type = TransactionType.Income,
                    Amount = income.Amount,
                    Reference = income.Label
                });
                logger.LogInformation("Applied fixed income '{Label}' ${Amount} for user {UserId}",
                    income.Label, income.Amount, user.Id);
            }

            // ── Deduct recurring expense groups ─────────────────────────────
            var recurringGroups = await db.ExpenseGroups
                .Include(g => g.Category)
                .Where(g => g.UserId == user.Id && g.IsRecurring)
                .ToListAsync();

            foreach (var group in recurringGroups)
            {
                user.Wallet.Balance -= group.Amount;
                db.WalletTransactions.Add(new WalletTransaction
                {
                    WalletId = user.Wallet.Id,
                    Type = TransactionType.Expense,
                    Amount = group.Amount,
                    Reference = $"{group.Category.Name} → {group.Name}"
                });
                logger.LogInformation("Deducted recurring group '{Name}' ${Amount} for user {UserId}",
                    group.Name, group.Amount, user.Id);
            }

            user.Wallet.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
    }
}