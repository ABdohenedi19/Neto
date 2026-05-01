using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetoAPI.Models;

namespace NetoAPI.Data.Configurations;

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.ClientName).IsRequired().HasMaxLength(200);
        builder.Property(i => i.Description).IsRequired().HasMaxLength(2000);
        builder.Property(i => i.Amount).HasColumnType("decimal(18,2)");
        builder.Property(i => i.InvoiceNumber).IsRequired().HasMaxLength(20);
        builder.HasIndex(i => i.InvoiceNumber).IsUnique();
        builder.Property(i => i.PdfUrl).HasMaxLength(500);

        builder.HasOne(i => i.User)
            .WithMany()
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.NoAction); // cascade handled by Project
    }
}