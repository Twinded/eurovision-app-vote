<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-600 via-purple-800 to-black text-white p-4 pb-20">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 pt-6">
        <h1 class="text-3xl font-bold tracking-wider mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
          CLASSEMENT DES JOUEURS
        </h1>
        <div class="flex justify-center space-x-3">
          <span class="inline-block animate-pulse delay-75 text-xl">🎵</span>
          <span class="inline-block animate-pulse delay-150 text-xl">🎤</span>
          <span class="inline-block animate-pulse delay-300 text-xl">🏆</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-pink-200 animate-pulse">Chargement des joueurs...</p>
      </div>

      <!-- Players List -->
      <div v-else class="space-y-6">
        <!-- Top 3 Players -->
        <div v-for="(player, index) in sortedPlayers.slice(0, 3)" :key="player.user" 
          class="relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
          :class="[
            index === 0 ? 'bg-gradient-to-r from-yellow-600/20 to-pink-700/20 border border-yellow-500/50' : 
            index === 1 ? 'bg-gradient-to-r from-gray-700/20 to-pink-800/20 border border-gray-400/50' : 
            'bg-gradient-to-r from-amber-800/20 to-pink-900/20 border border-amber-600/50'
          ]">
          
          <div class="p-5">
            <!-- Rank Badge -->
            <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center font-bold rounded-full shadow-lg"
              :class="[
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-pink-600 text-white' : 
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-pink-500 text-white' : 
                'bg-gradient-to-br from-amber-600 to-pink-700 text-white'
              ]">
              {{ index + 1 }}
            </div>
            
            <div class="flex items-center ml-10">
              <!-- Avatar with Glow -->
              <div class="relative group mr-4">
                <div class="absolute -inset-1 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-300"
                  :class="[
                    index === 0 ? 'bg-pink-500/50' : 
                    index === 1 ? 'bg-pink-400/50' : 
                    'bg-pink-700/50'
                  ]">
                </div>
                <img
                  v-if="player.avatar"
                  :src="player.avatar"
                  alt="Avatar"
                  class="relative w-16 h-16 rounded-full object-cover border-2 shadow-inner"
                  :class="[
                    index === 0 ? 'border-pink-400' : 
                    index === 1 ? 'border-pink-300' : 
                    'border-pink-500'
                  ]"
                />
                <div 
                  v-else 
                  class="relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner" 
                  :style="{ backgroundColor: player.color || '#DB2777' }"
                >
                  {{ player.user.charAt(0).toUpperCase() }}
                </div>
              </div>

              <!-- Player Info -->
              <div class="flex-1">
                <div class="flex items-center">
                  <p class="font-bold text-lg truncate">{{ player.user }}</p>
                  <div class="ml-2 px-2 py-0.5 text-xs rounded-full bg-pink-900/60 text-pink-200">
                    {{ getFunTitle(index, player) }}
                  </div>
                </div>
                <div class="flex items-baseline mt-2">
                  <span class="text-3xl font-bold"
                    :class="[
                      index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400' : 
                      index === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-pink-300' : 
                      'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-pink-500'
                    ]">
                    {{ player.avgNote.toFixed(1) }}
                  </span>
                  <span class="text-xs text-gray-300 ml-1">/12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Players -->
        <div class="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-pink-800/30">
          <div v-for="(player, index) in sortedPlayers.slice(3)" :key="player.user" 
            class="flex items-center p-4 border-b border-pink-900/30 last:border-b-0 hover:bg-pink-900/10 transition-colors duration-200">
            <!-- Rank -->
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-800 to-purple-900 flex items-center justify-center mr-3 text-sm font-medium text-pink-100 shadow-lg">
              {{ index + 4 }}
            </div>
            
            <!-- Avatar -->
            <div class="relative group mr-3">
              <img
                v-if="player.avatar"
                :src="player.avatar"
                alt="Avatar"
                class="w-12 h-12 rounded-full object-cover border border-pink-800/50 shadow-inner"
              />
              <div 
                v-else 
                class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-inner" 
                :style="{ backgroundColor: player.color || '#DB2777' }"
              >
                {{ player.user.charAt(0).toUpperCase() }}
              </div>
            </div>
            
            <!-- Player Info -->
            <div class="flex-1 truncate">
              <p class="font-medium truncate">{{ player.user }}</p>
              <div class="text-xs text-pink-300 mt-0.5">{{ getFunTitle(index + 3, player) }}</div>
            </div>
            
            <!-- Score -->
            <div class="flex items-baseline">
              <span class="text-xl font-bold"
                :class="[
                  player.avgNote >= 10 ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300' : 
                  player.avgNote >= 8 ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400' : 
                  player.avgNote >= 6 ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-500' : 
                  'text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-purple-600'
                ]">
                {{ player.avgNote.toFixed(1) }}
              </span>
              <span class="text-xs text-pink-300/70 ml-1">/12</span>
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

// Titres par catégorie de moyenne
const funTitlesByCategory = {
  // Très généreux (10-12)
  high: [
    "Le Plus Généreux", 
    "L'Enthousiaste", 
    "Le Passionné", 
    "Le Diplomate", 
    "L'Optimiste", 
    "Le Connaisseur"
  ],
  // Équilibré (8-9.9)
  medium: [
    "Le Perfectionniste", 
    "Le Critique Constructif", 
    "L'Équilibré", 
    "Le Réaliste", 
    "Le Méticuleux", 
    "Le Juge Impartial", 
    "Le Stratège"
  ],
  // Modéré (6-7.9)
  low: [
    "Le Modéré", 
    "L'Analyste", 
    "Le Pragmatique", 
    "Le Conservateur", 
    "Le Prudent", 
    "Le Sceptique"
  ],
  // Sévère (0-5.9)
  veryLow: [
    "Le Difficile à Convaincre", 
    "L'Exigeant", 
    "Le Pointilleux", 
    "Le Rigoureux", 
    "Le Dur à Cuire", 
    "L'Économe", 
    "Le Parcimonieux", 
    "L'Avare de Points", 
    "Le Radin", 
    "Le Plus Sévère"
  ]
};

const getFunTitle = (index, player) => {
  if (!player) return "Participant";
  
  let category;
  const avgNote = player.avgNote;
  
  if (avgNote >= 10) {
    category = 'high';
  } else if (avgNote >= 8) {
    category = 'medium';
  } else if (avgNote >= 6) {
    category = 'low';
  } else {
    category = 'veryLow';
  }
  
  // Trouver l'index relatif dans la catégorie
  const categoryPlayers = sortedPlayers.value.filter(p => {
    const note = p.avgNote;
    return (category === 'high' && note >= 10) ||
           (category === 'medium' && note >= 8 && note < 10) ||
           (category === 'low' && note >= 6 && note < 8) ||
           (category === 'veryLow' && note < 6);
  });
  
  const relativeIndex = categoryPlayers.findIndex(p => p.user === player.user);
  
  if (relativeIndex >= 0 && relativeIndex < funTitlesByCategory[category].length) {
    return funTitlesByCategory[category][relativeIndex];
  }
  
  return funTitlesByCategory[category][0] || "Participant";
};

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
