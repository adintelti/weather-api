
using Microsoft.AspNetCore.Builder;
using Scalar.AspNetCore;
using weather_api.Configuration;
using weather_api.Services.Interfaces;
using weather_api.Services;

namespace weather_api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddOpenApi();

            builder.Services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = builder.Configuration.GetSection("Redis")["ConnectionString"];
                options.InstanceName = "WeatherAPI_";
            });

            builder.Services.Configure<WeatherApiOptions>(builder.Configuration.GetSection("WeatherApi"));

            builder.Services.AddHttpClient<IWeatherService, WeatherService>(client =>
            {
                var options = builder.Configuration.GetSection("WeatherApi").Get<WeatherApiOptions>();
                client.BaseAddress = new Uri(options.BaseUrl);
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                if (builder.Configuration.GetValue<bool>("Settings:UseScalar") == true)
                {
                    app.MapScalarApiReference();
                }
                else
                {
                    app.UseSwaggerUI(options =>
                    {
                        options.SwaggerEndpoint("/openapi/v1.json", "Weather API v1");
                    });
                }
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
