<script setup lang="ts">
import { ref, onErrorCaptured, provide } from 'vue'

export interface WidgetErrorBoundaryProps {
  /** Widget name for error reporting */
  widgetName?: string
  /** Fallback content to show on error */
  fallback?: string
}

const props = withDefaults(defineProps<WidgetErrorBoundaryProps>(), {
  widgetName: 'Widget',
  fallback: 'An error occurred loading this widget',
})

const emit = defineEmits<{
  error: [error: Error]
}>()

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref<Error | null>(null)

/**
 * Capture errors from child components
 */
onErrorCaptured((error: Error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message
  errorDetails.value = error
  
  // Emit error event for parent handling
  emit('error', error)
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${props.widgetName}] Error:`, error)
    console.error('Error info:', info)
    console.error('Component instance:', instance)
  }
  
  // Prevent error from propagating
  return false
})

/**
 * Reset error state
 */
function resetError() {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = null
}

/**
 * Provide reset function to children
 */
provide('resetError', resetError)

defineExpose({
  resetError,
  hasError,
})
</script>

<template>
  <div class="widget-error-boundary">
    <!-- Error state -->
    <div
      v-if="hasError"
      class="error-container bg-red-50 border border-red-200 rounded-lg p-6"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-red-800">
            {{ widgetName }} Error
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ fallback }}</p>
            <p v-if="errorMessage" class="mt-1 font-mono text-xs">
              {{ errorMessage }}
            </p>
          </div>
          <div class="mt-4">
            <button
              type="button"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              @click="resetError"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Normal content -->
    <slot v-else />
  </div>
</template>

<style scoped>
.widget-error-boundary {
  width: 100%;
}

.error-container {
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
