import { getSongsForArtist, searchSongs } from '../api'
import playSong from './player'
import { getFavorites, toggleFavorite, isInFavorite } from '../favorites'

// On obtient l'élément DOM qui nous servira de template pour un élément de la list
const songListItemTemplate = document.querySelector('#list-item-template')

// Element DOM de la liste à manipuler
const songList = document.querySelector('.list')

const songSectionTitle = document.querySelector('#list-section h4')

// Cette fonction s'occupe de modifier l'icone à l'intérieur de l'élément passé en paramètre,
// selon si la chanson en deuxième paramètre est présente ou non
const toggleFavoriteIcon = (favoriteIcon, song) => {
  if(isInFavorite(song)) {
    favoriteIcon.innerText = 'playlist_remove' // ou favorite pour le coeur plein
  } else {
    favoriteIcon.innerText = 'playlist_add'  // ou favorite_border pour le coeur vide
  }
}

// Génère le HTML nécessaire pour afficher une liste de chansons, basé sur le tableau passé en paramètre
const renderSongs = (songs) => {
  // On vide la liste de ses anciennes informations, pour en ajouter de nouvelles à jour
  songList.replaceChildren()

  // On itère sur chacune des chansons récupérées depuis l'API pour cet artiste
  songs.forEach((song) => {
    // Créer une copie du template et de son contenu pour avoir un nouvelle élément vierge
    // que l'on stock dans la variable newSongItem
    const newSongItem = songListItemTemplate.content.cloneNode(true)

    // On rempli le titre de la chanson dans ce nouvel élément, en sélectionnant l'élément
    // list-item-title à l'intérieur (!dans newSongItem! Pas dans document)
    newSongItem.querySelector('.list-item-title').innerHTML = song.title

    newSongItem.querySelector('a').href = `#songs-${song.id}`

    // Au clique sur le bouton play, on transmet la chanson et le tableau duquel elle provient au player. Cela permet de
    // lire la chanson et passer le contexte actuel au player (le tableau) pour faire précédent/suivant
    newSongItem.querySelector('.play-button').addEventListener('click', () => {
      playSong(song, songs)
      window.location.hash = '#player'
    })

    // On récupère l'icone des favoris pour le modifier
    const favoriteIcon = newSongItem.querySelector('.favorite-button .material-icons')

    // Au clique sur le bouton favori, on toggle la chanson dans le storage et on ajuste son icone en fonction
    newSongItem.querySelector('.favorite-button').addEventListener('click', () => {
      toggleFavorite(song)
      toggleFavoriteIcon(favoriteIcon, song) // on passe le target du click, à savoir l'icône
    })

    // A l'insertion, on met à jour l'icone, si la chanson est présente dans les favoris, afin d'avoir un icône
    // correspondant à l'état de base
    toggleFavoriteIcon(favoriteIcon, song)

    // On l'ajoute à la liste de chansons
    songList.append(newSongItem)
  })
}

// Génère le HTML nécessaire pour afficher la liste de chanson d'un artiste, basé sur son id
const renderSongsForArtistSection = async (artistId) => {
  // On récupère les songs d'un artiste depuis l'API, en se servant de son Id passé en paramètre
  const songs = await getSongsForArtist(artistId)

  // Set le nom de l'artiste
  songSectionTitle.textContent = `Artistes > ${songs[0].artist.name}`

  // Affiche les chansons
  renderSongs(songs)
}

// Génère le HTML nécessaire pour afficher la liste de chanson d'un artiste, basé sur son id
const renderSongsForSearchSection = async (query) => {
  // On récupère les songs correspondant à la recherche depuis l'API, en se servant de la query passée en paramètre
  const songs = await searchSongs(query)

  // Set le titre de la section
  songSectionTitle.textContent = `Résultats pour "${decodeURIComponent(query)}"`

  // Affiche les chansons
  renderSongs(songs)
}

// Charge la section des chansons selon le tableau de favoris
const renderFavoritesSongsSection = () => {
  // On récupère les songs présentent dans les favoris
  const songs = getFavorites()

  // Set le titre de la section
  songSectionTitle.innerText = 'Favoris'

  // Affiche les chansons
  renderSongs(songs)
}

export { renderSongsForArtistSection, renderSongsForSearchSection, renderFavoritesSongsSection }
