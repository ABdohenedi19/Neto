namespace NetoAPI.Services.Interfaces
{
    public interface IAiService
    {
        Task<string> GenerateInvoiceDescriptionAsync(string note);
        Task<string> GetFinancialAdviceAsync(Guid userId);
    }
}
