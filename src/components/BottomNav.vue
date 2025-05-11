<template>
  <div>
    <!-- Mobile Navigation Bar -->
    <nav v-if="userStore.pseudo" class="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl shadow-2xl z-50 border-t border-purple-900/30">
      <div class="max-w-md mx-auto px-3 py-2">
        <div class="flex justify-around items-center">

          <!-- Home Button with Avatar -->
          <RouterLink to="/" class="flex flex-col items-center -mt-6 relative group">
            <div class="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-600 via-purple-700 to-purple-900 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
            <div class="w-14 h-14 rounded-full bg-black p-1 shadow-xl relative z-10">
              <div class="w-full h-full rounded-full overflow-hidden border border-purple-700/50">
                <div v-if="userStore.avatar" class="w-full h-full rounded-full overflow-hidden">
                  <img :src="userStore.avatar" alt="Avatar" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-full h-full rounded-full flex items-center justify-center text-white font-bold" :style="avatarStyle">
                  {{ userStore.pseudo.charAt(0).toUpperCase() || '?' }}
                </div>
              </div>
            </div>
            <span class="text-xs font-medium mt-1 text-pink-300 group-hover:text-pink-200 transition-colors">Accueil</span>
          </RouterLink>
          
          <!-- Vote Button -->
          <RouterLink to="/vote" class="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200" 
            :class="isActive('/vote') ? 'bg-gradient-to-br from-pink-600/30 via-purple-700/30 to-purple-900/30 text-pink-300 scale-110' : 'text-gray-400 hover:text-pink-200'">
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zm7-9v16a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zm7 4v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z"/>
              </svg>
              <span v-if="isActive('/vote')" class="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50"></span>
            </div>
            <span class="text-xs font-medium mt-1">Voter</span>
          </RouterLink>

          <!-- Players Button -->
          <RouterLink to="/players" class="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200" 
            :class="isActive('/players') ? 'bg-gradient-to-br from-pink-600/30 via-purple-700/30 to-purple-900/30 text-pink-300 scale-110' : 'text-gray-400 hover:text-pink-200'">
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span v-if="isActive('/players')" class="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50"></span>
            </div>
            <span class="text-xs font-medium mt-1">Joueurs</span>
          </RouterLink>

          <!-- Results Button -->
          <RouterLink to="/results" class="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200" 
            :class="isActive('/results') ? 'bg-gradient-to-br from-pink-600/30 via-purple-700/30 to-purple-900/30 text-pink-300 scale-110' : 'text-gray-400 hover:text-pink-200'">
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20v-6M6 20V10M18 20V4"/>
              </svg>
              <span v-if="isActive('/results')" class="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50"></span>
            </div>
            <span class="text-xs font-medium mt-1">Résultats</span>
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Spacer div to prevent content from being hidden behind the nav -->
    <div v-if="userStore.pseudo" class="h-19"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const route = useRoute();
const showModal = ref(false);

function isActive(path) {
  return route.path.startsWith(path);
}

const avatarStyle = computed(() => ({
  backgroundColor: userStore.color || '#EC4899',
}));
</script>
