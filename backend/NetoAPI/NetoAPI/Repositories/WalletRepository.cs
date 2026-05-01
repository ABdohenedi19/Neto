
using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;

namespace NetoAPI.Repositories;


public class WalletRepository(AppDbContext db) : IWalletRepository
{
    public Task<Wallet?> GetByUserIdAsync(Guid userId) =>
        db.Wallets.Include(w => w.Transactions).FirstOrDefaultAsync(w => w.UserId == userId);

    public Task<List<WalletTransaction>> GetTransactionsAsync(
        Guid userId,
        TransactionType? type,
        DateTime? from,
        DateTime? to)
    {
        var query = db.WalletTransactions
            .Where(t => t.Wallet.UserId == userId);

        if (type.HasValue)
            query = query.Where(t => t.Type == type.Value);

        if (from.HasValue)
            query = query.Where(t => t.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(t => t.CreatedAt <= to.Value);

        return query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task AddTransactionAsync(WalletTransaction transaction) =>
        await db.WalletTransactions.AddAsync(transaction);

    public async Task UpdateBalanceAsync(Guid userId, decimal newBalance)
    {
        var wallet = await db.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet is null) return;
        wallet.Balance = newBalance;
        wallet.UpdatedAt = DateTime.UtcNow;
    }

    public Task SaveAsync() => db.SaveChangesAsync();
}