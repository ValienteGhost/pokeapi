import React from 'react';
import PokemonFetcher from './PokemonFetcher.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🔥 ¡Descubre el Mundo Pokémon! 🔥</h1>
        <p className="app-subtitle">
          Explora diferentes tipos de Pokémon y conoce sus características únicas
        </p>
      </header>
      
      <main className="app-main">
        <PokemonFetcher />
      </main>
      
      <footer className="app-footer">
        <p>Powered by <strong>PokéAPI</strong> 🚀</p>
      </footer>
    </div>
  );
}

export default App;
