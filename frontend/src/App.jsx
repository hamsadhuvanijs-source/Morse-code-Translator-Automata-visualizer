import { useState } from 'react'
import Header from './components/Header'
import MainApp from './components/MainApp'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <MainApp />
      </main>

      <Footer />
    </div>
  )
}

export default App
