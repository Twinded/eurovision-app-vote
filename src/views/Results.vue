<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-pink-600 via-purple-800 to-black text-white">
    <!-- Header -->
    <header class="pt-10 pb-6 px-4 text-center">
      <h1 class="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
        CLASSEMENT EUROVISION
      </h1>
      <div class="flex justify-center gap-3 mt-2">
        <span class="inline-block animate-pulse delay-75 text-xl">🎵</span>
        <span class="inline-block animate-pulse delay-150 text-xl">🎤</span>
        <span class="inline-block animate-pulse delay-300 text-xl">🏆</span>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center p-6">
      <div class="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-lg text-pink-200 animate-pulse">Chargement des résultats...</p>
    </div>

    <!-- Results List -->
    <div v-else class="flex-1 px-4 pb-20 pt-4 overflow-y-auto">
      <div class="max-w-md mx-auto space-y-4">
        <!-- Top 3 Results -->
        <div v-for="(item, index) in sortedCountryResults.slice(0, 3)" :key="item.country" 
          class="relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-102 active:scale-98 cursor-pointer"
          :class="[
            index === 0 ? 'bg-gradient-to-r from-yellow-600/30 to-amber-700/30 border border-yellow-500/50' : 
            index === 1 ? 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-500/50' : 
            'bg-gradient-to-r from-amber-800/30 to-amber-900/30 border border-amber-600/50'
          ]"
          @click="goToCountryDetail(item.country)">
          
          <div class="backdrop-blur-sm p-5 flex items-center">
            <!-- Rank Badge -->
            <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center font-bold rounded-full shadow-lg"
              :class="[
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black' : 
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : 
                'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
              ]">
              {{ index + 1 }}
            </div>
            
            <!-- Country Info -->
            <div class="flex items-center ml-10 flex-1">
              <div class="relative group">
                <div class="absolute -inset-1 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-300"
                  :class="[
                    index === 0 ? 'bg-yellow-500/50' : 
                    index === 1 ? 'bg-gray-400/50' : 
                    'bg-amber-600/50'
                  ]">
                </div>
                <CountryFlag :countryCode="item.code" :countryName="item.country" class="w-16 h-auto rounded shadow-md relative z-10" />
              </div>
              <span class="ml-4 text-xl font-bold">{{ item.country }}</span>
            </div>
            
            <!-- Score -->
            <div class="flex items-baseline">
              <span class="text-3xl font-bold text-transparent bg-clip-text" 
                :class="[
                  index === 0 ? 'bg-gradient-to-r from-yellow-300 to-amber-400' : 
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : 
                  'bg-gradient-to-r from-amber-500 to-amber-600'
                ]">
                {{ item.avgNote.toFixed(1) }}
              </span>
              <span class="text-sm ml-1 opacity-80">/12</span>
            </div>
          </div>
        </div>

        <!-- Other Results -->
        <div v-for="(item, index) in sortedCountryResults.slice(3)" :key="item.country" 
          class="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-purple-900/30 transition-all duration-300 hover:bg-black/50 hover:border-purple-700/50 active:scale-98 cursor-pointer"
          @click="goToCountryDetail(item.country)">
          
          <div class="p-4 flex items-center">
            <!-- Rank -->
            <div class="w-9 h-9 flex items-center justify-center font-bold rounded-full bg-gradient-to-br from-purple-800 to-pink-900 text-white text-sm shadow-md">
              {{ index + 4 }}
            </div>
            
            <!-- Country Info -->
            <div class="flex items-center ml-3 flex-1">
              <CountryFlag :countryCode="item.code" :countryName="item.country" class="w-12 h-auto rounded shadow-md" />
              <span class="ml-3 font-medium">{{ item.country }}</span>
            </div>
            
            <!-- Score -->
            <div class="flex items-baseline">
              <span class="text-xl font-bold text-transparent bg-clip-text" 
                :class="[
                  item.avgNote >= 10 ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' : 
                  item.avgNote >= 8 ? 'bg-gradient-to-r from-green-300 to-green-500' : 
                  item.avgNote >= 6 ? 'bg-gradient-to-r from-blue-300 to-blue-500' : 
                  'bg-gradient-to-r from-gray-400 to-gray-500'
                ]">
                {{ item.avgNote.toFixed(1) }}
              </span>
              <span class="text-xs ml-1 opacity-70">/12</span>
            </div>
          </div>
        </div>
        
        <!-- Empty space at bottom for better scrolling -->
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

const loading = ref(true);
const votes = ref([]);
const router = useRouter();

onMounted(() => {
  const votesRef = collection(db, 'votes');
  onSnapshot(votesRef, (snapshot) => {
    votes.value = snapshot.docs.map(doc => doc.data());
    loading.value = false;
  });
});

const countryResults = computed(() => {
  return countries.map(country => {
    const countryVotes = votes.value.filter(v => v.country === country.name);
    const avgNote = countryVotes.length
      ? countryVotes.reduce((sum, v) => sum + Number(v.rawNote), 0) / countryVotes.length
      : 0;
    return { country: country.name, code: country.code, avgNote };
  });
});

const sortedCountryResults = computed(() => {
  return [...countryResults.value].sort((a, b) => b.avgNote - a.avgNote);
});

function goToCountryDetail(countryName) {
  router.push(`/results/${countryName}`);
}
</script>
