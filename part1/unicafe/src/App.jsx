import { useState } from 'react'

// Component that renders the header of the page
const Header = (props) => <h1>{props.text}</h1>

// Component that renders a second-degree header
const Header2 = (props) => <h2>{props.text}</h2>

// Button component
const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

// Component that renders a statistics line
const StatisticLine = (props) => {
    return (
        <tr>
            <td>{props.text}</td>
            <td>{props.value}</td>
        </tr>
    )
}

// Function to get the sum of the elements of an array
function getArraySum(array) {
    return array.reduce((partialSum, element) => partialSum + element, 0)
}

// Function to get the average of the elements of an array
function getArrayAverage(array) {
    return (array[0] - array[2]) / (getArraySum(array) === 0 ? 1 : getArraySum(array))
}

// Function to get the percentage of positive reviews
function getPositivePerc(array) {
    return array[0] / (getArraySum(array) === 0 ? 1 : getArraySum(array))
}

// Component that renders all the statistics
const Statistics = (props) => {
    if (getArraySum([props.votes[0].value, props.votes[1].value, props.votes[2].value]) === 0) {
        return (
            <div>
                <Header2 text="Statistics" />
                <p>No feedback given</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <Header2 text="Statistics" />
                <table>
                    <tbody>
                        <StatisticLine text={props.votes[0].label} value={props.votes[0].value} />
                        <StatisticLine text={props.votes[1].label} value={props.votes[1].value} />
                        <StatisticLine text={props.votes[2].label} value={props.votes[2].value} />
                        <StatisticLine text="Total" value={getArraySum([props.votes[0].value, props.votes[1].value, props.votes[2].value])} />
                        <StatisticLine text="Average" value={getArrayAverage([props.votes[0].value, props.votes[1].value, props.votes[2].value])} />
                        <StatisticLine text="Positive" value={getPositivePerc([props.votes[0].value, props.votes[1].value, props.votes[2].value]) + " %"} />
                    </tbody>
                </table>
            </div>
        )
    }
}

// Main component of the application
const App = () => {
    // save clicks of each button to its own state
    const header = "Give feedback"
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const votes = [
        {
            label: "Good",
            value: good
        },
        {
            label: "Neutral",
            value: neutral
        },
        {
            label: "Bad",
            value: bad
        }
    ]

    const handleClickGood = () => setGood(good + 1)
    const handleClickNeutral = () => setNeutral(neutral + 1)
    const handleClickBad = () => setBad(bad + 1)

    return (
        <div>
            <Header text={header} />
            <Button onClick={handleClickGood} text={votes[0].label} />
            <Button onClick={handleClickNeutral} text={votes[1].label} />
            <Button onClick={handleClickBad} text={votes[2].label} />
            <Statistics votes={votes} />
        </div>
    )
}

export default App