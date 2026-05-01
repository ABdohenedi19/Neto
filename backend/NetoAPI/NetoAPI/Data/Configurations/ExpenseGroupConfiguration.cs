using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetoAPI.Models;

namespace NetoAPI.Data.Configurations;

public class ExpenseGroupConfiguration : IEntityTypeConfiguration<ExpenseGroup>
{
    public void Configure(EntityTypeBuilder<ExpenseGroup> builder)
    {
        builder.HasKey(g => g.Id);
        builder.Property(g => g.Name).IsRequired().HasMaxLength(100);
        builder.Property(g => g.Amount).HasColumnType("decimal(18,2)");

        builder.HasOne(g => g.User)
            .WithMany()
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.NoAction); // cascade already handled by Category
    }
}