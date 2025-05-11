<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-4 pb-20">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 pt-4">
        <h1 class="text-2xl font-bold tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
          CLASSEMENT DES JOUEURS
        </h1>
        <div class="flex justify-center space-x-2">
          <span class="inline-block animate-bounce delay-75">🎵</span>
          <span class="inline-block animate-bounce delay-150">🎤</span>
          <span class="inline-block animate-bounce delay-300">🎵</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="w-12 h-12 border-4 border-t-transparent border-pink-500 rounded-full animate-spin mb-4"></div>
        <p class="text-pink-300 text-sm">Chargement des joueurs...</p>
      </div>

      <!-- Players List -->
      <div v-else class="space-y-3">
        <!-- Top 3 Players -->
        <div v-for="(player, index) in sortedPlayers.slice(0, 3)" :key="player.user" 
          class="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-xl"
          :class="[
            index === 0 ? 'bg-gradient-to-r from-yellow-500/30 to-amber-600/30 border border-yellow-400/50' : 
            index === 1 ? 'bg-gradient-to-r from-gray-400/30 to-gray-500/30 border border-gray-400/50' : 
            'bg-gradient-to-r from-amber-700/30 to-amber-800/30 border border-amber-700/50'
          ]">
          <!-- Medal Indicator -->
          <div class="absolute top-0 right-0 w-16 h-16">
            <div class="absolute transform rotate-45 bg-gradient-to-r w-16 h-16 -top-8 -right-8"
              :class="[
                index === 0 ? 'from-yellow-400 to-amber-500' : 
                index === 1 ? 'from-gray-300 to-gray-400' : 
                'from-amber-700 to-amber-800'
              ]">
            </div>
            <div class="absolute top-1 right-1 text-xs font-bold text-indigo-900">
              {{ index === 0 ? '1er' : index === 1 ? '2e' : '3e' }}
            </div>
          </div>

          <div class="flex items-center p-4">
            <!-- Avatar -->
            <div class="relative mr-4">
              <div class="absolute -inset-1 rounded-full opacity-70 blur-sm"
                :class="[
                  index === 0 ? 'bg-yellow-400' : 
                  index === 1 ? 'bg-gray-300' : 
                  'bg-amber-700'
                ]">
              </div>
              <img
                v-if="player.avatar"
                :src="player.avatar"
                alt="Avatar"
                class="relative w-14 h-14 rounded-full object-cover border-2"
                :class="[
                  index === 0 ? 'border-yellow-400' : 
                  index === 1 ? 'border-gray-300' : 
                  'border-amber-700'
                ]"
              />
              <div 
                v-else 
                class="relative w-14 h-14 rounded-full flex items-center justify-center text-indigo-900 font-bold" 
                :style="{ backgroundColor: player.color || '#FCD34D' }"
              >
                {{ player.user.charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Player Info -->
            <div class="flex-1">
              <p class="font-semibold text-lg truncate">{{ player.user }}</p>
              <div class="flex items-baseline">
                <span class="text-2xl font-bold"
                  :class="[
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-300' : 
                    'text-amber-600'
                  ]">
                  {{ player.avgNote.toFixed(1) }}
                </span>
                <span class="text-xs text-gray-300 ml-1">/12</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Players -->
        <div class="mt-6 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-md">
          <div v-for="(player, index) in sortedPlayers.slice(3)" :key="player.user" 
            class="flex items-center p-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
            <!-- Rank -->
            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-800/50 text-white text-sm mr-3">
              {{ index + 4 }}
            </div>
            
            <!-- Avatar -->
            <img
              v-if="player.avatar"
              :src="player.avatar"
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover border border-indigo-400/30 mr-3"
            />
            <div 
              v-else 
              class="w-10 h-10 rounded-full flex items-center justify-center text-indigo-900 font-bold mr-3" 
              :style="{ backgroundColor: player.color || '#93C5FD' }"
            >
              {{ player.user.charAt(0).toUpperCase() }}
            </div>
            
            <!-- Player Info -->
            <div class="flex-1 truncate">
              <p class="font-medium truncate">{{ player.user }}</p>
            </div>
            
            <!-- Score -->
            <div class="flex items-baseline">
              <span class="text-lg font-bold"
                :class="[
                  player.avgNote >= 10 ? 'text-pink-400' : 
                  player.avgNote >= 8 ? 'text-blue-400' : 
                  player.avgNote >= 6 ? 'text-indigo-400' : 
                  'text-gray-400'
                ]">
                {{ player.avgNote.toFixed(1) }}
              </span>
              <span class="text-xs text-gray-400 ml-1">/12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db } from '@/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const loading = ref(true);
const votes = ref([]);

onMounted(() => {
  const votesRef = collection(db, 'votes');
  onSnapshot(votesRef, (snapshot) => {
    votes.value = snapshot.docs.map(doc => doc.data());
    loading.value = false;
  });
});

const sortedPlayers = computed(() => {
  const grouped = {};

  votes.value.forEach(vote => {
    if (!grouped[vote.user]) {
      grouped[vote.user] = { total: 0, count: 0, avatar: vote.avatar || '', color: vote.color || '' };
    }
    grouped[vote.user].total += Number(vote.rawNote);
    grouped[vote.user].count++;
  });

  return Object.entries(grouped).map(([user, data]) => ({
    user,
    avgNote: data.total / data.count,
    avatar: data.avatar || '',
    color: data.color
  })).sort((a, b) => b.avgNote - a.avgNote);
});
</script>
