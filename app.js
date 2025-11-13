const form = document.getElementById('mediaForm');
const mediaList = document.getElementById('mediaList');

// Load saved media from localStorage
let mediaArray = JSON.parse(localStorage.getItem('mediaList')) || [];

// Render saved media
function renderMedia() {
  mediaList.innerHTML = '';
  mediaArray.forEach((media, index) => {
    const li = document.createElement('li');
    li.textContent = `${media.title} (${media.type})`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      mediaArray.splice(index, 1);
      saveAndRender();
    };

    li.appendChild(deleteBtn);
    mediaList.appendChild(li);
  });
}

// Save to localStorage and rerender
function saveAndRender() {
  localStorage.setItem('mediaList', JSON.stringify(mediaArray));
  renderMedia();
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const type = document.getElementById('type').value;

  mediaArray.push({ title, type });
  saveAndRender();

  form.reset();
});

// Initial render
renderMedia();
