using Microsoft.EntityFrameworkCore;
using NetoAPI.Data;
using NetoAPI.Repositories;
using NetoAPI.Repositories.Interfaces;
using NetoAPI.Services;
using NetoAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

//  Database 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//  HttpClient 
builder.Services.AddHttpClient();

// CORS 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

//  Repositories 
builder.Services.AddScoped<IWalletRepository, WalletRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IExpenseGroupRepository, ExpenseGroupRepository>();
builder.Services.AddScoped<IFixedIncomeRepository, FixedIncomeRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();

// Services 
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IWalletService, WalletService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IFixedIncomeService, FixedIncomeService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// AI Service
builder.Services.AddHttpClient<IAiService, GroqService>();

//  Background Service 
builder.Services.AddHostedService<MonthlyJobService>();

builder.Services.AddControllers();

//  Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

//  CORS
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();
app.Run();