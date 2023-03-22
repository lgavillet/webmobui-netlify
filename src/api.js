// URL de base du serveur
const BASE_URL = 'https://webmob-ui-22-spotlified.herokuapp.com'

// Fonction loadJson utilisée à l'interne. Elle s'occupe de charger l'url passée en paramètre et convertir
// son résultat en json
 function loadJson(url) {
  return fetch(url).then((response) => response.json())
}

// Retourne une liste d'artistes
 function getArtists() {
  return loadJson(`${BASE_URL}/api/artists`)
}

// Retourne la liste des chansons d'un ariste
 function getSongsForArtist(id) {
  return  loadJson(`${BASE_URL}/api/artists/${id}/songs`)
}

// Retourne un résultat de recherche
 function searchSongs(query) {
  return  loadJson(`${BASE_URL}/api/songs/search/${encodeURIComponent(query)}`)
}

// Retourne la liste des chansons d'un ariste
 function getSongsDetails(id) {
  return  loadJson(`${BASE_URL}/api/songs/${id}`)
}


export { getArtists, getSongsForArtist, searchSongs, getSongsDetails }
