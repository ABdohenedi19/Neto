namespace NetoAPI.DTOs.Invoice;


public class CreateInvoiceRequest
{
    public Guid ProjectId { get; set; }
    public string ClientName { get; set; } = string.Empty;

    // User writes the full description manually — no AI involvement
    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
}