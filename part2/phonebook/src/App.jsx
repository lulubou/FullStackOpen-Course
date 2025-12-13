import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
    return (
        <div>
            Filter results shown with : <input value={props.filter} onChange={props.function} />
        </div>
    )
}

const PersonForm = (props) => {
    return (
        <form onSubmit={props.submitFunction}>
            <div>
                Name : <input value={props.name} onChange={props.nameFunction} />
            </div>
            <div>
                Phone Number : <input value={props.phoneNumber} onChange={props.phoneNumberFunction} />
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    )
}

const Person = (props) => {
    return <div>{props.name} : {props.phoneNumber}</div>
}

const Persons = (props) => {
    return <div>{props.persons.filter((el) => el.name.toLowerCase().includes(props.filter.toLowerCase())).map(person => <Person key={person.id} name={person.name} phoneNumber={person.phoneNumber} />)}</div>
}

const App = () => {
    const [persons, setPersons] = useState([])

    const [newFilter, setNewFilter] = useState('')
    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
    }

    const [newName, setNewName] = useState('')
    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const handlePhoneNumberChange = (event) => {
        setNewPhoneNumber(event.target.value)
    }

    const addPerson = (e) => {
        e.preventDefault()

        if (persons.some(element => element.name === newName)) {
            alert(`${newName} is already added to phonebook.`)
            setNewName('')
            setNewPhoneNumber('')
        }
        else {
            const personObject = {
                name: newName,
                phoneNumber: newPhoneNumber,
                id: persons.length + 1
            }

            setPersons(persons.concat(personObject))
            setNewName('')
            setNewPhoneNumber('')
        }
    }

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                setPersons(response.data)
            })
    }, [])

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={newFilter} function={handleFilterChange} />
            <h3>Add a new contact</h3>
            <PersonForm
                submitFunction={addPerson}
                name={newName}
                nameFunction={handleNameChange}
                phoneNumber={newPhoneNumber}
                phoneNumberFunction={handlePhoneNumberChange}
            />
            <h3>Numbers</h3>
            <Persons persons={persons} filter={newFilter} />
        </div>
    )
}

export default App