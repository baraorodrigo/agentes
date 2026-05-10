// Mobile-app UI kit — screens.

const TabBar = ({ active = "home", onNav }) => (
  <nav className="tabbar">
    {[
      { id: "home", ic: "◐", l: "Hoje" },
      { id: "agenda", ic: "▤", l: "Agenda" },
      { id: "ticket", ic: "✦", l: "Ingresso" },
      { id: "menu", ic: "❍", l: "Cardápio" },
    ].map(t => (
      <a key={t.id} className={"item" + (active===t.id?" active":"")} onClick={() => onNav && onNav(t.id)}>
        <span className="ic">{t.ic}</span>{t.l}
      </a>
    ))}
  </nav>
);

const HomeMobile = ({ onNav }) => (
  <div className="scr">
    <header className="scr-head">
      <div className="b">El Coyote<small>imbituba · sc</small></div>
      <button className="icon-btn">☰</button>
    </header>
    <div className="home-hero" style={{ backgroundImage: "url(../../assets/photo-stage-band.jpg)" }}>
      <div className="body">
        <div>
          <span className="live">AO VIVO · SEX</span>
        </div>
        <div>
          <div className="when">21 NOV · 22h → 5h</div>
          <h2>Banda<br/>Coyote</h2>
          <div className="row">
            <div className="price">R$40<small>1º lote</small></div>
            <button className="buy" onClick={() => onNav && onNav("ticket")}>Comprar →</button>
          </div>
        </div>
      </div>
    </div>
    <div className="section-title"><span>Próximos</span><a>ver tudo</a></div>
    <div className="mini-list">
      <div className="mini-card"><div className="stamp"><div className="d">22</div><div className="m">NOV</div></div><div><div className="when">SÁB · 18h</div><div className="title">Sunset Deck</div></div><div className="price">R$30</div></div>
      <div className="mini-card"><div className="stamp"><div className="d">28</div><div className="m">NOV</div></div><div><div className="when">SEX · 22h</div><div className="title">Pagode na Vista</div></div><div className="price">R$45</div></div>
      <div className="mini-card"><div className="stamp"><div className="d">05</div><div className="m">DEZ</div></div><div><div className="when">SEX · 23h</div><div className="title">DJ Sunrise</div></div><div className="price">R$35</div></div>
    </div>
    <TabBar active="home" onNav={onNav} />
  </div>
);

const EventMobile = ({ onNav }) => (
  <div className="scr">
    <header className="scr-head">
      <button className="icon-btn">←</button>
      <div className="b" style={{ fontSize: 14 }}>Evento</div>
      <button className="icon-btn">♡</button>
    </header>
    <div className="ed-hero" style={{ backgroundImage: "url(../../assets/photo-stage-band.jpg)" }}>
      <div className="body">
        <div className="when">SEX · 21 NOV · 22h → 5h</div>
        <h1>Banda<br/>Coyote</h1>
      </div>
    </div>
    <div className="ed-body">
      <p className="lead">Pagode raiz que segue até o sol nascer no mar.</p>
      <div className="row"><span className="a">Abertura · DJ Lobo</span><span className="t">22h00</span></div>
      <div className="row"><span className="a">Banda Coyote</span><span className="t">23h00</span></div>
      <div className="row"><span className="a">Convidado surpresa</span><span className="t">01h30</span></div>
      <div className="row"><span className="a">After · DJ Sunrise</span><span className="t">03h00</span></div>
    </div>
    <div className="ed-foot">
      <div className="price">R$40<small>1º LOTE</small></div>
      <button onClick={() => onNav && onNav("ticket")}>Comprar agora →</button>
    </div>
  </div>
);

const TicketMobile = ({ onNav }) => (
  <div className="scr">
    <header className="scr-head">
      <button className="icon-btn">←</button>
      <div className="b" style={{ fontSize: 14 }}>Seu ingresso</div>
      <button className="icon-btn">⤴</button>
    </header>
    <div className="ticket-bg">
      <div>
        <div className="label">Apresente na entrada</div>
      </div>
      <div className="ticket-card">
        <div className="when">SEX · 21 NOV</div>
        <h3>Banda<br/>Coyote</h3>
        <div className="qr"></div>
        <div className="code">EC-21N-7B42</div>
        <div className="perforation"></div>
        <div className="foot">
          <div><small>Nome</small><div className="v">Maria S.</div></div>
          <div><small>Setor</small><div className="v">Pista</div></div>
          <div><small>Lote</small><div className="v">1º</div></div>
        </div>
      </div>
      <p className="passive-info">+18 anos · documento na entrada · porta abre 22h</p>
    </div>
    <TabBar active="ticket" onNav={onNav} />
  </div>
);

const MenuMobile = ({ onNav }) => {
  const [tab, setTab] = React.useState("bar");
  return (
    <div className="scr">
      <header className="scr-head">
        <div className="b">Cardápio<small>do bar à cozinha</small></div>
        <button className="icon-btn">⌕</button>
      </header>
      <div className="menu-tabs">
        <button className={"t" + (tab==="bar"?" active":"")} onClick={()=>setTab("bar")}>Bar</button>
        <button className={"t" + (tab==="kit"?" active":"")} onClick={()=>setTab("kit")}>Cozinha</button>
        <button className={"t" + (tab==="dr"?" active":"")} onClick={()=>setTab("dr")}>Sem álcool</button>
      </div>
      {tab === "bar" && (
        <div className="menu-list">
          <div className="grp">drinks da casa</div>
          <div className="item"><div><div className="n">Coyote</div><div className="d">cachaça envelhecida, mel, limão-galego, manjericão</div></div><div className="p">R$32</div></div>
          <div className="item"><div><div className="n">Beira-mar</div><div className="d">gin, tônica de capim-santo, sal de hibisco</div></div><div className="p">R$36</div></div>
          <div className="item"><div><div className="n">Pôr do sol</div><div className="d">mezcal, maracujá, pimenta-rosa</div></div><div className="p">R$38</div></div>
          <div className="grp">cervejas</div>
          <div className="item"><div><div className="n">Pilsen</div><div className="d">long neck 355ml</div></div><div className="p">R$14</div></div>
          <div className="item"><div><div className="n">IPA da casa</div><div className="d">chopp 400ml — citrus / cítrica</div></div><div className="p">R$22</div></div>
        </div>
      )}
      {tab === "kit" && (
        <div className="menu-list">
          <div className="grp">pra dividir</div>
          <div className="item"><div><div className="n">Bolinho de tainha</div><div className="d">8 unidades · molho de limão</div></div><div className="p">R$48</div></div>
          <div className="item"><div><div className="n">Pastéis de camarão</div><div className="d">6 unidades · pimenta de cheiro</div></div><div className="p">R$56</div></div>
          <div className="grp">pratos</div>
          <div className="item"><div><div className="n">Moqueca da casa</div><div className="d">tainha, dendê, leite de coco, arroz</div></div><div className="p">R$92</div></div>
        </div>
      )}
      {tab === "dr" && (
        <div className="menu-list">
          <div className="grp">sem álcool</div>
          <div className="item"><div><div className="n">Sunrise zero</div><div className="d">maracujá, hibisco, soda</div></div><div className="p">R$22</div></div>
          <div className="item"><div><div className="n">Beira-mar zero</div><div className="d">capim-santo, limão, tônica</div></div><div className="p">R$22</div></div>
        </div>
      )}
      <TabBar active="menu" onNav={onNav} />
    </div>
  );
};

Object.assign(window, { HomeMobile, EventMobile, TicketMobile, MenuMobile });
