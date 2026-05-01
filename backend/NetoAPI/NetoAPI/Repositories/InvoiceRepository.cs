using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;

namespace NetoAPI.Repositories;

public class InvoiceRepository(AppDbContext db) : IInvoiceRepository
{
    public Task<Invoice?> GetByProjectIdAsync(Guid projectId, Guid userId) =>
        db.Invoices.FirstOrDefaultAsync(i => i.ProjectId == projectId && i.UserId == userId);

    public Task<int> CountByUserAsync(Guid userId) =>
        db.Invoices.CountAsync(i => i.UserId == userId);

    public async Task AddAsync(Invoice invoice) => await db.Invoices.AddAsync(invoice);

    public Task SaveAsync() => db.SaveChangesAsync();
}