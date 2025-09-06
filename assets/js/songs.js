// Ini adalah "database" lagu kita.
// Kita akan menggunakan URL langsung untuk file musik dan gambar sampul.
// Penting: Setiap lagu memiliki 'id' yang unik untuk fitur permalink.

const songs = [
  {
    id: "golden-hunterx",
    title: "Golden",
    artist: "Sony Animation",
    genre: "Pop",
    src: "https://archive.org/download/golden-official-lyric-video-kpop-demon-hunters-sony-animation_202509/%E2%80%9CGolden%E2%80%9D%20Official%20Lyric%20Video%20%EF%BD%9C%20KPop%20Demon%20Hunters%20%EF%BD%9C%20Sony%20Animation.m4a", // Contoh dari archive.org
    cover: "https://cdn.imgpile.com/f/T1VtF4I_xl.jpg",
  },
  {
    id: "barudak-phonk-terror",
    title: "BARUDAK PHONK TERROR",
    artist: " DJ VINNIE PARGOY",
    genre: "hip-hop",
    src: "https://drive.usercontent.google.com/download?id=13MCBNXsP8mOhvdnJTh7Qb092Mk2lolZN&export=download&authuser=5",
    cover: "https://cdn.imgpile.com/f/RftTaDC_xl.jpg",
  },
  {
    id: "someone-you-loved-lewis-capaldi",
    title: "Someone You Loved",
    artist: "Lewis Capaldi",
    genre: "Ballad",
    src: "https://archive.org/download/LewisCapaldiSomeoneYouLoved_201909/Lewis%20Capaldi%20-%20Someone%20You%20Loved.mp3", // Contoh dari archive.org
    cover:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Someone_You_Loved_-_Lewis_Capaldi.png/220px-Someone_You_Loved_-_Lewis_Capaldi.png",
  },
  {
    id: "monokrom-tulus",
    title: "Monokrom",
    artist: "Tulus",
    genre: "Pop",
    src: "https://archive.org/download/monokrom_202212/Monokrom.mp3", // Contoh dari archive.org
    cover: "https://i.scdn.co/image/ab67616d0000b27385966455172f3e16422323a0",
  },
  {
    id: "a-sky-full-of-stars-coldplay",
    title: "A Sky Full Of Stars",
    artist: "Coldplay",
    genre: "EDM",
    src: "https://archive.org/download/Coldplay-A-Sky-Full-Of-Stars/Coldplay%20-%20A%20Sky%20Full%20Of%20Stars%20%28Official%20video%29.mp3", // Contoh dari archive.org
    cover:
      "https://upload.wikimedia.org/wikipedia/en/4/4d/Coldplay_-_A_Sky_Full_of_Stars.png",
  },
];
