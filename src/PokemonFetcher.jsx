import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css'; 

const TIPOS_POKEMON = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug',
  'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic',
  'ice', 'dragon', 'dark', 'fairy'
];

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('fire');

  useEffect(() => {
    const fetchPokemonesPorTipo = async () => {
      try {
        setCargando(true);
        setError(null);
        setPokemones([]);
        
        const respTipo = await fetch(`https://pokeapi.co/api/v2/type/${tipoSeleccionado}`);
        if (!respTipo.ok) throw new Error('No se pudo cargar el tipo');
        
        const dataTipo = await respTipo.json();
        const pokemonsDeTipo = dataTipo.pokemon.slice(0, 12).map(p => p.pokemon);

        const detalles = await Promise.all(
          pokemonsDeTipo.map(async (poke) => {
            const resp = await fetch(poke.url);
            if (!resp.ok) throw new Error('No se pudo cargar un pokémon');
            
            const data = await resp.json();
            return {
              id: data.id,
              nombre: data.name,
              imagen: data.sprites.other?.['official-artwork']?.front_default || 
                     data.sprites.other?.dream_world?.front_default || 
                     data.sprites.front_default,
              tipos: data.types.map(t => t.type.name),
              peso: data.weight,
              altura: data.height,
              estadisticas: data.stats.map(stat => ({
                nombre: stat.stat.name,
                valor: stat.base_stat
              }))
            };
          })
        );
        
        setPokemones(detalles);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPokemonesPorTipo();
  }, [tipoSeleccionado]);

  const formatearNombre = (nombre) => {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  };

  const formatearPeso = (peso) => {
    return (peso / 10).toFixed(1);
  };

  const formatearAltura = (altura) => {
    return (altura / 10).toFixed(1);
  };

  if (cargando) {
    return (
      <div className='pokemon-container'>
        <h2>Pokémon por tipo</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando Pokémon increíbles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='pokemon-container'>
        <h2>Pokémon por tipo</h2>
        <div className="error-container">
          <h3>¡Oops! Algo salió mal</h3>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='pokemon-container'>
      <h2>Pokémon por tipo</h2>
      
      <div className="pokemon-controls">
        <label htmlFor="tipo">Elige un tipo:</label>
        <select
          id="tipo"
          value={tipoSeleccionado}
          onChange={e => setTipoSeleccionado(e.target.value)}
        >
          {TIPOS_POKEMON.map(tipo => (
            <option key={tipo} value={tipo}>
              {formatearNombre(tipo)}
            </option>
          ))}
        </select>
      </div>

      <div className="pokemon-list">
        {pokemones.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <h3>{formatearNombre(pokemon.nombre)}</h3>
            <img src={pokemon.imagen} alt={pokemon.nombre} />
            <p><strong>Peso:</strong> {formatearPeso(pokemon.peso)} kg</p>
            <p><strong>Altura:</strong> {formatearAltura(pokemon.altura)} m</p>
            <div className="pokemon-types">
              {pokemon.tipos.map(tipo => (
                <span 
                  key={tipo} 
                  className={`pokemon-type ${tipo}`}
                  title={`Tipo ${formatearNombre(tipo)}`}
                >
                  {tipo}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFetcher;