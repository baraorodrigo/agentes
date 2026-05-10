// Marketing site UI kit — small reusable React components.
// Loaded as Babel JSX. Components are exported to window for cross-script use.

const TopNav = ({ active = "home", onNav }) => (
  <header className="topnav">
    <div className="lockup">
      <span className="live-dot"></span>
      <img src="../../assets/logo-black.png" alt="ELCOYOTE" />
    </div>
    <nav className="nav">
      <a className={active==="home"?"active":""} onClick={() => onNav("home")}>Início</a>
      <a className={active==="agenda"?"active":""} onClick={() => onNav("agenda")}>Agenda</a>
      <a className={active==="private"?"active":""} onClick={() => onNav("private")}>Eventos privados</a>
      <a className={active==="contact"?"active":""} onClick={() => onNav("contact")}>Contato</a>
    </nav>
    <div className="right">
      <span className="lang">PT · EN</span>
      <button className="cta" onClick={() => onNav("event")}>Comprar</button>
    </div>
  </header>
);

const EventCard = ({ img, day, mo, when, title, price, status, onClick }) => (
  <article className="event-card" onClick={onClick}>
    <div className="img" style={{ backgroundImage: `url(${img})` }}>
      <div className="stamp"><div className="day">{day}</div><div className="mo">{mo}</div></div>
      {status && <span className="chip">{status}</span>}
      <div className="cap">
        <div className="when">{when}</div>
        <div className="title" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
    </div>
    <div className="body">
      <span className="meta">22h → 5h · Imbituba</span>
      <span className="price">{price}</span>
    </div>
  </article>
);

const Footer = () => (
  <footer className="footer">
    <div className="col lockup">
      <img src="../../assets/logo-white.png" alt="" />
      <blockquote>onde a noite vira história.</blockquote>
    </div>
    <div className="col">
      <h4>Onde</h4>
      <p>Av. Beira-Mar, 1.420<br/>Imbituba · SC<br/>Brasil</p>
    </div>
    <div className="col">
      <h4>Quando</h4>
      <p>Sex & Sáb · 22h → 5h<br/>Eventos: sob agenda</p>
    </div>
    <div className="col">
      <h4>Fala com a gente</h4>
      <a>@elcoyote.pub</a>
      <a>contato@elcoyote.com.br</a>
      <a>+55 48 9 9100-0000</a>
    </div>
  </footer>
);

Object.assign(window, { TopNav, EventCard, Footer });
