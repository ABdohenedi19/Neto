using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;

namespace NetoAPI.Repositories;

public class ProjectRepository(AppDbContext db) : IProjectRepository
{
    public Task<List<Project>> GetAllByUserAsync(Guid userId) =>
        db.Projects
            .Include(p => p.Invoice)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

    public Task<Project?> GetByIdAsync(Guid id, Guid userId) =>
        db.Projects.Include(p => p.Invoice)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    public async Task AddAsync(Project project) => await db.Projects.AddAsync(project);

    public Task SaveAsync() => db.SaveChangesAsync();
}