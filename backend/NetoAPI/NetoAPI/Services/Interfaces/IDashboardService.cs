
using NetoAPI.DTOs.Dashboard;


namespace NetoAPI.Services.Interfaces;


public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync(Guid userId);
}