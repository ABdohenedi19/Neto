using Microsoft.AspNetCore.Mvc;
using NetoAPI.DTOs.Invoice;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoiceController(IInvoiceService invoiceService) : ControllerBase
{
    [HttpPost("{userId}")]
    public async Task<IActionResult> Create(Guid userId, [FromBody] CreateInvoiceRequest request)
    {
        var invoice = await invoiceService.CreateInvoiceAsync(userId, request);

        if (invoice is null)
            return NotFound(new { message = "Project not found" });

        var response = new InvoiceResponse
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

        return Ok(response);
    }

    [HttpGet("{userId}/project/{projectId}")]
    public async Task<IActionResult> GetByProject(Guid userId, Guid projectId)
    {
        var invoice = await invoiceService.GetByProjectAsync(userId, projectId);
        if (invoice is null) return NotFound();
        return Ok(invoice);
    }
}