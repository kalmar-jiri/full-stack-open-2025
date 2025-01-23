import { useState } from 'react';

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Display = ({ value }) => <strong>{value}</strong>;

const App = () => {
  const [value, setValue] = useState(10);

  const hello = who => () => console.log('hello', who);

  // This function returns a function
  const setToValue = newValue => () => {
    console.log(`value now ${newValue}`);
    setValue(newValue);
  };

  // This does not, but w/ the modified buttons ensures the same functionality
  const setToValue2 = newValue => {
    console.log(`value now ${newValue}`);
    setValue(newValue);
  };

  return (
    <>
      <p>STATE</p>
      <Display value={value} />
      <hr />
      <Button onClick={() => setToValue2(1000)} text="1000" />
      <Button onClick={() => setToValue2(0)} text="reset" />
      <Button onClick={() => setToValue2(value + 1)} text="++" />
    </>
  );
};

export default App;
