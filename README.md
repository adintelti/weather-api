# Weather-Api

Weather API built with a NodeJS and C# versions that fetches weather data from the openweathermap.org API. The application implements caching using Redis.

## Prerequisites

- Node.js installed on your system.
- Redis
- [api.openweathermap.org/data/2.5/weather](https://api.openweathermap.org/data/2.5/weather) API Key on env configuration file for (node version)
- [visualcrossing.com/VisualCrossingWebServices](https://www.visualcrossing.com/weather-api) API Key on appsetting.json file for (dotnet 9 version)

## Installation Setup

### 1. Clone the Repository

```bash
git clone https://github.com/thweookhine/Weather-API.git

# Node version
# Navigate to the project Directory
cd Weather-API
cd weather-api-node
```

### 2. Install Packages

```
npm install
```

### 3. Set up Environment variables

```
touch .env
Note: refer env_sample for environment variables
```

### 4. Run Application

```
npm start
```

## Usage

### With curl

```
curl "http://127.0.0.1:3000?city=barueri"
```

### With Postman

```
call "http://127.0.0.1:3000?city=barueri" with get method
```

# .NET 9 version

# Navigate to the project Directory
cd Weather-API
cd weather-api-dotnet9

2. Restore dependencies:
   ```bash
    dotnet restore
    ```
3. Start the application:
   ```bash
    dotnet run

3. Application will open at the default broweser at the following address [http://localhost:5142](https://localhost:7166/scalar/v1) with Scalar web api documentation page, it can also be changed to swagger by changing the value UseScalar in the appsettings file.

## Usage

Using scalar you can send a request to retrieve weather data from your chosen location.

For More information about this project, visit the [Weather API Roadmap](https://roadmap.sh/projects/weather-api-wrapper-service)
