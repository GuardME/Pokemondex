import { defineStore } from 'pinia'
import type { SimplifiedPokemon, DetailedPokemon } from '~/types/pokemon'

interface PokemonState {
  pokemons: SimplifiedPokemon[]
  currentPage: number
  itemsPerPage: number
  isLoading: boolean
  error: string | null
  selectedPokemon: DetailedPokemon | null
  isModalOpen: boolean
  isLoadingDetail: boolean
}

export const usePokemonStore = defineStore('pokemon', {
  state: (): PokemonState => ({
    pokemons: [],
    currentPage: 1,
    itemsPerPage: 10,
    isLoading: false,
    error: null,
    selectedPokemon: null,
    isModalOpen: false,
    isLoadingDetail: false,
  }),

  getters: {
    totalPages(): number {
      return Math.ceil(this.pokemons.length / this.itemsPerPage)
    },

    paginatedPokemons(): SimplifiedPokemon[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.pokemons.slice(start, end)
    },

    hasNextPage(): boolean {
      return this.currentPage < this.totalPages
    },

    hasPrevPage(): boolean {
      return this.currentPage > 1
    },
  },

  actions: {
    async loadPokemons() {
      if (this.pokemons.length > 0) return

      this.isLoading = true
      this.error = null

      try {
        const { fetchPokemonList } = usePokeApi()
        this.pokemons = await fetchPokemonList(151)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load pokemons'
        console.error('Error loading pokemons:', err)
      } finally {
        this.isLoading = false
      }
    },

    async loadPokemonDetail(id: number) {
      this.isLoadingDetail = true
      
      try {
        const { fetchDetailedPokemon } = usePokeApi()
        this.selectedPokemon = await fetchDetailedPokemon(id)
        this.isModalOpen = true
      } catch (err) {
        console.error('Error loading pokemon detail:', err)
      } finally {
        this.isLoadingDetail = false
      }
    },

    closeModal() {
      this.isModalOpen = false
      setTimeout(() => {
        this.selectedPokemon = null
      }, 300)
    },

    setPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    nextPage() {
      if (this.hasNextPage) {
        this.setPage(this.currentPage + 1)
      }
    },

    prevPage() {
      if (this.hasPrevPage) {
        this.setPage(this.currentPage - 1)
      }
    },
  },
})

