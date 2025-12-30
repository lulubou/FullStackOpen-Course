import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import Countries from './components/Countries'

const Filter = (props) => {
    return (
        <div>
            Find countries : <input value={props.filter} onChange={props.function} />
        </div>
    )
}

const App = () => {
    const [countries, setCountries] = useState([])

    const [newFilter, setNewFilter] = useState('')
    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
    }

    const showCountry = (_country) => () => {
        setNewFilter(_country)
    }

    useEffect(() => {
        countriesService
            .getAll()
            .then(initialCountries => {
                setCountries(initialCountries)
            })
    }, [])

    return (
        <div>
            <Filter value={newFilter} function={handleFilterChange} />
            <Countries countries={countries} filter={newFilter} showFunction={showCountry} />
        </div>
    )
}

export default App