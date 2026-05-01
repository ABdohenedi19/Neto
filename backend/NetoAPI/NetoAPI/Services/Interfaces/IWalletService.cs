using NetoAPI.DTOs.Wallet;

namespace NetoAPI.Services.Interfaces;

public interface IWalletService
{
    Task<WalletResponse?> GetWalletAsync(Guid userId);
    Task<bool> TopUpAsync(Guid userId, TopUpRequest request);
    Task<List<TransactionDto>> GetTransactionsAsync(Guid userId, string? type, DateTime? from, DateTime? to);
}