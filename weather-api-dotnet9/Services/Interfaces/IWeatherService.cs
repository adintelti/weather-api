using weather_api.Models;

namespace weather_api.Services.Interfaces
{
    public interface IWeatherService
    {
        Task<WeatherDataModel> GetWeatherDataAsync(string location);
    }
}
