import { defineStore } from 'pinia';
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getOrCreateDeviceId } from '@/utils/device'; // Assure-toi que cette fonction existe

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
      this.saveToLocalStorage();
    },
    clearUser() {
      this.pseudo = '';
      this.avatar = '';
      this.color = '#000000';
      this.deviceId = '';
      localStorage.removeItem('user');
    },
    saveToLocalStorage() {
      localStorage.setItem('user', JSON.stringify({
        pseudo: this.pseudo,
        avatar: this.avatar,
        color: this.color,
        deviceId: this.deviceId,
      }));
    },
    loadFromLocalStorage() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const { pseudo, avatar, color, deviceId } = JSON.parse(storedUser);
        this.pseudo = pseudo;
        this.avatar = avatar;
        this.color = color;
        this.deviceId = deviceId;
      }
    },
    async loadUserByDevice() {
      const deviceId = getOrCreateDeviceId(); // Empreinte du téléphone (à stocker dans localStorage aussi si besoin)
      this.deviceId = deviceId;
      this.saveToLocalStorage();
      
      try {
        const usersRef = collection(db, 'users');
        const deviceQuery = query(usersRef, where('deviceId', '==', deviceId));
        const snapshot = await getDocs(deviceQuery);
        
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          this.pseudo = userData.pseudo || '';
          this.avatar = userData.avatar || '';
          this.color = userData.color || '#000000';
          this.saveToLocalStorage();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        return false;
      }
    },
    async saveUserToDevice() {
      if (!this.pseudo) return false;

      const deviceId = this.deviceId || getOrCreateDeviceId();
      this.deviceId = deviceId;
      this.saveToLocalStorage();

      try {
        const usersRef = collection(db, 'users');
        const normalizedPseudo = this.pseudo.trim().toLowerCase();

        const pseudoQuery = query(usersRef, where('pseudoLower', '==', normalizedPseudo));
        const pseudoSnapshot = await getDocs(pseudoQuery);

        if (!pseudoSnapshot.empty) {
          const existingUser = pseudoSnapshot.docs[0];
          if (existingUser.data().deviceId !== deviceId) {
            throw new Error('Ce pseudo est déjà utilisé');
          }
        }

        const deviceQuery = query(usersRef, where('deviceId', '==', deviceId));
        const deviceSnapshot = await getDocs(deviceQuery);

        if (!deviceSnapshot.empty) {
          await updateDoc(deviceSnapshot.docs[0].ref, {
            pseudo: this.pseudo,
            pseudoLower: normalizedPseudo,
            avatar: this.avatar,
            color: this.color,
            updatedAt: new Date(),
          });
        } else {
          await addDoc(usersRef, {
            pseudo: this.pseudo,
            pseudoLower: normalizedPseudo,
            avatar: this.avatar,
            color: this.color,
            deviceId: deviceId,
            createdAt: new Date(),
          });
        }

        this.saveToLocalStorage();
        return true;
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des données utilisateur:", error);
        return false;
      }
    }
  }
});