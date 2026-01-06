const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give database password as argument.')
    process.exit(1)
}

if (process.argv.length === 4) {
    console.log('Give phone number if you want to save a new person.')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://phonebook_admin:${password}@clusterphonebook.mpdzm68.mongodb.net/phonebookApp?appName=ClusterPhonebook`
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook :')
        result.forEach(person => {
            console.log(`${person.name} ${person.phoneNumber}`)
        })
        mongoose.connection.close()
    })
}
else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        phoneNumber: number,
    })

    person.save().then(() => {
        console.log(`Added ${name} (phone number : ${number}) to phonebook`)
        mongoose.connection.close()
    })
}