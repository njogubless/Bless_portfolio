function Background() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120,80,255,0.18) 0%, transparent 70%)',
        top: '-150px', left: '-100px',
      }} />
      <div style={{
        position: 'absolute', width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,220,180,0.12) 0%, transparent 70%)',
        top: '100px', right: '-80px',
      }} />
      <div style={{
        position: 'absolute', width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,100,180,0.09) 0%, transparent 70%)',
        bottom: '100px', left: '40%',
      }} />
    </div>
  )
}

export default Background