<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-900 text-white">
    <!-- Header with back button -->
    <header class="sticky top-0 z-10 bg-indigo-950/80 backdrop-blur-md shadow-lg p-4">
      <div class="flex items-center justify-between max-w-md mx-auto">
        <button 
          @click="$router.go(-1)" 
          class="p-2 rounded-full bg-indigo-800/50 text-pink-300 hover:bg-indigo-700/70 active:scale-95 transition-all"
          aria-label="Retour"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
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
          <p class="text-pink-300">Chargement des votes...</p>
        </div>

        <!-- No votes state -->
        <div 
          v-else-if="countryVotes.length === 0" 
          class="bg-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-800/50 text-center"
        >
          <div class="mb-4 text-pink-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-xl mb-2 font-medium">Aucun vote pour le moment</p>
          <p class="text-pink-300 text-sm">Soyez le premier à voter pour {{ countryName }} !</p>
        </div>

        <!-- Votes exist state -->
        <div v-else class="space-y-5">
          <!-- Average score card -->
          <div class="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-indigo-700/50">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-lg font-medium text-pink-300">Note moyenne</h2>
              <div class="flex items-baseline">
                <span class="text-3xl font-bold text-white">{{ averageNote.toFixed(1) }}</span>
                <span class="text-sm text-pink-200 ml-1">/12</span>
              </div>
            </div>
            
            <!-- Progress bar -->
            <div class="h-3 bg-indigo-800/70 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-pink-500 to-yellow-400" 
                :style="{ width: `${(averageNote / 12) * 100}%` }"
              ></div>
            </div>
            
            <!-- Vote count -->
            <div class="flex justify-between items-center mt-3">
              <div class="flex items-center text-xs text-pink-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ countryVotes.length }} / {{ totalUsers }} vote{{ countryVotes.length > 1 ? 's' : '' }}
              </div>
              <div class="text-xs text-pink-200">Mis à jour en temps réel</div>
            </div>
          </div>

          <!-- Individual votes -->
          <h3 class="text-lg font-medium text-pink-300 px-1 mt-6 mb-3">Tous les votes</h3>
          
          <div class="space-y-3">
            <div 
              v-for="vote in countryVotes" 
              :key="vote.user" 
              class="flex items-center justify-between p-4 bg-indigo-900/40 backdrop-blur-sm rounded-xl border-l-4 shadow-md transition-all active:scale-98 hover:bg-indigo-800/40"
              :class="[
                vote.rawNote >= 10 ? 'border-yellow-400' : 
                vote.rawNote >= 8 ? 'border-green-400' : 
                vote.rawNote >= 6 ? 'border-blue-400' : 
                'border-pink-400'
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <img 
                    v-if="vote.avatar" 
                    :src="vote.avatar" 
                    alt="Avatar" 
                    class="w-10 h-10 rounded-full object-cover border border-indigo-600/50"
                  />
                  <div 
                    v-else 
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" 
                    :style="{ backgroundColor: vote.color || '#6366F1' }"
                  >
                    {{ vote.user.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <span class="font-medium text-sm">{{ vote.user }}</span>
              </div>
              
              <div 
                class="flex items-center justify-center min-w-[3rem] h-10 rounded-full font-bold"
                :class="[
                  vote.rawNote >= 10 ? 'bg-yellow-400 text-yellow-900' : 
                  vote.rawNote >= 8 ? 'bg-green-400 text-green-900' : 
                  vote.rawNote >= 6 ? 'bg-blue-400 text-blue-900' : 
                  'bg-pink-400 text-pink-900'
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
