namespace NetoAPI.DTOs.FixedIncome;


public class CreateFixedIncomeRequest
{
    public string Label { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}