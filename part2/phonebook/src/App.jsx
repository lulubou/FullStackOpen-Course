import { useState, useEffect } from 'react'
import personService from './services/persons'

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
    return <div>{props.person.name} : {props.person.phoneNumber} <button onClick={props.deleteAction(props.person)}>Delete</button></div>
}

const Persons = (props) => {
    return <div>{props.persons.filter((el) => el.name.toLowerCase().includes(props.filter.toLowerCase())).map(person => <Person key={person.id} person={person} deleteAction={props.deleteFunction} />)}</div>
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
            if (confirm(`${newName} is already added to phonebook, do you want to replace the old number with a new one?`)) {
                const foundPerson = persons.find(el => el.name === newName)
                const changedPerson = { ...foundPerson, phoneNumber: newPhoneNumber }
                personService
                    .update(changedPerson.id, changedPerson)
                    .then(response => {
                        setPersons(persons.map(p => p.id === changedPerson.id ? response : p))
                        setNewName('')
                        setNewPhoneNumber('')
                    })
                    .catch(error => {
                        alert(
                            `Error modifying ${foundPerson.name}'s phone number : ${error}.`
                        )
                    })
            }
        }
        else {
            const personObject = {
                name: newName,
                phoneNumber: newPhoneNumber
            }

            personService
                .create(personObject)
                .then(response => {
                    setPersons(persons.concat(response))
                    setNewName('')
                    setNewPhoneNumber('')
                })
        }
    }

    const deletePerson = (_person) => () => {
        if (confirm(`Do you want to delete ${_person.name} from the server?`)) {
            personService
                .deletePerson(_person.id)
                .then(response => {
                    setPersons(persons.filter(p => p.id !== _person.id))
                })
                .catch(error => {
                    alert(
                        `${_person.name} was already deleted from server.`
                    )
                    setPersons(persons.filter(p => p.id !== _person.id))
                })
        }
    }

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
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
            <Persons persons={persons} filter={newFilter} deleteFunction={deletePerson} />
        </div>
    )
}

export default App