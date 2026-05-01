using Microsoft.AspNetCore.Mvc;
using NetoAPI.Models;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class TransactionController(IWalletService walletService) : ControllerBase
{
    // GET /api/transaction/{userId}
    // GET /api/transaction/{userId}?type=Expense
    // GET /api/transaction/{userId}?type=Income
    // GET /api/transaction/{userId}?from=2026-01-01&to=2026-01-31
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAll(
        Guid userId,
        [FromQuery] string? type,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var transactions = await walletService.GetTransactionsAsync(userId, type, from, to);
        return Ok(transactions);
    }
}