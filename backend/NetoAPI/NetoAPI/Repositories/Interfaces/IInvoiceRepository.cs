using NetoAPI.Models;

namespace NetoAPI.Repositories.Interfaces;

public interface IInvoiceRepository
{
    Task<Invoice?> GetByProjectIdAsync(Guid projectId, Guid userId);
    Task<int> CountByUserAsync(Guid userId); // used for invoice number generation
    Task AddAsync(Invoice invoice);
    Task SaveAsync();
}