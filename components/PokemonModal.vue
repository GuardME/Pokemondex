<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <div class="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Pokemon Details</h2>
            <button
              @click="$emit('close')"
              class="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="p-12 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-600">Loading pokemon details...</p>
          </div>

          <!-- Pokemon Content -->
          <div v-else-if="pokemon" class="p-6">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row gap-6 mb-6">
              <!-- Image Section -->
              <div class="md:w-1/3">
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 relative">
                  <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-bold text-gray-600">
                    {{ pokemonNumber }}
                  </div>
                  <img 
                    :src="pokemon.image" 
                    :alt="pokemon.name"
                    class="w-full h-64 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              <!-- Basic Info Section -->
              <div class="md:w-2/3 space-y-4">
                <h3 class="text-3xl font-bold text-gray-800 mb-4">
                  {{ pokemon.name }}
                </h3>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-600 mb-1">Weight</p>
                    <p class="text-2xl font-bold text-gray-800">{{ formattedWeight }} kg</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-600 mb-1">Height</p>
                    <p class="text-2xl font-bold text-gray-800">{{ formattedHeight }} m</p>
                  </div>
                </div>

                <div>
                  <p class="text-sm text-gray-600 mb-2 font-semibold">Types</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="type in pokemon.types"
                      :key="type"
                      :style="{ backgroundColor: getTypeColor(type) }"
                      class="px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md"
                    >
                      {{ type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Abilities Section -->
            <div class="mb-6">
              <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Abilities
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="ability in pokemon.abilities"
                  :key="ability"
                  class="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold border border-primary/20"
                >
                  {{ ability }}
                </span>
              </div>
            </div>

            <!-- Moves Section -->
            <div>
              <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Moves
                <span class="text-sm text-gray-500 font-normal">(showing {{ displayedMovesCount }} of {{ pokemon.moves.length }})</span>
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                <span
                  v-for="move in displayedMoves"
                  :key="move"
                  class="bg-white text-gray-700 px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                >
                  {{ move }}
                </span>
              </div>
              <button
                v-if="pokemon.moves.length > 20"
                @click="toggleShowAllMoves"
                class="mt-3 text-primary hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                {{ showAllMoves ? 'Show Less' : `Show All ${pokemon.moves.length} Moves` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { DetailedPokemon } from '~/types/pokemon'

interface Props {
  isOpen: boolean
  pokemon: DetailedPokemon | null
  isLoading: boolean
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

const { formatPokemonNumber, getPokemonTypeColor } = usePokeApi()

const showAllMoves = ref(false)

const pokemonNumber = computed(() => {
  return props.pokemon ? formatPokemonNumber(props.pokemon.id) : ''
})

const formattedWeight = computed(() => {
  return props.pokemon ? (props.pokemon.weight / 10).toFixed(1) : '0'
})

const formattedHeight = computed(() => {
  return props.pokemon ? (props.pokemon.height / 10).toFixed(1) : '0'
})

const displayedMoves = computed(() => {
  if (!props.pokemon) return []
  return showAllMoves.value ? props.pokemon.moves : props.pokemon.moves.slice(0, 20)
})

const displayedMovesCount = computed(() => {
  return displayedMoves.value.length
})

const getTypeColor = (type: string) => getPokemonTypeColor(type)

const toggleShowAllMoves = () => {
  showAllMoves.value = !showAllMoves.value
}

// Reset showAllMoves when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    showAllMoves.value = false
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>

