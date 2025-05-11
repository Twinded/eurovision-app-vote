import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    pseudo: localStorage.getItem('pseudo') || '',
    avatar: localStorage.getItem('avatar') || '',
    color: localStorage.getItem('color') || '#000000',
  }),
  actions: {
    setUser(pseudo, avatar, color = '#000000') {
      this.pseudo = pseudo;
      this.avatar = avatar;
      this.color = color;
      localStorage.setItem('pseudo', pseudo);
      localStorage.setItem('avatar', avatar);
      localStorage.setItem('color', color);
    },
    clearUser() {
      this.pseudo = '';
      this.avatar = '';
      this.color = '#000000';
      localStorage.removeItem('pseudo');
      localStorage.removeItem('avatar');
      localStorage.removeItem('color');
    },
  }
});
