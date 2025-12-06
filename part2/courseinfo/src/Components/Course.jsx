const Header2 = (props) => <h2>{props.course}</h2>

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
            <Header2 course={props.course.name} />
            <Content parts={props.course.parts} />
            <Total
                total={props.course.parts.reduce((partialSum, element) => partialSum + element.exercises, 0)}
            />
        </div>
    )
}

export default Course