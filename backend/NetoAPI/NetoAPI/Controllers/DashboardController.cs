using Microsoft.AspNetCore.Mvc;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(Guid userId) =>
        Ok(await dashboardService.GetDashboardAsync(userId));
}