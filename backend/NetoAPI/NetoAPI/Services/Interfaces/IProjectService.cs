
using NetoAPI.DTOs.Project;
using NetoAPI.Models;

namespace NetoAPI.Services.Interfaces;

public interface IProjectService
{
    Task<List<ProjectResponse>> GetAllAsync(Guid userId);
    Task<ProjectResponse> CreateAsync(Guid userId, ProjectResponse request);
    Task<bool> UpdateAsync(Guid projectId, Guid userId, UpdateProjectRequest request);
    Task<bool> MarkAsReceivedAsync(Guid projectId, Guid userId);
}