<template>
  <div class="pokemon-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
    <PokemonCard
      v-for="pokemon in pokemons"
      :key="pokemon.id"
      :pokemon="pokemon"
      @click="handleCardClick"
    />
  </div>
</template>

<script setup lang="ts">
import type { SimplifiedPokemon } from '~/types/pokemon'

interface Props {
  pokemons: SimplifiedPokemon[]
}

defineProps<Props>()
const emit = defineEmits<{
  pokemonClick: [id: number]
}>()

const handleCardClick = (id: number) => {
  emit('pokemonClick', id)
}
</script>

