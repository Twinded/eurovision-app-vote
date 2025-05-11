<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-900 to-purple-900 text-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center">
      <div class="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-lg font-medium">Chargement des pays...</p>
    </div>
    
    <!-- All Voted State -->
    <div v-else-if="allVoted" class="text-center bg-blue-800 bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-xl border-2 border-yellow-400 max-w-sm w-full transform transition-all duration-500 hover:scale-105">
      <div class="text-5xl mb-4">🎉</div>
      <h2 class="text-2xl font-bold mb-4 text-yellow-400 tracking-wide">Tous les votes sont soumis!</h2>
      <p class="mb-6 text-base text-blue-100">Merci pour ta participation à l'Eurovision 2024!</p>
      <button 
        @click="goToResults" 
        class="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 w-full"
      >
        <span>Voir les résultats</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- Voting Interface -->
    <div v-else class="flex flex-col items-center w-full max-w-md">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-4 text-center text-yellow-400 drop-shadow-lg">
        <span class="inline-block animate-pulse">🎵</span> 
        <span class="tracking-wide">Vote pour {{ currentCountry }}</span>
        <span class="inline-block animate-pulse">🎵</span>
      </h1>

      <!-- Country Flag -->
      <div class="mb-6 transform hover:scale-105 transition duration-300 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-400">
        <CountryFlag :countryCode="currentCountryCode" :countryName="currentCountry" class="w-32 h-auto" />
      </div>

      <!-- Vote Card -->
      <div class="w-full bg-blue-800 bg-opacity-80 backdrop-blur-md p-5 rounded-xl shadow-lg border-l-4 border-yellow-400 mb-6">
        <!-- Note Display -->
        <div class="flex justify-between items-center mb-4">
          <label class="text-yellow-400 text-base font-bold">Ta note :</label>
          <div class="bg-blue-700 px-3 py-1 rounded-full">
            <span class="text-2xl font-bold text-yellow-400">{{ note }}</span>
            <span class="text-blue-200">/12</span>
          </div>
        </div>
        
        <!-- Slider -->
        <input
          type="range"
          min="0"
          max="12"
          step="1"
          v-model="note"
          :disabled="dontCare"
          class="w-full h-3 bg-blue-600 rounded-full appearance-none cursor-pointer accent-yellow-400 mb-4"
        />
        
        <!-- Scale Indicators -->
        <div class="flex justify-between text-xs text-blue-200 mb-4 px-1">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>9</span>
          <span>12</span>
        </div>
        
        <!-- Don't Care Option -->
        <div class="flex items-center mb-4 bg-blue-700 bg-opacity-50 p-3 rounded-lg">
          <input type="checkbox" v-model="dontCare" id="dontCare" class="w-4 h-4 mr-2 accent-yellow-400" />
          <label for="dontCare" class="text-sm text-blue-100">Je préfère une note personnalisée</label>
        </div>

        <!-- Custom Note Input -->
        <div v-if="dontCare" class="mb-4 bg-blue-700 bg-opacity-70 p-3 rounded-lg border-l-2 border-yellow-400">
          <label class="block text-yellow-400 text-sm font-bold mb-2">Note personnalisée</label>
          <div class="flex items-center">
            <input 
              type="number" 
              v-model.number="customNote" 
              class="border-2 border-yellow-400 bg-blue-900 text-white p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center text-base" 
              placeholder="Ex: 50"
            />
            <div class="ml-2 text-xs text-blue-200">
              = <span class="text-yellow-400 font-bold">{{ normalizeNote(customNote || 0) }}</span>/12
            </div>
          </div>
        </div>
        
        <!-- Submit Button -->
        <button
          @click="submitVote"
          class="bg-yellow-400 text-blue-900 px-4 py-3 rounded-full font-bold hover:bg-yellow-300 transition transform hover:scale-105 w-full shadow-lg flex items-center justify-center space-x-2"
        >
          <span>Voter et continuer</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Real-time Votes Section -->
      <div class="w-full">
        <h2 class="text-xl font-bold mb-3 text-yellow-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Votes en direct
        </h2>
        
        <div class="space-y-2">
          <div 
            v-for="vote in currentVotes" 
            :key="vote.user" 
            class="flex items-center justify-between p-3 bg-blue-800 bg-opacity-70 backdrop-blur-sm rounded-lg border-l-3 border-blue-600 hover:border-yellow-400 transition transform hover:scale-102"
          >
            <div class="flex items-center space-x-2">
              <img 
                v-if="vote.avatar" 
                :src="vote.avatar" 
                alt="Avatar" 
                class="w-8 h-8 rounded-full object-cover border-2 border-yellow-400"
              />
              <div 
                v-else 
                class="w-8 h-8 rounded-full flex items-center justify-center text-blue-900 font-bold shadow-lg border-2 border-yellow-400" 
                :style="{ backgroundColor: vote.color || '#FCD34D' }"
              >
                {{ vote.user.charAt(0).toUpperCase() }}
              </div>
              <span class="font-semibold text-sm">{{ vote.user }}</span>
            </div>
            <div class="bg-blue-900 bg-opacity-50 px-2 py-1 rounded-full">
              <span class="text-base font-bold text-yellow-400">{{ vote.rawNote }}</span>
              <span class="text-xs text-blue-200">/12</span>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="currentVotes.length === 0" class="text-center p-4 bg-blue-800 bg-opacity-50 rounded-lg border border-blue-700">
            <p class="text-blue-200 text-sm">Aucun vote pour ce pays pour le moment</p>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <div class="mt-4 text-center">
          <p class="text-blue-200 mb-1 text-sm">
            Progression: {{ countries.length - remainingCountries.length }} / {{ countries.length }} pays
          </p>
          <div class="w-full bg-blue-800 rounded-full h-2">
            <div class="bg-yellow-400 h-2 rounded-full" :style="{width: `${(countries.length - remainingCountries.length) / countries.length * 100}%`}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from '@/firebase/config';
import { collection, addDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/store/user';
import CountryFlag from '@/components/CountryFlag.vue';
import { countries } from '@/data/countries';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(true);
const allVoted = ref(false);
const currentIndex = ref(0);
const note = ref(6);
const dontCare = ref(false);
const userVotes = ref([]);
const remainingCountries = ref([]);

const currentCountry = computed(() => {
  if (remainingCountries.value.length === 0) return '';
  return remainingCountries.value[currentIndex.value].name;
});

const currentCountryCode = computed(() => {
  if (remainingCountries.value.length === 0) return '';
  return remainingCountries.value[currentIndex.value].code;
});

const userStore = useUserStore();
const currentVotes = ref([]);

const customNote = ref(0);

onMounted(async () => {
  await loadUserVotes();
  findRemainingCountries();
  if (remainingCountries.value.length > 0) {
    watchCurrentVotes();
  }
  loading.value = false;
});

async function loadUserVotes() {
  const votesRef = collection(db, 'votes');
  const userVotesQuery = query(votesRef, where('user', '==', userStore.pseudo));
  const snapshot = await getDocs(userVotesQuery);
  userVotes.value = snapshot.docs.map(doc => doc.data());
}

function findRemainingCountries() {
  const votedCountries = userVotes.value.map(vote => vote.country);
  remainingCountries.value = countries.filter(country => !votedCountries.includes(country.name));
  
  if (remainingCountries.value.length === 0) {
    allVoted.value = true;
  }
}

function watchCurrentVotes() {
  if (remainingCountries.value.length === 0) return;
  
  const votesRef = collection(db, 'votes');
  const votesQuery = query(votesRef, where('country', '==', currentCountry.value));

  onSnapshot(votesQuery, (snapshot) => {
    currentVotes.value = snapshot.docs.map(doc => doc.data());
  });
}

function normalizeNote(value, min = 0, max = 100) {
  // Convertir la valeur personnalisée en 0 à 12
  const normalized = ((value - min) / (max - min)) * 12;
  return Math.min(12, Math.max(0, normalized.toFixed(1))); // Clamp entre 0 et 12
}

async function submitVote() {
  const finalNote = dontCare.value 
    ? normalizeNote(customNote.value || 0) 
    : note.value;

  await addDoc(collection(db, 'votes'), {
    user: userStore.pseudo,
    avatar: userStore.avatar,
    color: userStore.color,
    country: currentCountry.value,
    rawNote: finalNote,
    timestamp: new Date(),
  });

  // Mettre à jour les votes de l'utilisateur
  await loadUserVotes();
  findRemainingCountries();

  // Réinitialiser les valeurs
  note.value = 6;
  dontCare.value = false;
  customNote.value = 0;

  // Vérifier s'il reste des pays à voter
  if (remainingCountries.value.length === 0) {
    allVoted.value = true;
  } else {
    // Si l'index actuel est maintenant hors limites, le réinitialiser à 0
    if (currentIndex.value >= remainingCountries.value.length) {
      currentIndex.value = 0;
    }
    watchCurrentVotes();
  }
}

function goToResults() {
  router.push('/results');
}
</script>
