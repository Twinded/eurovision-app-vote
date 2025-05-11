<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-900 text-white p-4 pb-20">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 pt-6">
        <h1 class="text-3xl font-bold tracking-wider mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
          CLASSEMENT DES JOUEURS
        </h1>
        <div class="flex justify-center space-x-3">
          <span class="inline-block animate-bounce delay-75 text-xl">🎵</span>
          <span class="inline-block animate-bounce delay-150 text-xl">🎤</span>
          <span class="inline-block animate-bounce delay-300 text-xl">🎵</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="w-14 h-14 border-4 border-t-transparent border-pink-500 rounded-full animate-spin mb-4"></div>
        <p class="text-pink-300 text-sm">Chargement des joueurs...</p>
      </div>

      <!-- Players List -->
      <div v-else class="space-y-4">
        <!-- Top 3 Players -->
        <div v-for="(player, index) in sortedPlayers.slice(0, 3)" :key="player.user" 
          class="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          :class="[
            index === 0 ? 'bg-gradient-to-r from-yellow-500/40 to-amber-600/40 border border-yellow-400/60' : 
            index === 1 ? 'bg-gradient-to-r from-gray-400/40 to-gray-500/40 border border-gray-400/60' : 
            'bg-gradient-to-r from-amber-700/40 to-amber-800/40 border border-amber-700/60'
          ]">
          <!-- Fun Title Indicator -->
          <div class="absolute top-0 right-0">
            <div 
              class="px-3 py-1 text-xs font-bold text-indigo-950 rounded-bl-lg shadow-md"
              :class="[
                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
                index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : 
                'bg-gradient-to-r from-amber-700 to-amber-800'
              ]"
            >
              {{ getFunTitle(index, player) }}
            </div>
          </div>

          <div class="flex items-center p-5">
            <!-- Avatar -->
            <div class="relative mr-5">
              <div class="absolute -inset-1.5 rounded-full opacity-75 blur-sm"
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
                class="relative w-16 h-16 rounded-full object-cover border-2"
                :class="[
                  index === 0 ? 'border-yellow-400' : 
                  index === 1 ? 'border-gray-300' : 
                  'border-amber-700'
                ]"
              />
              <div 
                v-else 
                class="relative w-16 h-16 rounded-full flex items-center justify-center text-indigo-950 font-bold text-xl" 
                :style="{ backgroundColor: player.color || '#FCD34D' }"
              >
                {{ player.user.charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Player Info -->
            <div class="flex-1">
              <p class="font-semibold text-lg truncate">{{ player.user }}</p>
              <div class="flex items-baseline mt-1">
                <span class="text-3xl font-bold"
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
        <div class="mt-8 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-md">
          <div v-for="(player, index) in sortedPlayers.slice(3)" :key="player.user" 
            class="flex items-center p-4 border-b border-white/10 last:border-b-0 hover:bg-white/10 transition-colors duration-200">
            <!-- Fun Title instead of Rank -->
            <div class="flex items-center justify-center mr-3">
              <span class="text-xs font-medium px-2.5 py-1.5 rounded-full bg-indigo-800/60 text-white whitespace-nowrap">
                {{ getFunTitle(index + 3, player) }}
              </span>
            </div>
            
            <!-- Avatar -->
            <img
              v-if="player.avatar"
              :src="player.avatar"
              alt="Avatar"
              class="w-12 h-12 rounded-full object-cover border border-indigo-400/40 mr-4"
            />
            <div 
              v-else 
              class="w-12 h-12 rounded-full flex items-center justify-center text-indigo-950 font-bold mr-4" 
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
              <span class="text-xl font-bold"
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
