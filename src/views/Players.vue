<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-600 via-purple-800 to-black text-white p-4 pb-20">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 pt-4">
        <h1 class="text-2xl font-bold tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
          CLASSEMENT DES JOUEURS
        </h1>
        <div class="flex justify-center space-x-3">
          <span class="inline-block animate-pulse delay-75">🎤</span>
          <span class="inline-block animate-pulse delay-150">🏆</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="w-12 h-12 border-3 border-pink-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-pink-200 animate-pulse">Chargement des joueurs...</p>
      </div>

      <!-- Players List -->
      <div v-else class="space-y-4">
        <!-- Podium Section -->
        <h2 class="text-lg font-medium text-pink-200 mb-2">Podium</h2>
        
        <!-- Top 3 Players -->
        <div v-for="(player, index) in podiumPlayers.slice(0, 3)" :key="player.user" 
          class="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-102 active:scale-98"
          :class="[
            index === 0 ? 'bg-gradient-to-r from-yellow-600/30 to-amber-700/30 border border-yellow-500/50' : 
            index === 1 ? 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-500/50' : 
            'bg-gradient-to-r from-amber-800/30 to-amber-900/30 border border-amber-600/50'
          ]">
          
          <div class="backdrop-blur-sm p-4 flex items-center">
            <!-- Rank Badge -->
            <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center font-bold rounded-full shadow-lg"
              :class="[
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black' : 
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : 
                'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
              ]">
              {{ index + 1 }}
            </div>
            
            <div class="flex items-center ml-8">
              <!-- Avatar -->
              <div class="relative mr-3">
                <img
                  v-if="player.avatar"
                  :src="player.avatar"
                  alt="Avatar"
                  class="w-12 h-12 rounded-full object-cover border-2 shadow-inner"
                  :class="[
                    index === 0 ? 'border-yellow-400' : 
                    index === 1 ? 'border-gray-300' : 
                    'border-amber-500'
                  ]"
                />
                <div 
                  v-else 
                  class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner" 
                  :style="{ backgroundColor: player.color || '#DB2777' }"
                >
                  {{ player.user.charAt(0).toUpperCase() }}
                </div>
              </div>

              <!-- Player Info -->
              <div class="flex-1">
                <p class="font-bold text-base truncate">{{ player.user }}</p>
                <div class="mt-1 px-2 py-0.5 text-xs rounded-full bg-pink-900/60 text-pink-200 inline-block">
                  {{ getFunTitle(index, player) }}
                </div>
                <div class="flex items-baseline mt-1">
                  <span class="text-2xl font-bold"
                    :class="[
                      index === 0 ? 'text-yellow-300' : 
                      index === 1 ? 'text-gray-300' : 
                      'text-amber-500'
                    ]">
                    {{ player.avgNote ? player.avgNote.toFixed(1) : '0.0' }}
                  </span>
                  <span class="text-xs text-gray-300 ml-1">/12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Players Section -->
        <div class="mt-6">
          <h2 class="text-lg font-medium text-pink-200 mb-2">Autres joueurs</h2>
          
          <div class="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-pink-800/30">
            <div v-for="(player, index) in otherPlayers" :key="player.user" 
              class="flex items-center p-3 border-b border-pink-900/30 last:border-b-0 hover:bg-pink-900/10 transition-colors duration-200">
              <!-- Rank -->
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-pink-800 to-purple-900 flex items-center justify-center mr-3 text-sm font-medium text-pink-100 shadow">
                {{ player.hasVoted ? podiumPlayers.length + index + 1 : '?' }}
              </div>
              
              <!-- Avatar -->
              <div class="mr-3">
                <img
                  v-if="player.avatar"
                  :src="player.avatar"
                  alt="Avatar"
                  class="w-10 h-10 rounded-full object-cover border border-pink-800/50"
                />
                <div 
                  v-else 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" 
                  :style="{ backgroundColor: player.color || '#DB2777' }"
                >
                  {{ player.user.charAt(0).toUpperCase() }}
                </div>
              </div>
              
              <!-- Player Info -->
              <div class="flex-1 truncate">
                <p class="font-medium truncate text-sm">{{ player.user }}</p>
                <div class="text-xs text-pink-300/80">{{ getFunTitle(index + podiumPlayers.length, player) }}</div>
              </div>
              
              <!-- Score -->
              <div class="flex items-baseline">
                <span class="text-lg font-bold"
                  :class="[
                    player.avgNote >= 10 ? 'text-pink-400' : 
                    player.avgNote >= 8 ? 'text-pink-500' : 
                    player.avgNote >= 6 ? 'text-pink-600' : 
                    'text-pink-700'
                  ]">
                  {{ player.avgNote ? player.avgNote.toFixed(1) : '0.0' }}
                </span>
                <span class="text-xs text-pink-300/70 ml-1">/12</span>
              </div>
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
import { collection, onSnapshot, getDocs } from 'firebase/firestore';

const loading = ref(true);
const votes = ref([]);
const allUsers = ref([]);

onMounted(async () => {
  // Récupérer tous les utilisateurs inscrits
  const usersRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersRef);
  allUsers.value = usersSnapshot.docs.map(doc => ({
    user: doc.data().pseudo,
    avatar: doc.data().avatar || '',
    color: doc.data().color || ''
  }));
  
  // Récupérer tous les votes
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
  ],
  // N'a pas encore voté
  noVotes: [
    "Le Spectateur", 
    "L'Observateur", 
    "L'Indécis", 
    "Le Mystérieux", 
    "Le Réservé", 
    "Le Contemplatif", 
    "L'Attentiste"
  ]
};

const getFunTitle = (index, player) => {
  if (!player) return "Participant";
  
  let category;
  const avgNote = player.avgNote || 0;
  
  if (!player.hasVoted) {
    category = 'noVotes';
  } else if (avgNote >= 10) {
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
    if (category === 'noVotes') return !p.hasVoted;
    
    const note = p.avgNote || 0;
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

  // Initialiser tous les utilisateurs inscrits
  allUsers.value.forEach(user => {
    grouped[user.user] = { 
      total: 0, 
      count: 0, 
      avatar: user.avatar || '', 
      color: user.color || '',
      hasVoted: false
    };
  });

  // Ajouter les votes
  votes.value.forEach(vote => {
    if (!grouped[vote.user]) {
      grouped[vote.user] = { 
        total: 0, 
        count: 0, 
        avatar: vote.avatar || '', 
        color: vote.color || '',
        hasVoted: true
      };
    } else {
      grouped[vote.user].hasVoted = true;
    }
    grouped[vote.user].total += Number(vote.rawNote);
    grouped[vote.user].count++;
  });

  return Object.entries(grouped).map(([user, data]) => ({
    user,
    avgNote: data.count > 0 ? data.total / data.count : 0,
    avatar: data.avatar || '',
    color: data.color,
    hasVoted: data.hasVoted
  })).sort((a, b) => {
    // Trier d'abord par ceux qui ont voté
    if (a.hasVoted && !b.hasVoted) return -1;
    if (!a.hasVoted && b.hasVoted) return 1;
    // Puis par moyenne
    return b.avgNote - a.avgNote;
  });
});

// Séparer les joueurs qui ont voté pour le podium et les autres joueurs
const podiumPlayers = computed(() => {
  return sortedPlayers.value.filter(player => player.hasVoted).slice(0, 3);
});

const otherPlayers = computed(() => {
  const votedPlayers = sortedPlayers.value.filter(player => player.hasVoted).slice(3);
  const nonVotedPlayers = sortedPlayers.value.filter(player => !player.hasVoted);
  return [...votedPlayers, ...nonVotedPlayers];
});
</script>
