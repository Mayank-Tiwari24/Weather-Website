class WeatherApp {
    constructor() {
        this.form = document.getElementById('weatherForm');
        this.cityInput = document.getElementById('cityInput');
        this.daysInput = document.getElementById('daysInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.weatherCard = document.getElementById('weatherCard');
        this.loadingState = document.getElementById('loadingState');
        this.weatherContent = document.getElementById('weatherContent');
        this.errorMessage = document.getElementById('errorMessage');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const city = this.cityInput.value.trim();
        const days = this.daysInput.value;

        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        await this.fetchWeatherData(city, days);
    }

    async fetchWeatherData(city, days) {
        this.showLoading();
        this.hideError();

        try {
            const response = await fetch(`http://localhost:8080/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.showError('Failed to fetch weather data. Please check if the API server is running and try again.');
            this.hideLoading();
        }
    }

    displayWeatherData(data) {
        const { weatherResponse, dayTemp } = data;
        const inputCity = this.cityInput.value.trim();
        
        // Update current weather - show input city name first
        document.getElementById('currentCity').textContent = inputCity;
        document.getElementById('currentLocation').textContent = `${weatherResponse.city}${weatherResponse.region ? ', ' + weatherResponse.region : ''}, ${weatherResponse.country}`;
        document.getElementById('currentCondition').textContent = weatherResponse.condition;
        document.getElementById('currentTemp').textContent = Math.round(weatherResponse.temperature);
        
        // Set weather icon
        const iconElement = document.getElementById('currentIcon');
        iconElement.innerHTML = this.getWeatherIcon(weatherResponse.condition);
        
        // Update forecast
        this.displayForecast(dayTemp);
        
        this.hideLoading();
        this.showWeatherContent();
    }

    displayForecast(dayTemp) {
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';

        dayTemp.forEach(day => {
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';
            
            const date = new Date(day.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
            });

            forecastDay.innerHTML = `
                <div class="forecast-date">${formattedDate}</div>
                <div class="forecast-icon">${this.getWeatherIcon('Partly Cloudy', 60)}</div>
                <div class="temp-avg">${Math.round(day.avgTemp)}°C</div>
                <div class="temp-range">
                    <span class="temp-low">${Math.round(day.minTemp)}°</span>
                    <span class="temp-high">${Math.round(day.maxTemp)}°</span>
                </div>
            `;

            forecastGrid.appendChild(forecastDay);
        });
    }

    getWeatherIcon(condition, size = 120) {
        let iconId = 'partly-cloudy'; // default
        
        const conditionLower = condition.toLowerCase();
        
        if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
            iconId = 'sunny';
        } else if (conditionLower.includes('cloud')) {
            if (conditionLower.includes('partly')) {
                iconId = 'partly-cloudy';
            } else {
                iconId = 'cloudy';
            }
        } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
            iconId = 'rainy';
        } else if (conditionLower.includes('snow')) {
            iconId = 'snowy';
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            iconId = 'thunderstorm';
        }

        return `<svg class="weather-svg" width="${size}" height="${size}" viewBox="0 0 100 100"><use href="#${iconId}"></use></svg>`;
    }

    showLoading() {
        this.weatherCard.style.display = 'block';
        this.loadingState.style.display = 'block';
        this.weatherContent.style.display = 'none';
        this.searchBtn.disabled = true;
        this.searchBtn.textContent = 'Loading...';
    }

    hideLoading() {
        this.loadingState.style.display = 'none';
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = 'Get Weather';
    }

    showWeatherContent() {
        this.weatherContent.style.display = 'block';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});