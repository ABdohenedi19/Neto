namespace NetoAPI.Models;

public enum AIFeature { InvoiceDescription, FinancialAnalysis }

public class AILog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public AIFeature Feature { get; set; }
    // Content is never stored — privacy by design
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}