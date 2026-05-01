using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NetoAPI.DTOs.AI;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService) => _aiService = aiService;

        [HttpPost("generate-invoice-desc")]
        public async Task<IActionResult> GenerateDesc([FromBody] AiInvoiceRequest request)
        {
            var result = await _aiService.GenerateInvoiceDescriptionAsync(request.Note);
            return Ok(new { description = result });
        }

        [HttpGet("financial-advice/{userId}")]
        public async Task<IActionResult> GetAdvice(Guid userId)
        {
            var result = await _aiService.GetFinancialAdviceAsync(userId);
            return Ok(new { advice = result });
        }
    }
}
