using Microsoft.EntityFrameworkCore;
using NetoAPI.Models;
using NetoAPI.Data.Configurations;
using NetoAPI.Data.Seed;

namespace NetoAPI.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<WalletTransaction> WalletTransactions => Set<WalletTransaction>();
    public DbSet<FixedIncome> FixedIncomes => Set<FixedIncome>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ExpenseGroup> ExpenseGroups => Set<ExpenseGroup>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<AILog> AILogs => Set<AILog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new WalletConfiguration());
        modelBuilder.ApplyConfiguration(new WalletTransactionConfiguration());
        modelBuilder.ApplyConfiguration(new FixedIncomeConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new ExpenseGroupConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectConfiguration());
        modelBuilder.ApplyConfiguration(new InvoiceConfiguration());
        modelBuilder.ApplyConfiguration(new AILogConfiguration());

        // Seed the 3 hardcoded accounts + their wallets
        HardcodedUserSeed.Seed(modelBuilder);
    }
}