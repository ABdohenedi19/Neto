using Microsoft.AspNetCore.Mvc;
using NetoAPI.DTOs.Project;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ProjectController(IProjectService projectService) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAll(Guid userId) =>
        Ok(await projectService.GetAllAsync(userId));

    [HttpPost("{userId}")]
    public async Task<IActionResult> Create(Guid userId, [FromBody] ProjectResponse request)
    {
        var project = await projectService.CreateAsync(userId, request);
        return CreatedAtAction(nameof(GetAll), new { userId }, project);
    }

    [HttpPut("{userId}/{projectId}")]
    public async Task<IActionResult> Update(Guid userId, Guid projectId, [FromBody] UpdateProjectRequest request)
    {
        var success = await projectService.UpdateAsync(projectId, userId, request);
        if (!success) return NotFound(new { message = "Project not found or already received" });
        return NoContent();
    }

    [HttpPatch("{userId}/{projectId}/receive")]
    public async Task<IActionResult> MarkReceived(Guid userId, Guid projectId)
    {
        var success = await projectService.MarkAsReceivedAsync(projectId, userId);
        if (!success) return BadRequest(new { message = "Project not found or already received" });
        return Ok(new { message = "Project marked as received, wallet credited" });
    }
}