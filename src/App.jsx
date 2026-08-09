import { useState } from 'react'
import {Layout} from './Component/Layout.jsx'
import { PortraitLanding } from './Component/PortraitLanding.jsx'
import './App.css'

function App() {
    const [hasEntered, setHasEntered] = useState(false)

    return (
        <>
            <PortraitLanding hasEntered={hasEntered} onEnter={() => setHasEntered(true)} />
            {hasEntered ? <Layout showAbout={false} /> : null}
        </>
    )
}
export default App
