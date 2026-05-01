using Microsoft.AspNetCore.Mvc;
using NetoAPI.DTOs.Category;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAll(
        Guid userId,
        [FromQuery] string? search,
        [FromQuery] bool? hasExpenses) =>
        Ok(await categoryService.GetAllAsync(userId, search, hasExpenses));

    [HttpPost("{userId}")]
    public async Task<IActionResult> Create(Guid userId, [FromBody] CreateCategoryRequest request)
    {
        var category = await categoryService.CreateAsync(userId, request);
        return CreatedAtAction(nameof(GetAll), new { userId }, category);
    }

    [HttpPut("{userId}/{categoryId}")]
    public async Task<IActionResult> Update(Guid userId, Guid categoryId, [FromBody] UpdateCategoryRequest request)
    {
        var success = await categoryService.UpdateAsync(categoryId, userId, request);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{userId}/{categoryId}")]
    public async Task<IActionResult> Delete(Guid userId, Guid categoryId)
    {
        var success = await categoryService.DeleteAsync(categoryId, userId);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPost("{userId}/{categoryId}/groups")]
    public async Task<IActionResult> AddGroup(Guid userId, Guid categoryId, [FromBody] CreateExpenseGroupRequest request)
    {
        var group = await categoryService.AddExpenseGroupAsync(categoryId, userId, request);
        if (group is null) return NotFound(new { message = "Category not found" });
        return Ok(group);
    }

    [HttpGet("{userId}/groups/recurring")]
    public async Task<IActionResult> GetRecurring(Guid userId) =>
        Ok(await categoryService.GetRecurringGroupsAsync(userId));

    [HttpPut("{userId}/groups/{groupId}")]
    public async Task<IActionResult> UpdateGroup(Guid userId, Guid groupId, [FromBody] UpdateExpenseGroupRequest request)
    {
        var success = await categoryService.UpdateExpenseGroupAsync(groupId, userId, request);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{userId}/groups/{groupId}")]
    public async Task<IActionResult> DeleteGroup(Guid userId, Guid groupId)
    {
        var success = await categoryService.DeleteExpenseGroupAsync(groupId, userId);
        if (!success) return NotFound();
        return NoContent();
    }
}