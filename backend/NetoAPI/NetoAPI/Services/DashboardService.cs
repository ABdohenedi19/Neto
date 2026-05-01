
using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.DTOs.Dashboard;
using NetoAPI.Models;
using NetoAPI.Services.Interfaces;

namespace NetoAPI.Services;

public class DashboardService(AppDbContext db) : IDashboardService
{
    public async Task<DashboardResponse> GetDashboardAsync(Guid userId)
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        // Current wallet balance 
        var wallet = await db.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId);

        var balance = wallet?.Balance ?? 0;

        //  All transactions for this user 
        var allTransactions = await db.WalletTransactions
            .Where(t => t.Wallet.UserId == userId)
            .ToListAsync();

        //  This month income (Fixed + Project credits) 
        var thisMonthTransactions = allTransactions
            .Where(t => t.CreatedAt >= startOfMonth)
            .ToList();

        var totalIncome = thisMonthTransactions
            .Where(t => t.Type == TransactionType.Income || t.Type == TransactionType.Project || t.Type == TransactionType.TopUp)
            .Sum(t => t.Amount);

        var totalExpenses = thisMonthTransactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var netProfit = totalIncome - totalExpenses;
        var savingsRate = totalIncome > 0 ? Math.Round(netProfit / totalIncome * 100, 2) : 0;

        //  Last 6 months bar chart data 
        var last6Months = Enumerable.Range(0, 6)
            .Select(i => now.AddMonths(-i))
            .Reverse()
            .ToList();

        var barData = last6Months.Select(month =>
        {
            var start = new DateTime(month.Year, month.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var end = start.AddMonths(1);

            var monthTx = allTransactions.Where(t => t.CreatedAt >= start && t.CreatedAt < end).ToList();

            return new MonthlyBarData
            {
                Month = month.ToString("MMM yyyy"),
                Income = monthTx
                    .Where(t => t.Type != TransactionType.Expense)
                    .Sum(t => t.Amount),
                Expenses = monthTx
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Amount)
            };
        }).ToList();

        //  Pie chart: expenses by category this month 
        var expenseGroupIds = thisMonthTransactions
            .Where(t => t.Type == TransactionType.Expense)
            .Select(t => t.Reference)
            .ToList();

        var categoriesWithGroups = await db.Categories
            .Include(c => c.ExpenseGroups)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        var pieData = categoriesWithGroups
            .Select(c => new CategoryPieData
            {
                Category = c.Name,
                Total = thisMonthTransactions
                    .Where(t => t.Type == TransactionType.Expense &&
                                c.ExpenseGroups.Any(g => t.Reference.Contains(g.Name)))
                    .Sum(t => t.Amount)
            })
            .Where(p => p.Total > 0)
            .ToList();

        //  Wallet trend: last 6 months ending balance 
        var walletTrend = last6Months.Select(month =>
        {
            var end = new DateTime(month.Year, month.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(1);
            var txUntilEnd = allTransactions.Where(t => t.CreatedAt < end).ToList();

            return txUntilEnd
                .Sum(t => t.Type == TransactionType.Expense ? -t.Amount : t.Amount);
        }).ToList();

        //  Project profitability table 
        var projects = await db.Projects
            .Where(p => p.UserId == userId && p.Status == ProjectStatus.Received)
            .ToListAsync();

        var projectRows = projects.Select(p => new ProjectProfitRow
        {
            ProjectName = p.Name,
            Revenue = p.Amount,
            NetMargin = p.Amount,          // no linked expenses per project in MVP
            BelowThreshold = p.Amount < 100 // warn if project earned less than $100
        }).ToList();

        return new DashboardResponse
        {
            WalletBalance = balance,
            TotalIncomeThisMonth = totalIncome,
            TotalExpensesThisMonth = totalExpenses,
            NetProfit = netProfit,
            SavingsRate = savingsRate,
            Last6MonthsBar = barData,
            ExpensesByCategory = pieData,
            WalletTrend = walletTrend,
            ProjectProfitability = projectRows
        };
    }
}