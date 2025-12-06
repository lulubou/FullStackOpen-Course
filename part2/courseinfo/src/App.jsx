const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Content = ({ parts }) => (
    <div>
        {parts.map(part =>
            <Part key={part.id} part={part} />
        )}
    </div>
)

const Total = (props) => <p>Total of {props.total} exercises</p>

const Course = (props) => {
    return (
        <div>
            <Header course={props.course.name} />
            <Content parts={props.course.parts} />
            <Total
                total={props.course.parts.reduce((partialSum, element) => partialSum + element.exercises, 0)}
            />
        </div>
    )
}

const App = () => {
    const course = {
        id: 1,
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10,
                id: 1
            },
            {
                name: 'Using props to pass data',
                exercises: 7,
                id: 2
            },
            {
                name: 'State of a component',
                exercises: 14,
                id: 3
            },
            {
                name: 'Learning Javascript',
                exercises: 11,
                id: 4
            },
            {
                name: 'Learning Javascript pt.2',
                exercises: 20,
                id: 5
            },
            {
                name: 'Learning Javascript pt.3',
                exercises: 10,
                id: 6
            }
        ]
    }

    return <Course course={course} />
}

export default App