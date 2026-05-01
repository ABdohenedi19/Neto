namespace NetoAPI.DTOs.Wallet;

public class WalletResponse
{
    public decimal Balance { get; set; }
    public List<TransactionDto> RecentTransactions { get; set; } = [];
}

public class TransactionDto
{
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Reference { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}