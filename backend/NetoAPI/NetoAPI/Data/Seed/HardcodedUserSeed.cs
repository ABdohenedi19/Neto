using Microsoft.EntityFrameworkCore;
using NetoAPI.Models;

namespace NetoAPI.Data.Seed;

public static class HardcodedUserSeed
{
    // Fixed GUIDs so migration doesn't re-insert on every update
    private static readonly Guid OsamaId   = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid AbdalId   = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid RoulianaId = Guid.Parse("33333333-3333-3333-3333-333333333333");

    private static readonly Guid OsamaWalletId   = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid AbdalWalletId   = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    private static readonly Guid RoulianaWalletId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

    public static void Seed(ModelBuilder modelBuilder)
    {
        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = OsamaId,
                Name = "Osama Reda",
                Email = "osama@salamhack.com",
                Password = "12345",
                PreferredLanguage = "en",
                CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                Id = AbdalId,
                Name = "Abdalrahman Henedi",
                Email = "abdalrahman@salamhack.com",
                Password = "12345",
                PreferredLanguage = "en",
                CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                Id = RoulianaId,
                Name = "Rouliana Khalil",
                Email = "rouliana@salamhack.com",
                Password = "12345",
                PreferredLanguage = "en",
                CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        // Seed a Wallet for each user (starting balance = 0)
        modelBuilder.Entity<Wallet>().HasData(
            new Wallet
            {
                Id = OsamaWalletId,
                UserId = OsamaId,
                Balance = 0,
                UpdatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Wallet
            {
                Id = AbdalWalletId,
                UserId = AbdalId,
                Balance = 0,
                UpdatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Wallet
            {
                Id = RoulianaWalletId,
                UserId = RoulianaId,
                Balance = 0,
                UpdatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}