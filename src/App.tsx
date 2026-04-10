import { useState } from 'react'
import './index.css'
import Component from './Component'
import FloatingCat from './FloatingCat'
import RewardPage from './RewardPage'

function App() {
  const [page, setPage] = useState<'home' | 'reward'>('home')

  return (
    <>
      {page === 'home' ? (
        <>
          <Component />
          <FloatingCat onClick={() => setPage('reward')} />
        </>
      ) : (
        <RewardPage onBack={() => setPage('home')} />
      )}
    </>
  )
}

export default App
