<template>
  <div class="flex justify-center items-center gap-2 mt-8 flex-wrap">
    <!-- Previous Button -->
    <button
      @click="$emit('prev')"
      :disabled="!hasPrev"
      :class="[
        'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
        hasPrev
          ? 'bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]"
    >
      Prev
    </button>

    <!-- Page Numbers -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="$emit('pageChange', page)"
      :disabled="page === currentPage"
      :class="[
        'px-4 py-2 rounded-lg font-semibold transition-all duration-200 min-w-[44px]',
        page === currentPage
          ? 'bg-primary text-white cursor-not-allowed shadow-lg'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow-md'
      ]"
    >
      {{ page }}
    </button>

    <!-- Next Button -->
    <button
      @click="$emit('next')"
      :disabled="!hasNext"
      :class="[
        'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
        hasNext
          ? 'bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}

const props = defineProps<Props>()

defineEmits<{
  prev: []
  next: []
  pageChange: [page: number]
}>()

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage
  const maxButtons = 5 // Maximum page number buttons to show

  // For page 1 and 2, show pages starting from 1
  if (current <= 2) {
    for (let i = 1; i <= Math.min(maxButtons, total); i++) {
      pages.push(i)
    }
  }
  // For last 2 pages, show pages ending at total
  else if (current >= total - 1) {
    for (let i = Math.max(1, total - maxButtons + 1); i <= total; i++) {
      pages.push(i)
    }
  }
  // For middle pages, current page is in the center
  else {
    const start = current - 2
    const end = current + 2
    for (let i = start; i <= Math.min(end, total); i++) {
      pages.push(i)
    }
  }

  return pages
})
</script>

