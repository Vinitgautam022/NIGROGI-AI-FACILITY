import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing-shell">
      <div className="bg-orb orb-a" />
      <div className="bg-orb orb-b" />
      <section className="landing-grid">
        <article className="landing-copy">
          <p className="badge">NIGOGI Virtual Hospital</p>
          <h1>Modern AI Care Desk with Smart Intake and Doctor Matching</h1>
          <p>
            New rebuilt platform with account system, multilingual analysis, doctor directory,
            prescription-style export, and animated 3D-inspired interface.
          </p>
          <div className="cta-row">
            <Link href="/register" className="cta-primary">Create Account</Link>
            <Link href="/login" className="cta-secondary">Login</Link>
          </div>
          <div className="feature-row">
            <span>Multilingual intake</span>
            <span>Doctor availability match</span>
            <span>PDF prescription note</span>
          </div>
        </article>

        <article className="hero-visual card-3d">
          <img
            src="https://images.unsplash.com/photo-1631217b9201-d5ffd5d36d0f?auto=format&fit=crop&w=1200&q=80"
            alt="Modern healthcare dashboard"
          />
          <div className="visual-overlay">
            <h3>Realtime Triage Studio</h3>
            <p>Analyze symptoms, reports, and generate clinician-ready note in one workflow.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
