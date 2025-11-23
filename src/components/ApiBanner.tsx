export default function ApiBanner() {
  const base = import.meta.env.VITE_API_BASE_URL ?? ''
  if (!base) return null
  return (
    <div style={{ background: '#f1f5f9', padding: 8, fontSize: 12, color: '#0f172a' }}>
      API base: <strong>{base}</strong>
    </div>
  )
}
