import type { PokemonDetail, SimplifiedPokemon, DetailedPokemon } from '~/types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

export const usePokeApi = () => {
  const formatPokemonNumber = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`
  }

  const formatPokemonName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getPokemonTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    }
    return typeColors[type.toLowerCase()] || '#A8A878'
  }

  const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
    try {
      const response = await $fetch<PokemonDetail>(`${BASE_URL}/pokemon/${id}`)
      return response
    } catch (error) {
      console.error(`Failed to fetch pokemon ${id}:`, error)
      throw error
    }
  }

  const fetchPokemonList = async (limit: number = 151, offset: number = 0): Promise<SimplifiedPokemon[]> => {
    try {
      const pokemons: SimplifiedPokemon[] = []
      
      // Fetch all pokemon in parallel
      const promises = []
      for (let i = 1; i <= limit; i++) {
        promises.push(fetchPokemonDetail(i))
      }

      const results = await Promise.all(promises)

      for (const pokemon of results) {
        pokemons.push({
          id: pokemon.id,
          name: formatPokemonName(pokemon.name),
          image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
          types: pokemon.types.map(t => formatPokemonName(t.type.name)),
          height: pokemon.height,
          weight: pokemon.weight,
        })
      }

      return pokemons
    } catch (error) {
      console.error('Failed to fetch pokemon list:', error)
      throw error
    }
  }

  const fetchDetailedPokemon = async (id: number): Promise<DetailedPokemon> => {
    try {
      const pokemon = await fetchPokemonDetail(id)
      
      return {
        id: pokemon.id,
        name: formatPokemonName(pokemon.name),
        image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        types: pokemon.types.map(t => formatPokemonName(t.type.name)),
        height: pokemon.height,
        weight: pokemon.weight,
        abilities: pokemon.abilities.map(a => formatPokemonName(a.ability.name.replace('-', ' '))),
        moves: pokemon.moves.map(m => formatPokemonName(m.move.name.replace('-', ' '))),
      }
    } catch (error) {
      console.error(`Failed to fetch detailed pokemon ${id}:`, error)
      throw error
    }
  }

  return {
    formatPokemonNumber,
    formatPokemonName,
    getPokemonTypeColor,
    fetchPokemonList,
    fetchDetailedPokemon,
  }
}

