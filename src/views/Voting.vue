<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-900 to-purple-900 text-white overflow-y-auto">
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
      <!-- Current Country Title -->
      <h1 class="text-xl font-bold text-center text-yellow-400 drop-shadow-lg mb-6">
        <span class="inline-block animate-pulse">🎵</span> 
        <span class="tracking-wide">{{ currentCountry }}</span>
        <span class="inline-block animate-pulse">🎵</span>
        <span v-if="hasVotedForCurrentCountry" class="ml-2 inline-flex items-center justify-center bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Voté
        </span>
      </h1>

      <!-- Country Flag -->
      <div ref="flagContainer" class="mb-6 transform hover:scale-105 transition duration-300 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-400">
        <CountryFlag :countryCode="currentCountryCode" :countryName="currentCountry" class="w-40 h-auto" />
      </div>

      <!-- Vote Card - Show only if not voted or editing vote -->
      <div v-if="!hasVotedForCurrentCountry || editingVote" ref="voteCard" class="w-full bg-blue-800 bg-opacity-80 backdrop-blur-md p-5 rounded-xl shadow-lg border-l-4 border-yellow-400 mb-6">
        <!-- Note Display -->
        <div class="flex justify-between items-center mb-4">
          <label class="text-yellow-400 text-base font-bold">Ta note :</label>
          <div class="bg-blue-700 px-3 py-1 rounded-full">
            <span ref="noteDisplay" class="text-2xl font-bold text-yellow-400">{{ note }}</span>
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
          ref="submitButton"
          class="bg-yellow-400 text-blue-900 px-4 py-3 rounded-full font-bold hover:bg-yellow-300 transition transform hover:scale-105 w-full shadow-lg flex items-center justify-center space-x-2 mt-4"
        >
          <span>{{ hasVotedForCurrentCountry ? 'Mettre à jour mon vote' : 'Voter et continuer' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Already Voted Card - Show only if voted and not editing -->
      <div v-if="hasVotedForCurrentCountry && !editingVote" class="w-full bg-blue-800 bg-opacity-80 backdrop-blur-md p-5 rounded-xl shadow-lg border-l-4 border-green-500 mb-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-yellow-400 text-base font-bold">Ta note :</span>
          </div>
          <div class="bg-blue-700 px-3 py-1 rounded-full">
            <span class="text-2xl font-bold text-yellow-400">{{ existingVoteValue }}</span>
            <span class="text-blue-200">/12</span>
          </div>
        </div>
        
        <button
          @click="editingVote = true"
          class="bg-blue-600 text-white px-4 py-3 rounded-full font-bold hover:bg-blue-500 transition transform hover:scale-105 w-full shadow-lg flex items-center justify-center space-x-2 mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>Changer mon vote</span>
        </button>
      </div>

      <!-- Real-time Votes Section -->
      <div ref="votesSection" class="w-full">
        <h2 class="text-xl font-bold mb-3 text-yellow-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Votes en direct
        </h2>
        
        <div class="space-y-2">
          <div 
            v-for="(vote, index) in currentVotes" 
            :key="index" 
            :ref="el => { if (el) voteElements[index] = el }"
            class="flex items-center justify-between p-3 bg-blue-800 bg-opacity-70 backdrop-blur-sm rounded-lg border-l-3 border-blue-600 hover:border-yellow-400 transition transform hover:scale-102"
            :class="{'border-green-500 bg-blue-700': vote.user === userStore.pseudo}"
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
              <span v-if="vote.user === userStore.pseudo" class="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Toi</span>
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
            Progression: {{ votedCountriesCount }} / {{ countries.length }} pays
          </p>
          <div class="w-full bg-blue-800 rounded-full h-2">
            <div ref="progressBar" class="bg-yellow-400 h-2 rounded-full" :style="{width: `${votedCountriesCount / countries.length * 100}%`}"></div>
          </div>
        </div>
      </div>

      <!-- Navigation Controls -->
      <div class="w-full mt-6 flex justify-between items-center">
        <button 
          @click="goToPreviousCountry" 
          class="bg-blue-700 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition flex items-center space-x-1"
        >
          <div v-if="previousCountry" class="w-6 h-6 mr-1 overflow-hidden rounded-full border border-blue-400">
            <CountryFlag :countryCode="previousCountryCode" :countryName="previousCountry" class="w-full h-auto" />
          </div>
          <span class="text-sm ml-2">Précédent</span>
        </button>
        
        <div class="text-center text-sm text-blue-200">
          {{ currentIndex + 1 }} / {{ countries.length }}
        </div>
        
        <button 
          @click="goToNextCountry" 
          class="bg-blue-700 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition flex items-center space-x-1"
        >
          <span class="text-sm mr-2">Suivant</span>
          <div v-if="nextCountry" class="w-6 h-6 ml-1 overflow-hidden rounded-full border border-blue-400">
            <CountryFlag :countryCode="nextCountryCode" :countryName="nextCountry" class="w-full h-auto" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { db } from '@/firebase/config';
import { collection, addDoc, onSnapshot, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
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
const voteElements = ref([]);
const editingVote = ref(false);

// Refs for UI elements
const flagContainer = ref(null);
const voteCard = ref(null);
const submitButton = ref(null);
const votesSection = ref(null);
const noteDisplay = ref(null);
const progressBar = ref(null);

const currentCountry = computed(() => {
  if (countries.length === 0) return '';
  return countries[currentIndex.value].name;
});

const currentCountryCode = computed(() => {
  if (countries.length === 0) return '';
  return countries[currentIndex.value].code;
});

const nextCountry = computed(() => {
  if (countries.length === 0 || currentIndex.value >= countries.length - 1) return '';
  return countries[currentIndex.value + 1].name;
});

const nextCountryCode = computed(() => {
  if (countries.length === 0 || currentIndex.value >= countries.length - 1) return '';
  return countries[currentIndex.value + 1].code;
});

const previousCountry = computed(() => {
  if (countries.length === 0 || currentIndex.value <= 0) return '';
  return countries[currentIndex.value - 1].name;
});

const previousCountryCode = computed(() => {
  if (countries.length === 0 || currentIndex.value <= 0) return '';
  return countries[currentIndex.value - 1].code;
});

const hasVotedForCurrentCountry = computed(() => {
  return userVotes.value.some(vote => vote.country === currentCountry.value);
});

const existingVoteValue = computed(() => {
  const existingVote = userVotes.value.find(vote => vote.country === currentCountry.value);
  return existingVote ? existingVote.rawNote : 0;
});

const votedCountriesCount = computed(() => {
  return userVotes.value.length;
});

const userStore = useUserStore();
const currentVotes = ref([]);

const customNote = ref(0);

onMounted(async () => {
  try {
    console.log("Mounting component...");
    await loadUserVotes();
    console.log("User votes loaded:", userVotes.value);
    
    watchCurrentVotes();
    
    loading.value = false;
    
    // Vérifier si tous les pays ont été votés
    if (userVotes.value.length === countries.length) {
      allVoted.value = true;
    }
    
    // Pré-remplir avec le vote existant si disponible
    loadExistingVote();
  } catch (error) {
    console.error("Error during component mount:", error);
    loading.value = false;
  }
});

watch(currentIndex, () => {
  watchCurrentVotes();
  loadExistingVote();
  editingVote.value = false; // Reset editing mode when changing country
});

function loadExistingVote() {
  // Vérifier si l'utilisateur a déjà voté pour ce pays
  const existingVote = userVotes.value.find(vote => vote.country === currentCountry.value);
  
  if (existingVote) {
    // Pré-remplir avec la note existante
    const voteValue = parseFloat(existingVote.rawNote);
    note.value = voteValue;
    
    // Si c'est une note non standard, activer le mode personnalisé
    if (voteValue % 1 !== 0 || voteValue < 0 || voteValue > 12) {
      dontCare.value = true;
      customNote.value = voteValue * (100/12); // Convertir de 0-12 à 0-100
    } else {
      dontCare.value = false;
      customNote.value = 0;
    }
  } else {
    // Réinitialiser les valeurs pour un nouveau vote
    note.value = 6;
    dontCare.value = false;
    customNote.value = 0;
  }
}

async function loadUserVotes() {
  try {
    console.log("Loading user votes for:", userStore.pseudo);
    const votesRef = collection(db, 'votes');
    const userVotesQuery = query(votesRef, where('user', '==', userStore.pseudo));
    const snapshot = await getDocs(userVotesQuery);
    
    if (snapshot.empty) {
      console.log("No votes found for this user");
    } else {
      console.log(`Found ${snapshot.docs.length} votes`);
    }
    
    userVotes.value = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
    return userVotes.value;
  } catch (error) {
    console.error("Error loading user votes:", error);
    return [];
  }
}

function watchCurrentVotes() {
  try {
    console.log("Watching votes for country:", currentCountry.value);
    const votesRef = collection(db, 'votes');
    const votesQuery = query(votesRef, where('country', '==', currentCountry.value));

    const unsubscribe = onSnapshot(votesQuery, (snapshot) => {
      console.log(`Received ${snapshot.docs.length} votes for ${currentCountry.value}`);
      currentVotes.value = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
    }, (error) => {
      console.error("Error watching votes:", error);
    });
    
    // Return unsubscribe function (not used here but good practice)
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up vote watcher:", error);
  }
}

function normalizeNote(value, min = 0, max = 100) {
  // Convertir la valeur personnalisée en 0 à 12
  const normalized = ((value - min) / (max - min)) * 12;
  return Math.min(12, Math.max(0, normalized.toFixed(1))); // Clamp entre 0 et 12
}

async function submitVote() {
  try {
    const finalNote = dontCare.value 
      ? normalizeNote(customNote.value || 0) 
      : note.value;

    console.log("Submitting vote:", {
      user: userStore.pseudo,
      country: currentCountry.value,
      note: finalNote
    });

    // Vérifier si l'utilisateur a déjà voté pour ce pays
    const existingVote = userVotes.value.find(vote => vote.country === currentCountry.value);

    if (existingVote) {
      // Mettre à jour le vote existant
      console.log("Updating existing vote with ID:", existingVote.id);
      await updateDoc(doc(db, 'votes', existingVote.id), {
        rawNote: finalNote,
        timestamp: new Date(),
      });
      console.log("Vote updated successfully");
    } else {
      // Créer un nouveau vote
      await addDoc(collection(db, 'votes'), {
        user: userStore.pseudo,
        avatar: userStore.avatar,
        color: userStore.color,
        country: currentCountry.value,
        rawNote: finalNote,
        timestamp: new Date(),
      });
      console.log("New vote submitted successfully");
    }

    // Mettre à jour les votes de l'utilisateur
    await loadUserVotes();
    
    // Désactiver le mode d'édition
    editingVote.value = false;

    // Vérifier s'il reste des pays à voter
    if (userVotes.value.length === countries.length) {
      allVoted.value = true;
    } else {
      // Passer au pays suivant automatiquement si c'était un nouveau vote
      if (!existingVote) {
        goToNextCountry();
      }
    }
  } catch (error) {
    console.error("Error submitting vote:", error);
    alert("Erreur lors de la soumission du vote. Veuillez réessayer.");
  }
}

function goToNextCountry() {
  try {
    if (currentIndex.value < countries.length - 1) {
      currentIndex.value++;
    } else {
      currentIndex.value = 0; // Revenir au début si on est à la fin
    }
  } catch (error) {
    console.error("Error navigating to next country:", error);
  }
}

function goToPreviousCountry() {
  try {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    } else {
      currentIndex.value = countries.length - 1; // Aller à la fin si on est au début
    }
  } catch (error) {
    console.error("Error navigating to previous country:", error);
  }
}

function goToResults() {
  router.push('/results');
}
</script>
