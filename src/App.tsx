import './index.css'
import FloatingCat from './FloatingCat'

function App() {
  return (
    <>
      <img
        src={`${import.meta.env.BASE_URL}design.png`}
        alt="하이"
        style={{ display: 'block', width: '100%', maxWidth: 375 }}
      />
      <FloatingCat />
    </>
  )
}

export default App
