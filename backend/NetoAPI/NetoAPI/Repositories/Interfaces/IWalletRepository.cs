using NetoAPI.Models;

namespace NetoAPI.Repositories.Interfaces;

public interface IWalletRepository
{
    Task<Wallet?> GetByUserIdAsync(Guid userId);
    Task<List<WalletTransaction>> GetTransactionsAsync(Guid userId, TransactionType? type, DateTime? from, DateTime? to);
    Task AddTransactionAsync(WalletTransaction transaction);
    Task UpdateBalanceAsync(Guid userId, decimal newBalance);
    Task SaveAsync();
}