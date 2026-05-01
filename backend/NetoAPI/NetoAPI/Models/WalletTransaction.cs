namespace NetoAPI.Models;

public enum TransactionType { TopUp, Income, Expense, Project }

public class WalletTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WalletId { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public string Reference { get; set; } = string.Empty; // project name, label, etc.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Wallet Wallet { get; set; } = null!;
}