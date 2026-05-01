using NetoAPI.DTOs.Wallet;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Services;

public class WalletService(IWalletRepository walletRepo) : IWalletService
{
    public async Task<WalletResponse?> GetWalletAsync(Guid userId)
    {
        var wallet = await walletRepo.GetByUserIdAsync(userId);
        if (wallet is null) return null;

        return new WalletResponse
        {
            Balance = wallet.Balance,
            RecentTransactions = wallet.Transactions
                .OrderByDescending(t => t.CreatedAt)
                .Take(20)
                .Select(MapTransaction)
                .ToList()
        };
    }

    public async Task<bool> TopUpAsync(Guid userId, TopUpRequest request)
    {
        var wallet = await walletRepo.GetByUserIdAsync(userId);
        if (wallet is null) return false;

        wallet.Balance += request.Amount;

        await walletRepo.AddTransactionAsync(new WalletTransaction
        {
            WalletId = wallet.Id,
            Type = TransactionType.TopUp,
            Amount = request.Amount,
            Reference = request.Note ?? "Manual top-up"
        });

        await walletRepo.UpdateBalanceAsync(userId, wallet.Balance);
        await walletRepo.SaveAsync();
        return true;
    }

    public async Task<List<TransactionDto>> GetTransactionsAsync(
        Guid userId,
        string? type,
        DateTime? from,
        DateTime? to)
    {
        // Parse type string to enum — null means no filter
        TransactionType? parsedType = null;
        if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<TransactionType>(type, ignoreCase: true, out var parsed))
            parsedType = parsed;

        var transactions = await walletRepo.GetTransactionsAsync(userId, parsedType, from, to);
        return transactions.Select(MapTransaction).ToList();
    }

    private static TransactionDto MapTransaction(WalletTransaction t) => new()
    {
        Type = t.Type.ToString(),
        Amount = t.Amount,
        Reference = t.Reference,
        CreatedAt = t.CreatedAt
    };
}