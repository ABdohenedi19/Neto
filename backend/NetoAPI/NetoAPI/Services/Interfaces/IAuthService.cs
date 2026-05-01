using NetoAPI.DTOs.Auth;


namespace NetoAPI.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}