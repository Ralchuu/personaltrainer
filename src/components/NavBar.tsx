import './NavBar.css'

type Props = {
  onToggle?: () => void
}

export default function NavBar({ onToggle }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="menu-btn" aria-label="menu" onClick={onToggle}>☰</button>
        <div className="brand">PersonalTrainer</div>
      </div>
    </header>
  )
}
