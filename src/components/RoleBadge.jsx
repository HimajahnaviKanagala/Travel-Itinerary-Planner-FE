export default function RoleBadge({ role }) {
  const styles = {
    ADMIN: "bg-red-50 text-red-600 border-red-200",
    TRAVEL_AGENT: "bg-purple-50 text-purple-600 border-purple-200",
    USER: "bg-surface-100 text-surface-500 border-surface-200",
  };
  const labels = {
    ADMIN: "👑 Admin",
    TRAVEL_AGENT: "🧭 Travel Agent",
    USER: "👤 User",
  };
  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium capitalize ${styles[role] || styles.USER}`}>
      {labels[role] || role}
    </span>
  );
}
