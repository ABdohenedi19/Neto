using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.DTOs.Auth;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Services;

public class AuthService(AppDbContext db) : IAuthService
{
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // Simple plain-text match against the 3 hardcoded seeded accounts
        var user = await db.Users.FirstOrDefaultAsync(u =>
            u.Email == request.Email && u.Password == request.Password);

        if (user is null) return null;

        return new LoginResponse
        {
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            PreferredLanguage = user.PreferredLanguage
        };
    }
}