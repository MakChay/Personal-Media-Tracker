// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDocs, setDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export methods for login/signup pages
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, getDocs, query, where, doc, setDoc, deleteDoc };

// Dashboard logic
document.addEventListener('DOMContentLoaded', () => {
  const welcomeMessage = document.getElementById('welcomeMessage');
  const logoutBtn = document.getElementById('logoutBtn');
  const themeToggle = document.getElementById('themeToggle');
  const mediaForm = document.getElementById('mediaForm');
  const mediaList = document.getElementById('mediaList');
  const filter = document.getElementById('filter');
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');

  const totalMovies = document.getElementById('totalMovies');
  const totalTVShows = document.getElementById('totalTVShows');
  const totalBooks = document.getElementById('totalBooks');
  const totalMusic = document.getElementById('totalMusic');

  let currentUser = null;
  let mediaArray = [];

  // Auth state
  onAuthStateChanged(auth, user => {
    if (user) {
      currentUser = user;
      if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${user.email}!`;
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      loadUserMedia();
    } else {
      currentUser = null;
      window.location.href = '/index.html'; // redirect if not logged in
    }
  });

  // Logout
  if (logoutBtn) logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "/index.html";
  });

  // Dark/Light mode
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // Load user media
  async function loadUserMedia() {
    if (!currentUser) return;
    mediaArray = [];
    const q = query(collection(db, 'media'), where('uid', '==', currentUser.uid));
    const snap = await getDocs(q);
    snap.forEach(docSnap => mediaArray.push({ id: docSnap.id, ...docSnap.data() }));
    renderMedia();
  }

  // Update stats
  function updateStats() {
    totalMovies.textContent = mediaArray.filter(m => m.type === 'Movie').length;
    totalTVShows.textContent = mediaArray.filter(m => m.type === 'TV Show').length;
    totalBooks.textContent = mediaArray.filter(m => m.type === 'Book').length;
    totalMusic.textContent = mediaArray.filter(m => m.type === 'Music').length;
  }

  // Render media cards
  function renderMedia() {
    mediaList.innerHTML = '';
    if (!currentUser) return;

    let filtered = mediaArray.filter(m =>
      (filter.value === 'All' || m.type === filter.value) &&
      m.title.toLowerCase().includes(search.value.toLowerCase())
    );

    if (sort) {
      if (sort.value === 'newest') filtered.sort((a, b) => b.createdAt - a.createdAt);
      if (sort.value === 'oldest') filtered.sort((a, b) => a.createdAt - b.createdAt);
      if (sort.value === 'highest') filtered.sort((a, b) => b.rating - a.rating);
    }

    filtered.forEach(media => {
      const card = document.createElement('div');
      card.className = 'media-card';

      const content = document.createElement('div');
      content.className = 'card-content';

      const h3 = document.createElement('h3'); 
      h3.textContent = media.title;
      const p = document.createElement('p'); 
      p.textContent = media.type;

      // Rating stars
      const stars = document.createElement('div');
      stars.className = 'rating-stars';
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = i <= media.rating ? '★' : '☆';
        star.style.cursor = 'pointer';
        star.style.color = '#ffb400';
        star.addEventListener('click', async () => {
          media.rating = i;
          await setDoc(doc(db, 'media', media.id), { rating: media.rating }, { merge: true });
          renderMedia();
        });
        stars.appendChild(star);
      }

      content.appendChild(h3);
      content.appendChild(p);
      content.appendChild(stars);

      // Edit button
      const editBtn = document.createElement('button'); 
      editBtn.textContent = 'Edit';
      editBtn.className = 'btn-small btn-edit';
      editBtn.onclick = async () => {
        const newTitle = prompt('Edit title:', media.title);
        const newType = prompt('Edit type (Movie, TV Show, Book, Music):', media.type);
        if (newTitle && newTitle.trim() !== '') media.title = newTitle.trim();
        if (newType && ['Movie','TV Show','Book','Music'].includes(newType)) media.type = newType;
        await setDoc(doc(db, 'media', media.id), { title: media.title, type: media.type }, { merge: true });
        renderMedia();
      };

      // Delete button
      const delBtn = document.createElement('button'); 
      delBtn.textContent = 'Delete';
      delBtn.className = 'btn-small btn-delete';
      delBtn.onclick = async () => {
        await deleteDoc(doc(db, 'media', media.id));
        mediaArray = mediaArray.filter(m => m.id !== media.id);
        renderMedia();
      };

      content.appendChild(editBtn);
      content.appendChild(delBtn);

      card.appendChild(content);
      mediaList.appendChild(card);
    });

    updateStats();
  }

  // Add media
  if (mediaForm) mediaForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentUser) return;

    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;

    const docRef = await addDoc(collection(db, 'media'), {
      uid: currentUser.uid,
      title,
      type,
      rating: 0,
      createdAt: Date.now()
    });

    mediaArray.push({ id: docRef.id, uid: currentUser.uid, title, type, rating: 0, createdAt: Date.now() });
    mediaForm.reset();
    renderMedia();
  });

  // Filter / Search / Sort
  if (filter) filter.addEventListener('change', renderMedia);
  if (search) search.addEventListener('input', renderMedia);
  if (sort) sort.addEventListener('change', renderMedia);
});
