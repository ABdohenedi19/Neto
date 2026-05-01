namespace NetoAPI.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "ar";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Wallet? Wallet { get; set; }
    public ICollection<FixedIncome> FixedIncomes { get; set; } = [];
    public ICollection<Category> Categories { get; set; } = [];
    public ICollection<Project> Projects { get; set; } = [];
    public ICollection<AILog> AILogs { get; set; } = [];
}