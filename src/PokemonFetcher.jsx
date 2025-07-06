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
        const pokemonsDeTipo = dataTipo.pokemon.map(p => p.pokemon);

        const detalles = await Promise.all(
          pokemonsDeTipo.map(async (poke) => {
            const resp = await fetch(poke.url);
            if (!resp.ok) throw new Error('No se pudo cargar un pokémon');
            const data = await resp.json();
            return {
              id: data.id,
              nombre: data.name,
              imagen: data.sprites.front_default,
              tipos: data.types.map(t => t.type.name),
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

  return (
    <div className='pokemon-container'>
      <h2>Pokémon por tipo</h2>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="tipo">Elige un tipo:&nbsp;</label>
        <select
          id="tipo"
          value={tipoSeleccionado}
          onChange={e => setTipoSeleccionado(e.target.value)}
        >
          {TIPOS_POKEMON.map(tipo => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {cargando && <div>Cargando Pokémon...</div>}
      {error && <div className="pokemon-container error">Error: {error}</div>}
      {!cargando && !error && (
        <div className="pokemon-list">
          {pokemones.map(pokemon => (
            <div key={pokemon.id} className="pokemon-card">
              <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
              <img src={pokemon.imagen} alt={pokemon.nombre} />
              <p>
                Tipos: {pokemon.tipos.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonFetcher;