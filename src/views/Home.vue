<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-600 via-purple-800 to-black text-white overflow-y-auto">
    <!-- Logo and Header -->
    <div class="w-full max-w-md">
      <div class="text-center mb-6">
        <img src="@/assets/logo.svg" alt="Eurovision Vote Logo" class="h-24 mx-auto filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
      </div>
      
      <!-- Main Card -->
      <div class="bg-black/40 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-purple-500/30 mb-6 relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
        
        <h2 class="text-xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
          Ton Profil Eurovision
        </h2>
        
        <!-- Avatar Preview with Upload Functionality -->
        <div class="flex justify-center mb-6">
          <div class="relative group cursor-pointer">
            <div class="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 blur group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <div v-if="avatar" class="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-lg">
              <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div 
              v-else 
              class="relative w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-purple-500/50 shadow-lg"
              :style="{ backgroundColor: color }"
            >
              <span>{{ pseudo.charAt(0).toUpperCase() || '?' }}</span>
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <input 
              type="file" 
              @change="handleAvatar" 
              accept="image/*" 
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        <!-- Error message -->
        <div v-if="errorMessage" class="bg-red-900/60 text-white p-3 rounded-xl text-center text-sm mb-4 border-l-4 border-pink-500 animate-pulse">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-pink-300" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errorMessage }}
          </div>
        </div>
        
        <!-- Form -->
        <div class="space-y-4 relative z-10">
          <!-- Pseudo Input -->
          <div class="relative">
            <label for="pseudo" class="text-sm text-purple-300 mb-1 block font-medium">Ton prénom</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                id="pseudo"
                v-model="pseudo" 
                type="text" 
                placeholder="Ton prénom" 
                class="w-full bg-black/30 border border-purple-500/30 pl-10 pr-3 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-300"
              />
            </div>
          </div>
          
          <!-- Color Picker -->
          <div class="bg-black/30 rounded-xl p-4 border border-purple-500/30">
            <p class="text-sm text-purple-300 mb-2 font-medium">Choisis ta couleur:</p>
            <div class="flex flex-wrap justify-between gap-2">
              <div 
                v-for="colorOption in ['#FF1958', '#00C7FF', '#FFD700', '#9B59B6', '#3498DB', '#E74C3C']" 
                :key="colorOption"
                @click="color = colorOption"
                class="w-10 h-10 rounded-full cursor-pointer transform hover:scale-110 transition-all duration-300 border-2 shadow-lg"
                :class="{ 'border-white ring-2 ring-pink-500 scale-110': color === colorOption, 'border-transparent': color !== colorOption }"
                :style="{ backgroundColor: colorOption }"
              ></div>
            </div>
          </div>
          
          <!-- Photo de profil info text -->
          <div class="text-xs text-gray-400">
            <p>Photo de profil - Optionnel - Max 800KB</p>
            <p>Cliquez sur l'avatar ci-dessus pour changer votre photo</p>
          </div>
        </div>
      </div>
      
      <!-- Submit Button - Outside the card for better visibility -->
      <button 
        @click="saveProfile" 
        class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 px-4 rounded-xl hover:from-pink-700 hover:to-purple-700 transform hover:translate-y-[-2px] transition-all duration-300 shadow-lg shadow-pink-900/30 flex items-center justify-center space-x-2 mb-6"
      >
        <span>Commencer à voter</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <!-- Delete Profile Button -->
      <button 
        v-if="userExists"
        @click="confirmDeleteProfile" 
        class="w-full bg-black/40 border border-red-500/50 text-red-400 font-medium py-2 px-4 rounded-xl hover:bg-red-900/30 transition-all duration-300 flex items-center justify-center space-x-2 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Supprimer mon profil</span>
      </button>
      
      <!-- Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-black/80 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
          <h3 class="text-xl font-bold text-white mb-4">Confirmer la suppression</h3>
          <p class="text-gray-300 mb-6">Es-tu sûr de vouloir supprimer ton profil ? Cette action est irréversible.</p>
          <div class="flex space-x-3">
            <button 
              @click="deleteProfile" 
              class="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors duration-300"
            >
              Supprimer
            </button>
            <button 
              @click="showDeleteModal = false" 
              class="flex-1 bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors duration-300"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="text-center text-xs text-purple-300 opacity-80 mb-4">
        <p>© 2025 Eurovision Vote App</p>
        <p class="mt-1 flex items-center justify-center">
          <span>Fait avec</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-pink-500 mx-1 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
          <span>pour l'Eurovision</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

// Eurovision-themed colors
const eurovisionColors = ['#FF1958', '#00C7FF', '#FFD700', '#9B59B6', '#3498DB', '#E74C3C'];

const pseudo = ref('');
const avatar = ref('');
const color = ref(getRandomColor());
const userStore = useUserStore();
const router = useRouter();
const errorMessage = ref('');
const deviceId = ref('');
const userExists = ref(false);
const showDeleteModal = ref(false);
const userDocRef = ref(null);

// Constants for image validation
const MAX_IMAGE_SIZE = 800 * 1024; // 800KB max size for Firestore
const MAX_IMAGE_DIMENSION = 500; // Max width/height in pixels

onMounted(async () => {
  // Générer un ID unique pour ce device
  deviceId.value = await generateDeviceId();
  
  // Charger l'utilisateur avec le userStore
  const userLoaded = await userStore.loadUserByDevice(deviceId.value);
  
  if (userLoaded) {
    // Si l'utilisateur existe, on met à jour les refs locales
    pseudo.value = userStore.pseudo;
    avatar.value = userStore.avatar;
    color.value = userStore.color;
    userExists.value = true;
  }
});

// Générer un ID unique pour le device
async function generateDeviceId() {
  // Utiliser une combinaison d'informations du navigateur pour créer un ID unique
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = navigator.languages.join(',');
  const platform = navigator.platform;
  
  // Créer une empreinte unique basée sur ces informations
  const deviceFingerprint = `${userAgent}-${screenWidth}x${screenHeight}-${colorDepth}-${timezone}-${languages}-${platform}-${Date.now()}`;
  
  // Créer un hash plus robuste de cette empreinte
  let hash = 0;
  for (let i = 0; i < deviceFingerprint.length; i++) {
    const char = deviceFingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Ajouter un timestamp pour encore plus d'unicité
  const timestamp = new Date().getTime();
  const finalHash = `${Math.abs(hash).toString(16)}_${timestamp}`;
  
  return finalHash;
}

function getRandomColor() {
  return eurovisionColors[Math.floor(Math.random() * eurovisionColors.length)];
}

async function handleAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size
  if (file.size > 5 * 1024 * 1024) { // 5MB initial check
    errorMessage.value = "L'image est trop volumineuse (max 5MB)";
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const img = new Image();
    img.onload = async () => {
      // Resize image if needed
      const resizedImage = resizeImage(img);
      if (resizedImage) {
        avatar.value = resizedImage;
        errorMessage.value = '';
        
        // Enregistrer automatiquement la photo si l'utilisateur existe
        if (userExists.value) {
          await userStore.saveUserToDevice(deviceId.value);
        }
      }
    };
    img.onerror = () => {
      errorMessage.value = "Format d'image non supporté";
    };
    img.src = e.target.result;
  };
  reader.onerror = () => {
    errorMessage.value = "Erreur lors de la lecture du fichier";
  };
  reader.readAsDataURL(file);
}

function resizeImage(img) {
  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;
  
  // Calculate new dimensions while maintaining aspect ratio
  if (width > height) {
    if (width > MAX_IMAGE_DIMENSION) {
      height = Math.round(height * (MAX_IMAGE_DIMENSION / width));
      width = MAX_IMAGE_DIMENSION;
    }
  } else {
    if (height > MAX_IMAGE_DIMENSION) {
      width = Math.round(width * (MAX_IMAGE_DIMENSION / height));
      height = MAX_IMAGE_DIMENSION;
    }
  }
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  
  // Try different quality levels to get under the size limit
  let quality = 0.9;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  
  // Reduce quality until the image is under the size limit
  while (dataUrl.length > MAX_IMAGE_SIZE && quality > 0.1) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }
  
  if (dataUrl.length > MAX_IMAGE_SIZE) {
    errorMessage.value = "Impossible de réduire l'image suffisamment. Essayez une image plus petite.";
    return null;
  }
  
  return dataUrl;
}

async function saveProfile() {
  errorMessage.value = '';
  
  if (pseudo.value.trim() === '') {
    errorMessage.value = 'Merci de renseigner un pseudo !';
    return;
  }

  const finalColor = color.value;
  const finalAvatar = avatar.value || generateDefaultAvatar(pseudo.value, finalColor);

  userStore.setUser(pseudo.value, finalAvatar, finalColor);
  const saved = await userStore.saveUserToDevice(deviceId.value);

  if (saved) {
    userExists.value = true;
    router.push('/vote');
  } else {
    errorMessage.value = "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.";
  }
}

function confirmDeleteProfile() {
  showDeleteModal.value = true;
}

async function deleteProfile() {
  try {
    userStore.clearUser();
    userExists.value = false;
    showDeleteModal.value = false;
    pseudo.value = '';
    avatar.value = '';
    color.value = getRandomColor();
    errorMessage.value = "Ton profil a été supprimé avec succès.";
    
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  } catch (error) {
    console.error("Erreur lors de la suppression du profil:", error);
    errorMessage.value = "Une erreur est survenue lors de la suppression du profil.";
    showDeleteModal.value = false;
  }
}

function generateDefaultAvatar(name, bgColor) {
  const initial = name.charAt(0).toUpperCase() || '?';

  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${lightenColor(bgColor, 20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#grad)" />
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="40" font-family="Arial" font-weight="bold" dy=".3em">${initial}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Helper function to lighten a color
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}
</script>