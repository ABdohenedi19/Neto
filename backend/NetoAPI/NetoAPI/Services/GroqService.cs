using NetoAPI.Services.Interfaces;
using System.Net.Http.Json;
using System.Text.Json;

namespace NetoAPI.Services
{
    public class GroqService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IDashboardService _dashboardService;

        public GroqService(HttpClient httpClient, IConfiguration config, IDashboardService dashboardService)
        {
            _httpClient = httpClient;
            _configuration = config;
            _dashboardService = dashboardService;
        }

        public async Task<string> GenerateInvoiceDescriptionAsync(string note)
        {
            var systemPrompt = "You are a professional business writer. Convert notes into a 2-4 sentence professional invoice description in English.";
            var userPrompt = $"Note: {note}";

            return await CallGroqApi(systemPrompt, userPrompt);
        }

        public async Task<string> GetFinancialAdviceAsync(Guid userId)
        {
            var stats = await _dashboardService.GetDashboardAsync(userId);

            var systemPrompt = @"You are a Financial Expert for 'Neto' platform. 
    Analyze data and return ONLY a JSON array of objects. 
    Each object must have: 
    - 'title': (Short professional title)
    - 'description': (1-2 sentences analysis)
    - 'type': (either 'success', 'warning', or 'info' based on the data)
    
    Format: [ { 'title': '...', 'description': '...', 'type': '...' }, ... ]";

            var userPrompt = $@"
        Financial Data:
        - Income: ${stats.TotalIncomeThisMonth}
        - Expenses: ${stats.TotalExpensesThisMonth}
        - Savings Rate: {stats.SavingsRate}%
        - Top Expense: {stats.ExpensesByCategory.OrderByDescending(x => x.Total).FirstOrDefault()?.Category}";

            return await CallGroqApi(systemPrompt, userPrompt);
        }

        public async Task<string> CallGroqApi(string systemPrompt, string userPrompt)
        {
            var apiKey = _configuration["Groq:ApiKey"];
            var model = _configuration["Groq:Model"] ?? "llama-3.3-70b-versatile";
            var url = "https://api.groq.com/openai/v1/chat/completions";

            var payload = new
            {
                model = model,
                messages = new[]
                {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            },
                temperature = 0.7
            };

            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

                var response = await _httpClient.PostAsJsonAsync(url, payload);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return $"Groq Error: {response.StatusCode} - {error}";
                }

                var data = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
                return data.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
            }
            catch (Exception ex)
            {
                return $"Network Error: {ex.Message}";
            }
        }
    }
}