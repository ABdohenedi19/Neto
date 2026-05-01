using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetoAPI.Models;

namespace NetoAPI.Data.Configurations;

public class FixedIncomeConfiguration : IEntityTypeConfiguration<FixedIncome>
{
    public void Configure(EntityTypeBuilder<FixedIncome> builder)
    {
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Label).IsRequired().HasMaxLength(150);
        builder.Property(f => f.Amount).HasColumnType("decimal(18,2)");

        builder.HasOne(f => f.User)
            .WithMany(u => u.FixedIncomes)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}