import { useEffect, useState } from 'react'



function TerminalCard() {
  const [visible, setVisible] = useState(0)


  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(prev => {
        if (prev >= 8) { clearInterval(timer); return prev }
        return prev + 1
      })
    }, 350)
    return () => clearInterval(timer)
  }, [])

  const lines = [
    { type: 'cmd', text: 'whoami' },
    { type: 'out', text: 'Flutter · Python · Django', color: '#34d399' },
    { type: 'out', text: 'Docker · Firebase · AWS', color: '#34d399' },
    { type: 'gap' },
    { type: 'cmd', text: 'ls projects/' },
    { type: 'out', text: 'hikers-afrique/', color: '#c4b5fd' },
    { type: 'out', text: 'reflections-app/', color: '#c4b5fd' },
    { type: 'out', text: 'task-manager/', color: '#c4b5fd' },
  ]

  return (
    <div style={{
      background: 'rgba(10,8,25,0.6)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      overflow: 'hidden',
      minWidth: '270px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      flexShrink: 0,
    }}>
      {/* Traffic light dots — purely decorative */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'rgba(226,223,245,0.3)' }}>
          paul@dev ~ bash
        </span>
      </div>

      {/* Terminal lines */}
      <div style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', fontSize: '11px', lineHeight: 2 }}>
        {lines.slice(0, visible).map((line, i) => {
          if (line.type === 'gap') return <div key={i} style={{ height: '6px' }} />
          if (line.type === 'cmd') return (
            <div key={i}>
              <span style={{ color: '#a78bfa' }}>paul<span style={{ color: '#34d399' }}>@portfolio</span> ~$</span>
              <span style={{ color: '#e2dff5', marginLeft: '6px' }}>{line.text}</span>
            </div>
          )
          return (
            <div key={i} style={{ paddingLeft: '14px', color: line.color }}>
              {line.text}
            </div>
          )
        })}

        {/* Blinking cursor always shows at the end */}
        <div>
          <span style={{ color: '#a78bfa' }}>paul<span style={{ color: '#34d399' }}>@portfolio</span> ~$</span>
          <span style={{
            display: 'inline-block', width: '7px', height: '13px',
            background: '#a78bfa', marginLeft: '6px', verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }} />
        </div>
      </div>

      {/* Cursor blink keyframe — injected inline */}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}

export default TerminalCard