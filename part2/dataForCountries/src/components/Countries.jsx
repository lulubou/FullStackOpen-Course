import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const CountryTitle = (props) => {
    return <h1>{props.country.name.common}</h1>
}

const CountryCapital = (props) => {
    return <li>{props.capital}</li>
}

const CountryCapitals = (props) => {
    const capitals = props.country.capital
    if (capitals.length > 1) {
        return (
            <div>
                Capitals :
                <ul> {capitals.map(cap => <CountryCapital key={cap} capital={cap} />)}</ul>
            </div>
        )
    }
    else { return <div>Capital : {capitals}</div> }
}

const CountryArea = (props) => {
    return <div>Area : {props.country.area}</div>
}

const CountryLanguage = (props) => {
    return <li>{props.language}</li>
}

const CountryLanguages = (props) => {
    return (
        <div>
            <h2>Languages</h2>
            <ul>{Object.values(props.country.languages).map(lang => <CountryLanguage key={lang} language={lang} />)}</ul>
        </div>
    )
}

const CountryFlag = (props) => {
    return <img src={props.country.flags.png} />
}

const CountryCapitalWeather = (props) => {
    if (props.weather) {
        return (
            <div>
                <h2>Weather in {props.country.capital[0]}</h2>
                <div>Temperature : {props.weather.main.temp - 273.15} Celsius</div>
                <img src={`https://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`} />
                <div>Wind : {props.weather.wind.speed} m/s</div>
            </div>
        )
    }
    else { return null }
}

const CountryData = (props) => {
    const [weather, setWeather] = useState(null)

    const lat = props.country.capitalInfo.latlng[0]
    const lon = props.country.capitalInfo.latlng[1]

    useEffect(() => {
        weatherService
            .getWeather(lat, lon)
            .then(weatherData => {
                setWeather(weatherData)
            })
    }, [])

    return (
        <div>
            <CountryTitle country={props.country} />
            <CountryCapitals country={props.country} />
            <CountryArea country={props.country} />
            <CountryLanguages country={props.country} />
            <CountryFlag country={props.country} />
            <CountryCapitalWeather country={props.country} weather={weather} />
        </div>
    )
}

const CountryName = (props) => {
    return <div>{props.country.name.common} <button onClick={props.showFunction(props.country.name.common)}>Show</button></div>
}

const Countries = (props) => {
    const filteredCountries = props.countries.filter((el) => el.name.common.toLowerCase().includes(props.filter.toLowerCase()))
    const countriesLength = filteredCountries.length

    if (countriesLength > 10) { return <div>Too many matches, specify another filter</div> }
    else if (countriesLength == 1) {
        return <CountryData country={filteredCountries[0]} weatherFunction={props.weatherFunction} weather={props.weather} />
    }
    else {
        return <div>{filteredCountries.map(country => <CountryName key={country.name.common} country={country} showFunction={props.showFunction} />)}</div>
    }
}

export default Countries