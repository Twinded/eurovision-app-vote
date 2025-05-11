<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-pink-600 via-purple-800 to-black text-white">
    <!-- Header with back button -->
    <header class="sticky top-0 z-10 bg-black/60 backdrop-blur-md shadow-lg border-b border-pink-500/30">
      <div class="flex items-center justify-between max-w-md mx-auto p-4">
        <button 
          @click="$router.go(-1)" 
          class="p-2 rounded-full bg-pink-700/30 text-pink-300 hover:bg-pink-600/50 active:scale-95 transition-all duration-200"
          aria-label="Retour"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
          {{ countryName }}
        </h1>
        <div class="w-10"></div> <!-- Spacer for balance -->
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 px-4 py-6 overflow-y-auto">
      <div class="max-w-md mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <div class="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mb-4"></div>
          <p class="text-pink-300 text-sm animate-pulse">Chargement des votes...</p>
        </div>

        <!-- No votes state -->
        <div 
          v-else-if="countryVotes.length === 0" 
          class="bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-pink-800/30 text-center"
        >
          <div class="mb-6 text-pink-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-xl mb-3 font-medium text-gray-100">Aucun vote pour le moment</p>
          <p class="text-pink-300 text-sm">Soyez le premier à voter pour {{ countryName }} !</p>
        </div>

        <!-- Votes exist state -->
        <div v-else class="space-y-6">
          <!-- Average score card -->
          <div class="bg-black/50 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-pink-700/30 overflow-hidden relative">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
            
            <div class="flex justify-between items-center mb-4 relative z-10">
              <h2 class="text-lg font-medium text-pink-300">Note moyenne</h2>
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-white">{{ averageNote.toFixed(1) }}</span>
                <span class="text-sm text-pink-300 ml-1">/12</span>
              </div>
            </div>
            
            <!-- Progress bar -->
            <div class="h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner relative z-10">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-pink-600 to-purple-500" 
                :style="{ width: `${(averageNote / 12) * 100}%` }"
              ></div>
            </div>
            
            <!-- Vote count -->
            <div class="flex justify-between items-center mt-4 text-xs text-gray-400 relative z-10">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ countryVotes.length }} / {{ totalUsers }} vote{{ countryVotes.length > 1 ? 's' : '' }}
              </div>
              <div class="text-pink-400">Mis à jour en temps réel</div>
            </div>
          </div>

          <!-- Individual votes -->
          <h3 class="text-lg font-medium text-pink-300 px-1 mt-8 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Tous les votes
          </h3>
          
          <div class="space-y-3">
            <div 
              v-for="vote in countryVotes" 
              :key="vote.user" 
              class="flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm rounded-xl border-l-4 shadow-lg transition-all duration-200 active:scale-98 hover:bg-gray-900/40"
              :class="[
                vote.rawNote >= 10 ? 'border-pink-500' : 
                vote.rawNote >= 8 ? 'border-purple-500' : 
                vote.rawNote >= 6 ? 'border-pink-700' : 
                'border-purple-700'
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <div class="absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-50 blur-sm"></div>
                  <img 
                    v-if="vote.avatar" 
                    :src="vote.avatar" 
                    alt="Avatar" 
                    class="w-10 h-10 rounded-full object-cover border border-gray-800 relative z-10"
                  />
                  <div 
                    v-else 
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10" 
                    :style="{ backgroundColor: vote.color || '#EC4899' }"
                  >
                    {{ vote.user.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <span class="font-medium text-sm">{{ vote.user }}</span>
              </div>
              
              <div 
                class="flex items-center justify-center min-w-[3rem] h-10 rounded-full font-bold text-sm"
                :class="[
                  vote.rawNote >= 10 ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : 
                  vote.rawNote >= 8 ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' : 
                  vote.rawNote >= 6 ? 'bg-gradient-to-r from-pink-700 to-purple-700 text-white' : 
                  'bg-gradient-to-r from-purple-800 to-pink-900 text-white'
                ]"
              >
                {{ vote.rawNote }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase/config';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/store/user';

const route = useRoute();
const router = useRouter();
const countryName = route.params.country;
const loading = ref(true);
const countryVotes = ref([]);
const userStore = useUserStore();
const totalUsers = ref(0);

const averageNote = computed(() => {
  if (countryVotes.value.length === 0) return 0;
  return countryVotes.value.reduce((sum, vote) => sum + Number(vote.rawNote), 0) / countryVotes.value.length;
});

onMounted(async () => {
  // Get total number of users
  totalUsers.value = userStore.totalUsers;
  
  // If totalUsers is not available in the store, fetch it from Firestore
  if (!totalUsers.value) {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    totalUsers.value = usersSnapshot.size;
  }
  
  const votesRef = collection(db, 'votes');
  const votesQuery = query(votesRef, where('country', '==', countryName));

  onSnapshot(votesQuery, (snapshot) => {
    countryVotes.value = snapshot.docs.map(doc => doc.data());
    loading.value = false;
  });
});
</script>
