using Microsoft.AspNetCore.Mvc;
using NetoAPI.DTOs.Auth;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await authService.LoginAsync(request);
        if (result is null)
            return Unauthorized(new { message = "Invalid email or password" });
        
        return Ok(result);
    }
}