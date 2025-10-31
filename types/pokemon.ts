export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonSprites {
  front_default: string
  other: {
    'official-artwork': {
      front_default: string
    }
    home: {
      front_default: string
    }
  }
}

export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokemonMove {
  move: {
    name: string
    url: string
  }
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  types: PokemonType[]
  sprites: PokemonSprites
  abilities: PokemonAbility[]
  moves: PokemonMove[]
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface SimplifiedPokemon {
  id: number
  name: string
  image: string
  types: string[]
  height: number
  weight: number
}

export interface DetailedPokemon extends SimplifiedPokemon {
  abilities: string[]
  moves: string[]
}

