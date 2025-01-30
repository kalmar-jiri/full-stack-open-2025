export default function Notification({ message, color }) {
  const style = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    border: 'solid 5px',
    borderRadius: '10px',
    padding: 10,
    marginBottom: '25px',
  };
  if (message === null) {
    return null;
  }
  return <div style={style}>{message}</div>;
}
