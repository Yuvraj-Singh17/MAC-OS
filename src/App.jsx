import { useState } from 'react'
import './app.scss'
import Dock from './components/dock'
import Nav from './components/Nav'
import Github from './components/windows/Github'
import Note from './components/windows/Note'
import Resume from './components/windows/Resume'
import Spotify from './components/windows/Spotify'

function App() {

  return (
    <main>
      <Dock />
      <Nav />

      <Github />
      <Note />
      <Resume />
      <Spotify />
    </main>
  )
}

export default App
