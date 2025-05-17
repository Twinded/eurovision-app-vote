<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-pink-600 via-purple-800 to-black text-white">
    <!-- Header -->
    <header class="pt-6 pb-4 px-4 text-center">
      <h1 class="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
        CLASSEMENT EUROVISION
      </h1>
      <div class="flex justify-center gap-3 mt-1">
        <span class="inline-block animate-pulse delay-75">🎵</span>
        <span class="inline-block animate-pulse delay-150">🎤</span>
        <span class="inline-block animate-pulse delay-300">🏆</span>
      </div>
      
      <!-- View Toggle -->
      <div class="flex justify-center gap-2 mt-4">
        <button 
          @click="currentView = 'podium'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="currentView === 'podium' ? 'bg-pink-500 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'">
          Podium
        </button>
        <button 
          @click="currentView = 'order'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="currentView === 'order' ? 'bg-pink-500 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'">
          Ordre de passage
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center p-6">
      <div class="w-12 h-12 border-3 border-pink-400 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-sm text-pink-200 animate-pulse">Chargement des résultats...</p>
    </div>

    <!-- Results List -->
    <div v-else class="flex-1 px-3 pb-20 pt-2 overflow-y-auto">
      <div class="max-w-md mx-auto">
        <!-- Podium View -->
        <div v-if="currentView === 'podium'" class="mb-6">
          <div class="mb-6">
            <h2 class="text-sm uppercase tracking-wider text-pink-300 mb-3 font-semibold px-1">Podium</h2>
            
            <!-- Gold Medal (1st Place) -->
            <div v-if="sortedCountryResults.length > 0" 
              class="relative overflow-hidden rounded-xl shadow-xl transform transition-all duration-300 mb-4 bg-gradient-to-r from-yellow-600/30 to-amber-700/30 border border-yellow-500/50"
              @click="goToCountryDetail(sortedCountryResults[0].name)">
              <div class="absolute top-0 right-0 bg-yellow-500/80 text-black text-xs font-bold px-2 py-1 rounded-bl-md">1er</div>
              <div class="backdrop-blur-sm p-4">
                <div class="flex items-center mb-2">
                  <div class="w-14 h-10 flex items-center justify-center overflow-hidden">
                    <CountryFlag :countryCode="sortedCountryResults[0].code" :countryName="sortedCountryResults[0].title" class="w-full h-auto rounded shadow-md object-cover" />
                  </div>
                  <span class="ml-3 text-lg font-bold">{{ sortedCountryResults[0].title }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-baseline">
                      <span class="text-sm font-medium text-gray-300">Mon vote:</span>
                      <span class="text-base font-bold text-pink-400 ml-2">{{ getUserVote(sortedCountryResults[0].name) }}</span>
                      <span class="text-xs ml-1 opacity-70">/12</span>
                    </div>
                  </div>
                  <div class="flex items-baseline">
                    <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                      {{ getCountryAverage(sortedCountryResults[0].name) }}
                    </span>
                    <span class="text-xs ml-1 opacity-80">/12</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Silver & Bronze (2nd & 3rd Places) -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Silver Medal (2nd Place) -->
              <div v-if="sortedCountryResults.length > 1" 
                class="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-500/50"
                @click="goToCountryDetail(sortedCountryResults[1].name)">
                <div class="absolute top-0 right-0 bg-gray-400/80 text-black text-xs font-bold px-2 py-1 rounded-bl-md">2e</div>
                <div class="backdrop-blur-sm p-3">
                  <div class="flex justify-center mb-2 h-8">
                    <div class="w-12 h-8 flex items-center justify-center overflow-hidden">
                      <CountryFlag :countryCode="sortedCountryResults[1].code" :countryName="sortedCountryResults[1].title" class="w-full h-auto rounded shadow-md object-cover" />
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium truncate mb-2">{{ sortedCountryResults[1].title }}</div>
                    <div class="flex items-baseline justify-center space-x-3">
                      <div class="flex items-baseline">
                        <span class="text-sm font-bold text-pink-400">{{ getUserVote(sortedCountryResults[1].name) }}</span>
                        <span class="text-xs ml-1 opacity-70">/12</span>
                      </div>
                      <div class="flex items-baseline">
                        <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400">
                          {{ getCountryAverage(sortedCountryResults[1].name) }}
                        </span>
                        <span class="text-xs ml-1 opacity-80">/12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Bronze Medal (3rd Place) -->
              <div v-if="sortedCountryResults.length > 2" 
                class="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 bg-gradient-to-r from-amber-800/30 to-amber-900/30 border border-amber-600/50"
                @click="goToCountryDetail(sortedCountryResults[2].name)">
                <div class="absolute top-0 right-0 bg-amber-600/80 text-white text-xs font-bold px-2 py-1 rounded-bl-md">3e</div>
                <div class="backdrop-blur-sm p-3">
                  <div class="flex justify-center mb-2 h-8">
                    <div class="w-12 h-8 flex items-center justify-center overflow-hidden">
                      <CountryFlag :countryCode="sortedCountryResults[2].code" :countryName="sortedCountryResults[2].title" class="w-full h-auto rounded shadow-md object-cover" />
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium truncate mb-2">{{ sortedCountryResults[2].title }}</div>
                    <div class="flex items-baseline justify-center space-x-3">
                      <div class="flex items-baseline">
                        <span class="text-sm font-bold text-pink-400">{{ getUserVote(sortedCountryResults[2].name) }}</span>
                        <span class="text-xs ml-1 opacity-70">/12</span>
                      </div>
                      <div class="flex items-baseline">
                        <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                          {{ getCountryAverage(sortedCountryResults[2].name) }}
                        </span>
                        <span class="text-xs ml-1 opacity-80">/12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order View -->
        <div v-else class="space-y-2">
          <div v-for="(country, index) in countries" :key="country.name" 
            class="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden shadow-md border border-purple-900/30 transition-all duration-300 active:scale-98"
            :class="{'opacity-50': !hasUserVoted(country.name)}"
            @click="goToVoting(index)">
            
            <div class="p-3 flex items-center">
              <!-- Order Number -->
              <div class="w-7 h-7 flex items-center justify-center font-bold rounded-full bg-gradient-to-br from-purple-800 to-pink-900 text-white text-xs shadow-sm">
                {{ index + 1 }}
              </div>
              
              <!-- Country Info -->
              <div class="flex items-center ml-3 flex-1">
                <div class="w-8 h-6 flex items-center justify-center overflow-hidden">
                  <CountryFlag :countryCode="country.code" :countryName="country.title" class="w-full h-auto rounded shadow-sm object-cover" />
                </div>
                <span class="ml-2 font-medium text-sm">{{ country.title }}</span>
              </div>
              
              <!-- Scores -->
              <div class="flex items-center space-x-4">
                <!-- User's Vote -->
                <div class="flex items-baseline">
                  <span class="text-base font-bold text-pink-400">
                    {{ getUserVote(country.name) }}
                  </span>
                  <span class="text-xs ml-1 opacity-70">/12</span>
                </div>
                
                <!-- Average Vote -->
                <div class="flex items-baseline">
                  <span class="text-base font-bold text-gray-400">
                    {{ getCountryAverage(country.name) }}
                  </span>
                  <span class="text-xs ml-1 opacity-70">/12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state if no results -->
        <div v-if="sortedCountryResults.length === 0" class="flex flex-col items-center justify-center py-10">
          <div class="w-16 h-16 bg-pink-900/30 rounded-full flex items-center justify-center mb-3">
            <span class="text-2xl">🎭</span>
          </div>
          <p class="text-center text-gray-400">Aucun résultat disponible pour le moment</p>
        </div>
        
        <!-- Empty space at bottom for better scrolling with bottom nav -->
        <div class="h-8"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import CountryFlag from '@/components/CountryFlag.vue';
import { countries } from '@/data/countries';
import { useUserStore } from '@/store/user';

const loading = ref(true);
const votes = ref([]);
const router = useRouter();
const currentView = ref('podium');
const userStore = useUserStore();

onMounted(() => {
  const votesRef = collection(db, 'votes');
  onSnapshot(votesRef, (snapshot) => {
    votes.value = snapshot.docs.map(doc => doc.data());
    loading.value = false;
  });
});

// Get unique users count
const uniqueUsers = computed(() => {
  return new Set(votes.value.map(vote => vote.user)).size;
});

const countryResults = computed(() => {
  return countries.map(country => {
    const countryVotes = votes.value.filter(v => v.country === country.name);
    const average = countryVotes.length
      ? countryVotes.reduce((sum, v) => sum + Number(v.rawNote), 0) / countryVotes.length
      : 0;
    return { ...country, totalScore: average };
  });
});

const sortedCountryResults = computed(() => {
  return [...countryResults.value].sort((a, b) => b.totalScore - a.totalScore);
});

function goToCountryDetail(countryName) {
  router.push(`/results/${countryName}`);
}

function goToVoting(index) {
  router.push({ 
    path: '/vote',
    query: { country: index }
  });
}

function getUserVote(countryName) {
  const userVote = votes.value.find(v => v.country === countryName && v.user === userStore.pseudo);
  return userVote ? userVote.rawNote : '-';
}

function getCountryAverage(countryName) {
  const countryVotes = votes.value.filter(v => v.country === countryName);
  if (countryVotes.length === 0) return '-';
  const average = countryVotes.reduce((sum, v) => sum + Number(v.rawNote), 0) / countryVotes.length;
  return average.toFixed(1);
}

function hasUserVoted(countryName) {
  return votes.value.some(v => v.country === countryName && v.user === userStore.pseudo);
}

function getScoreColorClass(score) {
  if (score >= 10) return 'text-yellow-400';
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-blue-400';
  return 'text-gray-400';
}
</script>
