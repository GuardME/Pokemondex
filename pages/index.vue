<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-40">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-center gap-4">
          <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Pokemon Pokedex</h1>
            <p class="text-sm text-gray-600">Explore the first 151 Pokemon from Kanto Region</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="pokemonStore.isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-20 w-20 border-b-4 border-primary mb-6"></div>
        <h2 class="text-2xl font-bold text-gray-700 mb-2">Loading Pokemons...</h2>
        <p class="text-gray-600">Please wait while we fetch all 151 Pokemon</p>
      </div>

      <!-- Error State -->
      <div v-else-if="pokemonStore.error" class="flex flex-col items-center justify-center py-20">
        <div class="text-red-500 mb-4">
          <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-700 mb-2">Oops! Something went wrong</h2>
        <p class="text-gray-600 mb-4">{{ pokemonStore.error }}</p>
        <button
          @click="pokemonStore.loadPokemons()"
          class="btn-primary"
        >
          Try Again
        </button>
      </div>

      <!-- Pokemon Grid -->
      <div v-else>
        <!-- Stats Bar -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600">Total Pokemon</p>
            <p class="text-2xl font-bold text-gray-800">{{ pokemonStore.pokemons.length }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Current Page</p>
            <p class="text-2xl font-bold text-primary">{{ pokemonStore.currentPage }} / {{ pokemonStore.totalPages }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Per Page</p>
            <p class="text-2xl font-bold text-gray-800">{{ pokemonStore.itemsPerPage }}</p>
          </div>
        </div>

        <!-- Grid -->
        <PokemonGrid
          :pokemons="pokemonStore.paginatedPokemons"
          @pokemon-click="handlePokemonClick"
        />

        <!-- Pagination -->
        <Pagination
          :current-page="pokemonStore.currentPage"
          :total-pages="pokemonStore.totalPages"
          :has-prev="pokemonStore.hasPrevPage"
          :has-next="pokemonStore.hasNextPage"
          @prev="pokemonStore.prevPage()"
          @next="pokemonStore.nextPage()"
          @page-change="pokemonStore.setPage"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="container mx-auto px-4 py-6 text-center">
        <p class="text-gray-600">
          Built with 
          <span class="text-primary font-semibold">Nuxt 3</span> 
          & 
          <span class="text-primary font-semibold">PokeAPI</span>
        </p>
        <p class="text-sm text-gray-500 mt-2">
          © 2024 ABCD Game Company - Pokemon Collaboration Project
        </p>
      </div>
    </footer>

    <!-- Modal -->
    <PokemonModal
      :is-open="pokemonStore.isModalOpen"
      :pokemon="pokemonStore.selectedPokemon"
      :is-loading="pokemonStore.isLoadingDetail"
      @close="pokemonStore.closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
const pokemonStore = usePokemonStore()

// Load pokemons on mount
onMounted(() => {
  pokemonStore.loadPokemons()
})

const handlePokemonClick = (id: number) => {
  pokemonStore.loadPokemonDetail(id)
}

// SEO
useHead({
  title: 'Pokemon Pokedex - Kanto Region (Gen 1)',
  meta: [
    { 
      name: 'description', 
      content: 'Explore all 151 Pokemon from the Kanto region. View detailed information including stats, abilities, and moves for each Pokemon.' 
    },
    {
      property: 'og:title',
      content: 'Pokemon Pokedex - First Generation'
    },
    {
      property: 'og:description',
      content: 'Complete Pokedex for the first 151 Pokemon'
    },
  ],
})
</script>

