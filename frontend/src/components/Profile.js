export default function Profile({ user, logout }) {
  return (
    <div className="card">
      <h3>👤 Profile</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
