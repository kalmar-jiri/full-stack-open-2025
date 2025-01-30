export default function Filter({ searchName, handleSearchChange }) {
  return (
    <div>
      🔎
      <input value={searchName} onChange={handleSearchChange} />
    </div>
  );
}
