import { getSongsDetails } from '../api'

const songTitle = document.querySelector('#lyrics-section h4')
const artistName = document.querySelector('#lyrics-section h5')
const lyrics = document.querySelector('#lyrics-section p')

const renderLyricsSection = (id) => {
  getSongsDetails(id).then((song) => {
    songTitle.innerHTML = song.title
    artistName.innerHTML = song.artist.name
    lyrics.innerHTML = song.lyrics
  })
}

export { renderLyricsSection }
