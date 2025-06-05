// importing CSS files
import './App.css'
import './styles/components.css'
import './styles/layout.css'

// importing components
import Start from './start/start'
import Config from './ui/config'
import LoadingScreen from './components/loadingScreen'

function App() {
  return (
    <div className='main-container'>
      <LoadingScreen />
      <Start />
      <Config />
    </div>
  )
}

export default App
