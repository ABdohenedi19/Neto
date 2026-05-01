namespace NetoAPI.DTOs.Wallet;

public class TopUpRequest
{
    public decimal Amount { get; set; }
    public string? Note { get; set; } // optional reference note
}