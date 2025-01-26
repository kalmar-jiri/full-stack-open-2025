const Header = ({ name }) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => (
        <Part part={part.name} exercise={part.exercises} key={part.id} />
      ))}
    </>
  );
};

const Part = ({ part, exercise }) => {
  return (
    <>
      <p>
        {part} {exercise}
      </p>
    </>
  );
};

const Total = ({ parts }) => {
  return (
    <>
      <strong>total of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises</strong>
    </>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;
