using NetoAPI.DTOs.Invoice;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Services;

public class InvoiceService(
    IInvoiceRepository invoiceRepo,
    IProjectRepository projectRepo) : IInvoiceService
{
    public async Task<InvoiceResponse?> CreateInvoiceAsync(Guid userId, CreateInvoiceRequest request)
    {
        var project = await projectRepo.GetByIdAsync(request.ProjectId, userId);
        if (project is null) return null;

        // Generate unique invoice number e.g. INV-0001
        var count = await invoiceRepo.CountByUserAsync(userId);
        var invoiceNumber = $"INV-{(count + 1):D4}";

        var invoice = new Invoice
        {
            UserId = userId,
            ProjectId = request.ProjectId,
            ClientName = request.ClientName,
            Description = request.Description,
            Amount = request.Amount,
            DueDate = request.DueDate,
            InvoiceNumber = invoiceNumber
        };

        await invoiceRepo.AddAsync(invoice);
        await invoiceRepo.SaveAsync();

        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse?> GetByProjectAsync(Guid userId, Guid projectId)
    {
        var invoice = await invoiceRepo.GetByProjectIdAsync(projectId, userId);
        return invoice is null ? null : MapToResponse(invoice);
    }

    private static InvoiceResponse MapToResponse(Invoice invoice) => new()
    {
        Id = invoice.Id,
        InvoiceNumber = invoice.InvoiceNumber,
        ClientName = invoice.ClientName,
        Description = invoice.Description,
        Amount = invoice.Amount,
        DueDate = invoice.DueDate,
        PdfUrl = invoice.PdfUrl,
        CreatedAt = invoice.CreatedAt
    };
}