
using NetoAPI.DTOs.Invoice;

namespace NetoAPI.Services.Interfaces;

public interface IInvoiceService
{
    Task<InvoiceResponse?> CreateInvoiceAsync(Guid userId, CreateInvoiceRequest request);
    Task<InvoiceResponse?> GetByProjectAsync(Guid userId, Guid projectId);
}