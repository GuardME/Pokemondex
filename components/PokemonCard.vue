<template>
  <div 
    class="pokemon-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
    @click="handleClick"
  >
    <div class="pokemon-card-image bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
      <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-gray-600">
        {{ pokemonNumber }}
      </div>
      <img 
        :src="pokemon.image" 
        :alt="pokemon.name"
        class="w-full h-40 object-contain drop-shadow-lg"
        loading="lazy"
      />
    </div>
    
    <div class="p-4">
      <h3 class="text-xl font-bold text-gray-800 mb-3 text-center">
        {{ pokemon.name }}
      </h3>
      
      <div class="space-y-2 mb-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 font-medium">Weight:</span>
          <span class="text-gray-800 font-semibold">{{ formattedWeight }} kg</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 font-medium">Height:</span>
          <span class="text-gray-800 font-semibold">{{ formattedHeight }} m</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 justify-center">
        <span
          v-for="type in pokemon.types"
          :key="type"
          :style="{ backgroundColor: getTypeColor(type) }"
          class="px-3 py-1 rounded-full text-white text-xs font-semibold shadow-sm"
        >
          {{ type }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SimplifiedPokemon } from '~/types/pokemon'

interface Props {
  pokemon: SimplifiedPokemon
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [id: number]
}>()

const { formatPokemonNumber, getPokemonTypeColor } = usePokeApi()

const pokemonNumber = computed(() => formatPokemonNumber(props.pokemon.id))
const formattedWeight = computed(() => (props.pokemon.weight / 10).toFixed(1))
const formattedHeight = computed(() => (props.pokemon.height / 10).toFixed(1))

const getTypeColor = (type: string) => getPokemonTypeColor(type)

const handleClick = () => {
  emit('click', props.pokemon.id)
}
</script>

<style scoped>
.pokemon-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pokemon-card:hover {
  transform: translateY(-8px);
}
</style>

