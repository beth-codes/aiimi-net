
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddSingleton<ExcelService>();

          // Configure CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAnyOrigin",
            builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
       // if (env.IsDevelopment())
       // {
            app.UseDeveloperExceptionPage();
       // }
       // else
       // {
            // Configure error handling middleware for non-development environments
            //app.UseExceptionHandler("/error");
       // }

        app.UseCors(options => options
            .SetIsOriginAllowed(origin => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());

        app.UseRouting();


       // Configure endpoint routing
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapGet("/", async context =>
            {
                await context.Response.WriteAsync("Welcome to the API!");
            });
        });
     
    }
}