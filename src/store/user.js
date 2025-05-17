import { defineStore } from 'pinia';
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export const useUserStore = defineStore('user', {
  state: () => ({
    pseudo: '',
    avatar: '',
    color: '#000000',
    deviceId: '',
  }),
  actions: {
    setUser(pseudo, avatar, color = '#000000') {
      this.pseudo = pseudo;
      this.avatar = avatar;
      this.color = color;
    },
    clearUser() {
      this.pseudo = '';
      this.avatar = '';
      this.color = '#000000';
    },
    async loadUserByDevice(deviceId) {
      this.deviceId = deviceId;
      try {
        const usersRef = collection(db, 'users');
        const deviceQuery = query(usersRef, where('deviceId', '==', deviceId));
        const snapshot = await getDocs(deviceQuery);
        
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          this.pseudo = userData.pseudo || '';
          this.avatar = userData.avatar || '';
          this.color = userData.color || '#000000';
          return true;
        }
        return false;
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        return false;
      }
    },
    async saveUserToDevice(deviceId) {
      if (!this.pseudo) return false;
      
      try {
        const usersRef = collection(db, 'users');
        
        // Vérifier si le pseudo existe déjà
        const pseudoQuery = query(usersRef, where('pseudoLower', '==', this.pseudo.trim().toLowerCase()));
        const pseudoSnapshot = await getDocs(pseudoQuery);
        
        if (!pseudoSnapshot.empty) {
          // Si le pseudo existe déjà et appartient à un autre device
          const existingUser = pseudoSnapshot.docs[0];
          if (existingUser.data().deviceId !== deviceId) {
            throw new Error('Ce pseudo est déjà utilisé');
          }
        }
        
        const deviceQuery = query(usersRef, where('deviceId', '==', deviceId));
        const deviceSnapshot = await getDocs(deviceQuery);
        
        const normalizedPseudo = this.pseudo.trim().toLowerCase();
        
        if (!deviceSnapshot.empty) {
          // Update existing user
          await updateDoc(deviceSnapshot.docs[0].ref, {
            pseudo: this.pseudo,
            pseudoLower: normalizedPseudo,
            avatar: this.avatar,
            color: this.color,
            updatedAt: new Date(),
          });
        } else {
          // Create new user
          await addDoc(usersRef, {
            pseudo: this.pseudo,
            pseudoLower: normalizedPseudo,
            avatar: this.avatar,
            color: this.color,
            deviceId: deviceId,
            createdAt: new Date(),
          });
        }
        return true;
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des données utilisateur:", error);
        return false;
      }
    }
  }
});
