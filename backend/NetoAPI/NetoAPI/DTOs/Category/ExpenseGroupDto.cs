namespace NetoAPI.DTOs.Category;

public class ExpenseGroupDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public bool IsRecurring { get; set; }
    public DateTime CreatedAt { get; set; }
}