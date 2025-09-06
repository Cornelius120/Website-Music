// Menunggu seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener("DOMContentLoaded", () => {
  // --- SELEKSI ELEMEN DOM ---
  const songListElement = document.getElementById("song-list");
  const searchBar = document.getElementById("search-bar");
  const sectionTitle = document.getElementById("section-title");

  // Elemen Audio
  const audioPlayer = document.getElementById("audio-player");

  // Elemen Player UI
  const playerCover = document.getElementById("player-cover");
  const playerTitle = document.getElementById("player-title");
  const playerArtist = document.getElementById("player-artist");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playIcon = playPauseBtn.querySelector(".play-icon-svg");
  const pauseIcon = playPauseBtn.querySelector(".pause-icon-svg");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");

  // --- STATE APLIKASI ---
  let currentSongIndex = 0;
  let isPlaying = false;
  let bookmarkedSongs = [];

  // --- FUNGSI-FUNGSI ---

  // Memuat bookmark dari localStorage saat aplikasi dimulai
  function loadBookmarks() {
    const bookmarks = localStorage.getItem("bookmarkedSongs");
    if (bookmarks) {
      bookmarkedSongs = JSON.parse(bookmarks);
    }
  }

  // Menyimpan bookmark ke localStorage
  function saveBookmarks() {
    localStorage.setItem("bookmarkedSongs", JSON.stringify(bookmarkedSongs));
  }

  // Menampilkan lagu ke dalam daftar
  function renderSongs(songsToRender) {
    songListElement.innerHTML = ""; // Kosongkan daftar sebelum diisi ulang
    if (songsToRender.length === 0) {
      songListElement.innerHTML =
        '<p class="empty-message">Lagu tidak ditemukan.</p>';
      return;
    }

    songsToRender.forEach((song, index) => {
      const isBookmarked = bookmarkedSongs.includes(song.id);
      const li = document.createElement("li");
      li.classList.add("song-item");
      li.dataset.id = song.id; // Menyimpan ID untuk permalink
      li.dataset.index = songs.findIndex((s) => s.id === song.id); // Menyimpan index asli

      li.innerHTML = `
                <img src="${song.cover}" alt="${song.title}" class="song-cover">
                <div class="song-item-info">
                    <p class="song-item-title">${song.title}</p>
                    <p class="song-item-artist">${song.artist}</p>
                </div>
                <div class="song-actions">
                    <button class="bookmark-btn ${
                      isBookmarked ? "bookmarked" : ""
                    }" title="Bookmark">
                        <svg class="bookmark-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${
                          isBookmarked ? "currentColor" : "none"
                        }" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                </div>
            `;
      songListElement.appendChild(li);
    });
  }

  // Memuat detail lagu ke player
  function loadSong(song) {
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerCover.src = song.cover;
    audioPlayer.src = song.src;
  }

  // Memutar lagu
  function playSong() {
    isPlaying = true;
    playPauseBtn.title = "Pause";
    audioPlayer.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
    // Menandai lagu yang sedang diputar di daftar
    document
      .querySelectorAll(".song-item")
      .forEach((item) => item.classList.remove("playing"));
    document
      .querySelector(`[data-id="${songs[currentSongIndex].id}"]`)
      ?.classList.add("playing");
  }

  // Menghentikan lagu
  function pauseSong() {
    isPlaying = false;
    playPauseBtn.title = "Play";
    audioPlayer.pause();
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }

  // Fungsi toggle untuk tombol play/pause
  function togglePlayPause() {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }

  // Lagu sebelumnya
  function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = songs.length - 1;
    }
    loadSong(songs[currentSongIndex]);
    playSong();
  }

  // Lagu berikutnya
  function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
      currentSongIndex = 0;
    }
    loadSong(songs[currentSongIndex]);
    playSong();
  }

  // Update progress bar dan waktu
  function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;

    // Format waktu
    durationEl.textContent = formatTime(duration);
    currentTimeEl.textContent = formatTime(currentTime);
  }

  // Mengatur posisi lagu saat progress bar diubah
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  // Format waktu dari detik menjadi MM:SS
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Fungsi untuk bookmark
  function toggleBookmark(songId, button) {
    const songIndex = bookmarkedSongs.indexOf(songId);
    const svg = button.querySelector("svg");

    if (songIndex === -1) {
      bookmarkedSongs.push(songId);
      svg.setAttribute("fill", "currentColor");
      button.classList.add("bookmarked");
    } else {
      bookmarkedSongs.splice(songIndex, 1);
      svg.setAttribute("fill", "none");
      button.classList.remove("bookmarked");
    }
    saveBookmarks();
  }

  // Fungsi untuk live search
  function filterSongs() {
    const query = searchBar.value.toLowerCase();
    const filteredSongs = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.genre.toLowerCase().includes(query)
    );
    renderSongs(filteredSongs);
    sectionTitle.textContent = query ? `Hasil untuk "${query}"` : "Semua Lagu";
  }

  // Fungsi untuk menangani permalink
  function handlePermalink() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const songToHighlight = songs.find((song) => song.id === hash);
      if (songToHighlight) {
        const songIndex = songs.indexOf(songToHighlight);
        currentSongIndex = songIndex;
        loadSong(songToHighlight);

        const element = document.querySelector(`[data-id="${hash}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlight");
          // Hapus highlight setelah animasi selesai
          setTimeout(() => {
            element.classList.remove("highlight");
          }, 2000);
        }
      }
    }
  }

  // --- EVENT LISTENERS ---

  // Pencarian
  searchBar.addEventListener("input", filterSongs);

  // Kontrol Player
  playPauseBtn.addEventListener("click", togglePlayPause);
  prevBtn.addEventListener("click", prevSong);
  nextBtn.addEventListener("click", nextSong);

  // Progress Bar
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
  });
  progressBar.addEventListener("click", setProgress);

  // Lagu selesai, putar selanjutnya
  audioPlayer.addEventListener("ended", nextSong);

  // Klik pada daftar lagu (Play atau Bookmark)
  songListElement.addEventListener("click", (e) => {
    const songItem = e.target.closest(".song-item");
    const bookmarkBtn = e.target.closest(".bookmark-btn");

    if (bookmarkBtn) {
      const songId = songItem.dataset.id;
      toggleBookmark(songId, bookmarkBtn);
    } else if (songItem) {
      currentSongIndex = parseInt(songItem.dataset.index);
      loadSong(songs[currentSongIndex]);
      playSong();
    }
  });

  // --- INISIALISASI ---
  loadBookmarks();
  renderSongs(songs);
  handlePermalink();
});
