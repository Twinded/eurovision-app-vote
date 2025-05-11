<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white">
    <!-- Logo and Header -->
    <div class="w-full max-w-md">
      <div class="text-center">
        <img src="@/assets/logo.svg" alt="Eurovision Vote Logo" class="h-64 mx-auto animate-pulse" />
      </div>
      
      <!-- Main Card -->
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
        <!-- Avatar Preview -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div class="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 animate-pulse blur-md opacity-70"></div>
            <div v-if="avatar" class="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/30">
              <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
            </div>
            <div 
              v-else 
              class="relative w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30"
              :style="{ backgroundColor: color }"
            >
              {{ pseudo.charAt(0).toUpperCase() || '?' }}
            </div>
          </div>
        </div>
        
        <!-- Error message -->
        <div v-if="errorMessage" class="bg-red-500/80 text-white p-3 rounded-lg text-center text-sm mb-4 animate-bounce">
          {{ errorMessage }}
        </div>
        
        <!-- Form -->
        <div class="space-y-4">
          <!-- Pseudo Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              v-model="pseudo" 
              type="text" 
              placeholder="Ton pseudo" 
              class="w-full bg-white/20 border border-white/30 pl-10 pr-3 py-3 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>
          
          <!-- Color Picker -->
          <div class="bg-white/10 rounded-xl p-3 border border-white/20">
            <p class="text-xs text-blue-200 mb-2 font-medium">Choisis ta couleur:</p>
            <div class="flex justify-between items-center">
              <div 
                v-for="colorOption in ['#FF1958', '#00C7FF', '#FFD700', '#9B59B6', '#3498DB', '#E74C3C']" 
                :key="colorOption"
                @click="color = colorOption"
                class="w-10 h-10 rounded-full cursor-pointer transform hover:scale-110 transition-transform duration-200 border-2 shadow-lg"
                :class="{ 'border-white scale-110': color === colorOption, 'border-transparent': color !== colorOption }"
                :style="{ backgroundColor: colorOption }"
              ></div>
            </div>
          </div>
          
          <!-- Avatar Upload -->
          <div class="relative group">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <button class="w-full bg-white/20 border border-white/30 pl-10 pr-3 py-3 rounded-xl text-left text-blue-200 hover:bg-white/30 transition-colors duration-200">
              Choisir une photo
            </button>
            <input 
              type="file" 
              @change="handleAvatar" 
              accept="image/*" 
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          <!-- Submit Button -->
          <button 
            @click="saveProfile" 
            class="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold py-4 px-4 rounded-xl hover:opacity-90 transform hover:scale-102 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
          >
            <span>Commencer à voter</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="text-center text-xs text-blue-200 opacity-70">
        <p>© 2025 Eurovision Vote App</p>
        <p class="mt-1 flex items-center justify-center">
          <span>Fait avec</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-pink-400 mx-1" viewBox="0 0 20 20" fill="currentColor">
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
import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
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

// Constants for image validation
const MAX_IMAGE_SIZE = 800 * 1024; // 800KB max size for Firestore
const MAX_IMAGE_DIMENSION = 500; // Max width/height in pixels

onMounted(async () => {
  // Générer ou récupérer un ID unique pour ce device
  deviceId.value = await getOrCreateDeviceId();
  
  // Récupérer les informations utilisateur basées sur le deviceId
  await fetchUserByDevice();
});

// Générer un ID unique pour le device ou récupérer celui existant
async function getOrCreateDeviceId() {
  // Utiliser une combinaison d'informations du navigateur pour créer un ID unique
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Créer une empreinte unique basée sur ces informations
  const deviceFingerprint = `${userAgent}-${screenWidth}x${screenHeight}-${colorDepth}-${timezone}`;
  
  // Créer un hash simple de cette empreinte
  let hash = 0;
  for (let i = 0; i < deviceFingerprint.length; i++) {
    const char = deviceFingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en entier 32 bits
  }
  
  return `device_${Math.abs(hash).toString(16)}`;
}

// Récupérer les informations utilisateur basées sur le deviceId
async function fetchUserByDevice() {
  try {
    const usersRef = collection(db, 'users');
    const deviceQuery = query(usersRef, where('deviceId', '==', deviceId.value));
    const snapshot = await getDocs(deviceQuery);
    
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();
      pseudo.value = userData.pseudo || '';
      avatar.value = userData.avatar || '';
      color.value = userData.color || getRandomColor();
      
      // Mettre à jour le store utilisateur
      userStore.setUser(pseudo.value, avatar.value, color.value);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur:", error);
  }
}

function getRandomColor() {
  return eurovisionColors[Math.floor(Math.random() * eurovisionColors.length)];
}

function handleAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size
  if (file.size > 5 * 1024 * 1024) { // 5MB initial check
    errorMessage.value = "L'image est trop volumineuse (max 5MB)";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Resize image if needed
      const resizedImage = resizeImage(img);
      avatar.value = resizedImage;
      errorMessage.value = '';
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
  const normalizedPseudo = pseudo.value.trim().toLowerCase();

  try {
    const usersRef = collection(db, 'users');
    const existingUserQuery = query(usersRef, where('pseudoLower', '==', normalizedPseudo));
    const existingSnapshot = await getDocs(existingUserQuery);
    
    // Vérifier si le device existe déjà
    const deviceQuery = query(usersRef, where('deviceId', '==', deviceId.value));
    const deviceSnapshot = await getDocs(deviceQuery);

    if (!deviceSnapshot.empty) {
      // Mise à jour de l'utilisateur existant pour ce device
      await updateDoc(deviceSnapshot.docs[0].ref, {
        pseudo: pseudo.value,
        pseudoLower: normalizedPseudo,
        avatar: finalAvatar,
        color: finalColor,
        updatedAt: new Date(),
      });
    } else if (existingSnapshot.empty) {
      // Création d'un nouvel utilisateur
      await addDoc(usersRef, {
        pseudo: pseudo.value,
        pseudoLower: normalizedPseudo,
        avatar: finalAvatar,
        color: finalColor,
        deviceId: deviceId.value,
        createdAt: new Date(),
      });
    } else {
      // Un utilisateur avec ce pseudo existe mais pas sur ce device
      errorMessage.value = "Ce pseudo est déjà utilisé. Veuillez en choisir un autre.";
      return;
    }

    userStore.setUser(pseudo.value, finalAvatar, finalColor);
    router.push('/vote');
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    if (error.message.includes("property \"avatar\" is longer than")) {
      errorMessage.value = "L'image est trop volumineuse. Veuillez choisir une image plus petite.";
    } else {
      errorMessage.value = "Une erreur est survenue. Veuillez réessayer.";
    }
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