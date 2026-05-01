using Microsoft.AspNetCore.Mvc;
using NetoAPI.DTOs.Wallet;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WalletController(IWalletService walletService) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(Guid userId)
    {
        var wallet = await walletService.GetWalletAsync(userId);
        if (wallet is null) return NotFound();
        return Ok(wallet);
    }

    [HttpPost("{userId}/topup")]
    public async Task<IActionResult> TopUp(Guid userId, [FromBody] TopUpRequest request)
    {
        var success = await walletService.TopUpAsync(userId, request);
        if (!success) return NotFound(new { message = "Wallet not found" });
        return Ok(new { message = "Balance updated successfully" });
    }
}