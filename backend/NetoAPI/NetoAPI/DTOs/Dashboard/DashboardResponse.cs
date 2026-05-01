namespace NetoAPI.DTOs.Dashboard;

public class DashboardResponse
{
    public decimal WalletBalance { get; set; }
    public decimal TotalIncomeThisMonth { get; set; }
    public decimal TotalExpensesThisMonth { get; set; }
    public decimal NetProfit { get; set; }           // Income - Expenses
    public decimal SavingsRate { get; set; }          // NetProfit / Income * 100
    public List<MonthlyBarData> Last6MonthsBar { get; set; } = [];
    public List<CategoryPieData> ExpensesByCategory { get; set; } = [];
    public List<decimal> WalletTrend { get; set; } = []; // last 6 months balances
    public List<ProjectProfitRow> ProjectProfitability { get; set; } = [];
}

public class MonthlyBarData
{
    public string Month { get; set; } = string.Empty;
    public decimal Income { get; set; }
    public decimal Expenses { get; set; }
}

public class CategoryPieData
{
    public string Category { get; set; } = string.Empty;
    public decimal Total { get; set; }
}

public class ProjectProfitRow
{
    public string ProjectName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public decimal NetMargin { get; set; }
    public bool BelowThreshold { get; set; } // warn if margin too low
}