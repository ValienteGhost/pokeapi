import { useState } from 'react';
import PokemonFetcher from './PokemonFetcher.jsx';
import React from 'react';

function App() {
 
  return (
    <>
      <h1>
        ¡Conoce a tus Pokemones!
      </h1>
        <PokemonFetcher />
    </>
  );
}

export default App
