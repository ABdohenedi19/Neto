using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetoAPI.Models;

namespace NetoAPI.Data.Configurations;

public class AILogConfiguration : IEntityTypeConfiguration<AILog>
{
    public void Configure(EntityTypeBuilder<AILog> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Feature).HasConversion<string>();

        builder.HasOne(a => a.User)
            .WithMany(u => u.AILogs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}