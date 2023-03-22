import renderArtists from './sections/artists'
import { renderSongsForArtistSection, renderSongsForSearchSection, renderFavoritesSongsSection } from './sections/songs'
import { renderLyricsSection } from './sections/lyrics'

// On les importe au moins une fois dans l'index, pour être sûr que les eventlisteners seront appelés
import './sections/search_input'

// S'occuper de "toggler" les liens dans la navigation
// Désactiver le lien actif et activer le nouveau en bleu, selon l'url passée en paramètre de la fonction
const toggleNav = (hash) => {
  // On va chercher le lien actuellement affiché (n'importe quel lien dans "nav" qui a une classe active) et en enlève
  // la classe active
  // NB: Noter le ? après le querySelector. Cela veut dire "si on a trouvé quelque chose, on fait la suite, autrement rien"
  document.querySelector(`nav a.active`)?.classList.remove('active')
  // On va chercher le lien avec pour url le href passé en argument et y ajouter la classe active pour le rendre bleu
  // Exemple: <a href="#player">...</a>
  // NB: Noter le ? après le querySelector. Cela veut dire "si on a trouvé quelque chose, on fait la suite, autrement rien"
  document.querySelector(`nav a[href="${hash}"]`)?.classList.add('active')
}

// S'occuper de "toggler" les sections dans le body, en cachant la section actuellement affichée, puis en ajoutant
// la classe active à la nouvelle pour l'afficher
const toggleSection = (hash) => {
  // Comme pour le menu, on enlève la classe active à la section en cours
  document.querySelector(`section.active`)?.classList.remove('active')
  // et on essaie de trouver la section correspondante et l'afficher, en y ajoutant la classe active
  document.querySelector(`${hash}-section`)?.classList.add('active')
}

const displaySection = (hash) => {
  if(hash == '') hash = '#home'

  const hashSplit = hash.split('-')

  // On appelle la fonction toggleNav qui va s'occuper de "toggler" les liens dans la navigation. On se sert toujours
  // de la première partie de l'url (comme ça, si #artists-12 --> #artists est sélectionné)
  toggleNav(hashSplit[0])

  // On appelle la fonction toggleSection qui va s'occuper de "toggler" les sections dans le body. Par défaut, la première
  // partie de l'url correspond à une section dans le HTML, par exemple -> #home --> #home-section. Dans certains cas,
  // on va appeler cette fonction manuellement avec une valeur spécifique, pour afficher la section list, car l'url
  // ne correspond pas
  toggleSection(hashSplit[0])

  switch(hashSplit[0]) {
    case '#artists':
      // S'il y a un paramètre derrière...? Ex: -> #artists-12 -> hashSplit[1] vaudra 12
      if(hashSplit[1]){
        // Cela nous permet d'afficher la section générique "list"
        toggleSection('#list')

        // On affiche la liste des chansons pour un artiste donné (d'après son ID reçu en paramètre)
        renderSongsForArtistSection(hashSplit[1])
      }
      else {
        // On affiche la liste des artistes
        renderArtists()
      }
    break;

    case '#search':
      // Cela nous permet d'afficher la section générique "list"
      toggleSection('#list')

      // On affiche la liste des chansons pour le terme de recherche reçu en paramètre
      renderSongsForSearchSection(hashSplit[1])
    break;


    case '#favorites':
        // Cela nous permet d'afficher la section générique "list"
      toggleSection('#list')

      // On affiche la liste des chansons présentent dans les favoris
      renderFavoritesSongsSection()
    break;

    case '#songs':

      toggleSection('#lyrics')
      renderLyricsSection(hashSplit[1])
    break;
  }
}

// Ici, on écoute la mise à jour des favoris dans le storage. Lorsque la liste à changé et que l'on est dans la section
// favoris, on remet à jour la liste pour enlever les éléments déselectionnés
window.addEventListener('favorites_updated', () => {
  if(window.location.hash == '#favorites')
    renderFavoritesSongsSection()
})

// On link la fonction "displaySection" à l'événement hashchange pour être averti d'un changement de hash dans l'url
window.addEventListener('hashchange', () => displaySection(window.location.hash))

// Affichage au chargement pour traiter l'url en cours (exemple: on ouvre un lien dans un nouvel onglet)
displaySection(window.location.hash)

// Changer la couleur de l'app, si on est offline
window.addEventListener('offline', () => document.body.classList.add('offline'))
window.addEventListener('online', () => document.body.classList.remove('offline'))

// navigator.serviceWorker.register(new URL('workerCacheFetched.js', import.meta.url))
