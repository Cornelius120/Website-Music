// Menunggu seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener("DOMContentLoaded", () => {
  // --- SELEKSI ELEMEN DOM ---
  const songListElement = document.getElementById("song-list");
  const searchBar = document.getElementById("search-bar");
  const sectionTitle = document.getElementById("section-title");
  const allSongsBtn = document.getElementById("all-songs-btn");
  const bookmarkedSongsBtn = document.getElementById("bookmarked-songs-btn");
  const notification = document.getElementById("notification");

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
  let displayedSongs = []; // Daftar lagu yang diacak dan ditampilkan
  let isBookmarkViewActive = false;
  let currentPlayContext = []; // Daftar lagu yang sedang aktif (semua, bookmark, atau hasil search)

  // --- FUNGSI-FUNGSI ---

  // Fungsi untuk mengacak urutan array (Fisher-Yates Shuffle)
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  // Memuat bookmark dari localStorage
  function loadBookmarks() {
    const bookmarks = localStorage.getItem("bookmarkedSongs");
    if (bookmarks) bookmarkedSongs = JSON.parse(bookmarks);
  }

  // Menyimpan bookmark ke localStorage
  function saveBookmarks() {
    localStorage.setItem("bookmarkedSongs", JSON.stringify(bookmarkedSongs));
  }

  // Menampilkan notifikasi
  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000); // Sembunyikan setelah 2 detik
  }

  // Menampilkan lagu ke dalam daftar
  function renderSongs(songsToRender) {
    songListElement.innerHTML = "";
    currentPlayContext = songsToRender; // Update konteks pemutaran
    if (songsToRender.length === 0) {
      songListElement.innerHTML = `<p class="empty-message">${
        isBookmarkViewActive
          ? "Anda belum punya bookmark."
          : "Lagu tidak ditemukan."
      }</p>`;
      return;
    }

    songsToRender.forEach((song, index) => {
      const isBookmarked = bookmarkedSongs.includes(song.id);
      const li = document.createElement("li");
      li.className = "song-item";
      li.dataset.id = song.id;
      li.dataset.index = index;

      li.innerHTML = `
                <img src="${song.cover}" alt="${song.title}" class="song-cover">
                <div class="song-item-info">
                    <p class="song-item-title">${song.title}</p>
                    <p class="song-item-artist">${song.artist}</p>
                </div>
                <div class="song-actions">
                    <button class="permalink-btn" title="Salin Link Lagu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
                    </button>
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
    if (!song) return;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerCover.src = song.cover;
    audioPlayer.src = song.src;
  }

  // Memutar lagu
  function playSong() {
    if (!currentPlayContext[currentSongIndex]) return;
    isPlaying = true;
    playPauseBtn.title = "Pause";
    audioPlayer.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
    document
      .querySelectorAll(".song-item")
      .forEach((item) => item.classList.remove("playing"));
    const currentSongElement = document.querySelector(
      `[data-id="${currentPlayContext[currentSongIndex].id}"]`
    );
    if (currentSongElement) {
      currentSongElement.classList.add("playing");
    }
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
    if (audioPlayer.src) {
      // Hanya toggle jika ada lagu yang dimuat
      if (isPlaying) pauseSong();
      else playSong();
    }
  }

  // Lagu sebelumnya
  function prevSong() {
    currentSongIndex =
      (currentSongIndex - 1 + currentPlayContext.length) %
      currentPlayContext.length;
    loadSong(currentPlayContext[currentSongIndex]);
    playSong();
  }

  // Lagu berikutnya
  function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % currentPlayContext.length;
    loadSong(currentPlayContext[currentSongIndex]);
    playSong();
  }

  // Update progress bar dan waktu
  function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = isNaN(progressPercent) ? 0 : progressPercent;
    durationEl.textContent = formatTime(duration);
    currentTimeEl.textContent = formatTime(currentTime);
  }

  // Mengatur posisi lagu saat progress bar diubah
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    if (duration) audioPlayer.currentTime = (clickX / width) * duration;
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
    if (isBookmarkViewActive) {
      const bookmarkedList = songs.filter((song) =>
        bookmarkedSongs.includes(song.id)
      );
      renderSongs(bookmarkedList);
    }
  }

  // Fungsi untuk live search
  function filterSongs() {
    const query = searchBar.value.toLowerCase();
    let sourceList = isBookmarkViewActive
      ? songs.filter((s) => bookmarkedSongs.includes(s.id))
      : displayedSongs;

    if (!query) {
      renderSongs(sourceList);
      return;
    }

    const filteredSongs = sourceList.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.genre.toLowerCase().includes(query)
    );
    renderSongs(filteredSongs);
  }

  // Fungsi untuk menangani permalink
  function handlePermalink() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const songToHighlight = songs.find((song) => song.id === hash);
    if (songToHighlight) {
      const songIndexInShuffled = displayedSongs.findIndex(
        (song) => song.id === hash
      );
      if (songIndexInShuffled !== -1) {
        currentSongIndex = songIndexInShuffled;
        loadSong(songToHighlight);
        currentPlayContext = displayedSongs;

        const element = document.querySelector(`[data-id="${hash}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlight");
          setTimeout(() => element.classList.remove("highlight"), 2000);
        }
      }
    }
  }

  // --- EVENT LISTENERS ---
  searchBar.addEventListener("input", filterSongs);
  playPauseBtn.addEventListener("click", togglePlayPause);
  prevBtn.addEventListener("click", prevSong);
  nextBtn.addEventListener("click", nextSong);
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener(
    "loadedmetadata",
    () => (durationEl.textContent = formatTime(audioPlayer.duration))
  );
  progressBar.addEventListener("input", setProgress);
  audioPlayer.addEventListener("ended", nextSong);

  songListElement.addEventListener("click", (e) => {
    const songItem = e.target.closest(".song-item");
    if (!songItem) return;

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    const permalinkBtn = e.target.closest(".permalink-btn");

    if (permalinkBtn) {
      const songId = songItem.dataset.id;
      const permalink = `${window.location.origin}${window.location.pathname}#${songId}`;
      const tempInput = document.createElement("textarea");
      tempInput.value = permalink;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showNotification("Link lagu disalin!");
    } else if (bookmarkBtn) {
      const songId = songItem.dataset.id;
      toggleBookmark(songId, bookmarkBtn);
    } else {
      currentSongIndex = parseInt(songItem.dataset.index);
      loadSong(currentPlayContext[currentSongIndex]);
      playSong();
    }
  });

  allSongsBtn.addEventListener("click", () => {
    isBookmarkViewActive = false;
    allSongsBtn.classList.add("active");
    bookmarkedSongsBtn.classList.remove("active");
    sectionTitle.textContent = "Semua Lagu";
    filterSongs(); // Gunakan filter untuk merender ulang dengan source yang benar
  });

  bookmarkedSongsBtn.addEventListener("click", () => {
    isBookmarkViewActive = true;
    bookmarkedSongsBtn.classList.add("active");
    allSongsBtn.classList.remove("active");
    sectionTitle.textContent = "Lagu Bookmark";
    filterSongs(); // Gunakan filter untuk merender ulang dengan source yang benar
  });

  // --- INISIALISASI ---
  loadBookmarks();
  displayedSongs = shuffle([...songs]);
  renderSongs(displayedSongs);
  handlePermalink();
});
