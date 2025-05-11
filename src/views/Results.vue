<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
    <!-- Header -->
    <header class="pt-8 pb-4 px-4 text-center">
      <h1 class="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
        CLASSEMENT EUROVISION
      </h1>
      <div class="flex justify-center gap-2 mt-1">
        <span class="inline-block animate-bounce delay-75">🎵</span>
        <span class="inline-block animate-bounce delay-150">🎤</span>
        <span class="inline-block animate-bounce delay-300">🏆</span>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center p-6">
      <div class="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-lg text-pink-200 animate-pulse">Chargement des résultats...</p>
    </div>

    <!-- Results List -->
    <div v-else class="flex-1 px-4 pb-20 pt-2 overflow-y-auto">
      <div class="max-w-md mx-auto space-y-3">
        <!-- Top 3 Results -->
        <div v-for="(item, index) in sortedCountryResults.slice(0, 3)" :key="item.country" 
          class="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 active:scale-98"
          :class="[
            index === 0 ? 'bg-gradient-to-r from-yellow-500/80 to-amber-600/80 border-2 border-yellow-300' : 
            index === 1 ? 'bg-gradient-to-r from-gray-400/80 to-gray-500/80 border border-gray-300' : 
            'bg-gradient-to-r from-amber-700/80 to-amber-800/80 border border-amber-500'
          ]"
          @click="goToCountryDetail(item.country)">
          
          <div class="backdrop-blur-sm p-4 flex items-center">
            <!-- Rank Badge -->
            <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center font-bold rounded-full shadow-md"
              :class="[
                index === 0 ? 'bg-yellow-300 text-amber-900' : 
                index === 1 ? 'bg-gray-200 text-gray-800' : 
                'bg-amber-600 text-white'
              ]">
              {{ index + 1 }}
            </div>
            
            <!-- Country Info -->
            <div class="flex items-center ml-8 flex-1">
              <CountryFlag :countryCode="item.code" :countryName="item.country" class="w-14 h-auto rounded shadow-md" />
              <span class="ml-3 text-lg font-semibold">{{ item.country }}</span>
            </div>
            
            <!-- Score -->
            <div class="flex items-baseline">
              <span class="text-2xl font-bold" 
                :class="[
                  index === 0 ? 'text-white' : 
                  index === 1 ? 'text-white' : 
                  'text-white'
                ]">
                {{ item.avgNote.toFixed(1) }}
              </span>
              <span class="text-sm ml-1 opacity-80">/12</span>
            </div>
          </div>
        </div>

        <!-- Other Results -->
        <div v-for="(item, index) in sortedCountryResults.slice(3)" :key="item.country" 
          class="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-md transition-all duration-300 active:scale-98"
          @click="goToCountryDetail(item.country)">
          
          <div class="p-3 flex items-center">
            <!-- Rank -->
            <div class="w-8 h-8 flex items-center justify-center font-bold rounded-full bg-indigo-800/70 text-white text-sm">
              {{ index + 4 }}
            </div>
            
            <!-- Country Info -->
            <div class="flex items-center ml-3 flex-1">
              <CountryFlag :countryCode="item.code" :countryName="item.country" class="w-10 h-auto rounded" />
              <span class="ml-3 font-medium text-sm">{{ item.country }}</span>
            </div>
            
            <!-- Score -->
            <div class="flex items-baseline">
              <span class="text-lg font-bold" 
                :class="[
                  item.avgNote >= 10 ? 'text-yellow-300' : 
                  item.avgNote >= 8 ? 'text-green-300' : 
                  item.avgNote >= 6 ? 'text-blue-300' : 
                  'text-gray-400'
                ]">
                {{ item.avgNote.toFixed(1) }}
              </span>
              <span class="text-xs ml-1 opacity-70">/12</span>
            </div>
          </div>
        </div>
        
        <!-- Empty space at bottom for better scrolling -->
        <div class="h-4"></div>
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
