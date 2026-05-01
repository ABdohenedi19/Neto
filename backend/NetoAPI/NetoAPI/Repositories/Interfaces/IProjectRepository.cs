using NetoAPI.Models;

namespace NetoAPI.Repositories.Interfaces;

public interface IProjectRepository
{
    Task<List<Project>> GetAllByUserAsync(Guid userId);
    Task<Project?> GetByIdAsync(Guid id, Guid userId);
    Task AddAsync(Project project);
    Task SaveAsync();
}