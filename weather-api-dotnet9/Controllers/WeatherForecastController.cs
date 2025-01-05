using Microsoft.AspNetCore.Mvc;
using weather_api.Services.Interfaces;

namespace weather_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IWeatherService _weatherService;
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IWeatherService weatherService)
        {
            _logger = logger;
            _weatherService = weatherService;
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetWeatherData(string location)
        {
            try
            {
                var weatherData = await _weatherService.GetWeatherDataAsync(location);
                return Ok(weatherData);
            }
            catch (ArgumentException ex) when (ex.Message == "Bad API Request")
            {
                return BadRequest("Bad API Request");
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }
    }
}
