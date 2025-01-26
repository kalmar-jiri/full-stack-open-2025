// export default function Note({ note }) {
//   return <li>{note.content}</li>;
// }

// // 2nd way of doing that
const Note = ({ note, toggleImportance }) => {
  const label = note.important ? '🟥' : '🟩';

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;
