using Microsoft.AspNetCore.Mvc;
using NetoAPI.DTOs.FixedIncome;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class FixedIncomeController(IFixedIncomeService service) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAll(Guid userId) =>
        Ok(await service.GetAllAsync(userId));

    [HttpPost("{userId}")]
    public async Task<IActionResult> Create(Guid userId, [FromBody] CreateFixedIncomeRequest request)
    {
        var income = await service.CreateAsync(userId, request);
        return CreatedAtAction(nameof(GetAll), new { userId }, income);
    }

    [HttpPatch("{userId}/{id}/toggle")]
    public async Task<IActionResult> Toggle(Guid userId, Guid id)
    {
        var success = await service.ToggleAsync(id, userId);
        if (!success)
            return NotFound();
        
        return Ok(new { message = "Status toggled successfully" });
    }

    [HttpDelete("{userId}/{id}")]
    public async Task<IActionResult> Delete(Guid userId, Guid id)
    {
        var success = await service.DeleteAsync(id, userId);
        if (!success)
            return NotFound();
        
        return NoContent();
    }
}