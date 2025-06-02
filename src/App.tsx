import { useState } from 'react'
import { Game } from './components/Game'
import { Market } from './components/Market'
import './styles/global.css'
import './styles/game.css'
import './styles/market.css'

function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'market'>('game');

  return (
    <div className="App">
      <header style={{
        background: 'white',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--spacing-md) var(--spacing-lg)'
        }}>
          <h1 style={{ 
            margin: 0,
            fontSize: '24px',
            color: 'var(--primary-color)'
          }}>
            NFT 刮刮乐
          </h1>
          <nav style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button 
              className={`btn ${activeTab === 'game' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('game')}
            >
              抽奖
            </button>
            <button 
              className={`btn ${activeTab === 'market' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('market')}
            >
              市场
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {activeTab === 'game' ? <Game /> : <Market />}
      </main>

      <footer style={{
        background: 'white',
        padding: 'var(--spacing-lg)',
        marginTop: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <p>© 2025 YDY Game Studio. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
