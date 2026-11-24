export function ProjectArt({ kind }: { kind: string }) {
  if (kind === "nedo-studio") return (
    <div className="art art-editor" aria-hidden="true">
      <div className="editor-window">
        <div className="window-bar"><span className="window-dots">● ● ●</span><span>nedo / workspace</span><span className="live-dot">● Live</span></div>
        <div className="editor-body">
          <div className="editor-sidebar"><span>COMPONENTS</span><i>↖ Select</i><i>□ Container</i><i>T Text</i><i>▧ Image</i><i>↗ Button</i><div className="sidebar-bottom">LAYERS<br /><br />▾ Page<br />　▾ Section<br />　　Heading<br />　　Content</div></div>
          <div className="editor-canvas"><div className="canvas-nav"><b>studio.</b><span>About　 Work　 Contact</span></div><div className="canvas-heading">Make room<br />for your next<br /><em>big idea.</em></div><div className="selection-box"><span>Build something together.</span><span className="cursor-label">↖ Collaborator</span></div><div className="canvas-button">Explore the possibilities ↗</div><div className="canvas-orb" /></div>
          <div className="editor-properties">DESIGN<br /><br /><span>Layout</span><hr />W　 Fill<br /><br />H　 Auto<br /><br /><span>Spacing</span><hr />24　　24<br /><br /><span>Appearance</span><hr />■ #F5F5F3</div>
        </div>
      </div>
    </div>
  );
  if (kind === "product-portal") return (
    <div className="art art-portal" aria-hidden="true"><div className="portal-window"><div className="portal-side"><b>db.</b><span>▦</span><span>□</span><span>↗</span><span>⚙</span></div><div className="portal-main"><div className="portal-top">Product overview <span>↗</span></div><div className="portal-label">YOUR WORKSPACE, CONNECTED</div><h3>A clearer view.<br />A better workflow.</h3><div className="portal-stats"><div><small>CHANNELS</small><b>Connected.</b></div><div><small>PRICING</small><b>In sync.</b></div></div><div className="portal-table"><div>PRODUCT <span>CHANNEL</span><span>STATUS</span></div>{["Product catalog", "Pricing workflow", "Margin simulation"].map((name) => <div key={name}>{name}<span>Multichannel</span><span className="status-pill">Active</span></div>)}</div></div></div></div>
  );
  return (
    <div className="art art-volcano" aria-hidden="true"><div className="map-contour contour-one" /><div className="map-contour contour-two" /><div className="map-contour contour-three" /><div className="map-coordinate">7°32′ S / 110°26′ E</div><div className="phone"><div className="phone-camera" /><div className="phone-top">09:41 <span>••• ▰</span></div><div className="phone-title">Stay informed.<br /><b>Stay prepared.</b></div><div className="phone-map"><div className="hazard-ring" /><div className="mountain">△</div><span>VOLCANO MAP</span></div><div className="phone-card"><small>VOLCANO INFORMATION</small><b>Know your surroundings ↗</b><p>Activity status, hazard zones<br />& preparedness guidance.</p></div><div className="phone-tabs">⌂　　　 ◉　　　 ☰</div></div></div>
  );
}
