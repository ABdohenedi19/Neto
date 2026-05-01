namespace NetoAPI.DTOs.Category;

public class UpdateExpenseGroupRequest
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public bool IsRecurring { get; set; }
}
