import { useState } from 'react'

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
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', phoneNumber: '040-123456', id: 1 },
        { name: 'Ada Lovelace', phoneNumber: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', phoneNumber: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', phoneNumber: '39-23-6423122', id: 4 }
    ])

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