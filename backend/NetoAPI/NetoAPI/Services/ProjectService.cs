
using NetoAPI.DTOs.Project;
using NetoAPI.Models;
using NetoAPI.Repositories.Interfaces;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Services;

public class ProjectService(
    IProjectRepository projectRepo,
    IWalletRepository walletRepo) : IProjectService
{
    public async Task<List<ProjectResponse>> GetAllAsync(Guid userId)
    {
        var projects = await projectRepo.GetAllByUserAsync(userId);

        return projects.Select(p => new ProjectResponse
        {
            Id = p.Id,
            Name = p.Name,
            ClientName = p.ClientName,
            Amount = p.Amount,
            Status = p.Status.ToString(),
            Date = p.Date,
            CreatedAt = p.CreatedAt
        }).ToList();
    }

    public async Task<ProjectResponse> CreateAsync(Guid userId, ProjectResponse request)
    {
        var project = new Project
        {
            UserId = userId,
            Name = request.Name,
            ClientName = request.ClientName,
            Amount = request.Amount,
            Date = request.Date
        };

        await projectRepo.AddAsync(project);
        await projectRepo.SaveAsync();

        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            ClientName = project.ClientName,
            Amount = project.Amount,
            Status = project.Status.ToString(),
            Date = project.Date,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(Guid projectId, Guid userId, UpdateProjectRequest request)
    {
        var project = await projectRepo.GetByIdAsync(projectId, userId);

        // Cannot update a project that has already been received
        if (project is null || project.Status == ProjectStatus.Received) return false;

        project.Name = request.Name;
        project.ClientName = request.ClientName;
        project.Amount = request.Amount;
        project.Date = request.Date;

        await projectRepo.SaveAsync();
        return true;
    }

    public async Task<bool> MarkAsReceivedAsync(Guid projectId, Guid userId)
    {
        var project = await projectRepo.GetByIdAsync(projectId, userId);
        if (project is null || project.Status == ProjectStatus.Received) return false;

        var wallet = await walletRepo.GetByUserIdAsync(userId);
        if (wallet is null) return false;

        project.Status = ProjectStatus.Received;

        // Credit project amount to wallet
        wallet.Balance += project.Amount;
        await walletRepo.AddTransactionAsync(new WalletTransaction
        {
            WalletId = wallet.Id,
            Type = TransactionType.Project,
            Amount = project.Amount,
            Reference = $"Project: {project.Name}"
        });
        await walletRepo.UpdateBalanceAsync(userId, wallet.Balance);
        await walletRepo.SaveAsync();
        await projectRepo.SaveAsync();
        return true;
    }
}