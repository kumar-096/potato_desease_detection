export default function LogoutButton() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <button
      onClick={logout}
      style={{
        background: "#d32f2f",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
