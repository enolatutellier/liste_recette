// Enregistrer dans la variable "recettes" un tableau contenant toutes les recettes :
var recettes = JSON.parse(localStorage.getItem('recettes')) || [];

// Enregistrer dans des variables des nœuds HTML :
var html = document.querySelector('html');
var recherche = document.getElementById('recherche');
var liste_recettes = document.getElementById('liste-recettes');
var consultation_recette = document.getElementById('consultation-recette');
var liste = document.querySelector('#liste-recettes ul');

var bouton_retour_liste = document.querySelector('#consultation-recette > button');

var titre = document.getElementById('titre-recette');
var description = document.getElementById('description-recette');
var ingredients = document.getElementById('ingredients-recette');
var etapes = document.getElementById('etapes-recette');
var indicateurs = document.getElementById('indicateurs-recette');
var menu = document.getElementById('menu-recette');

var modifications_ingredients;
var modifications_etapes;
var modifications_indicateurs;

/**
 * Ajoute une recette vide au tableau "recettes".
 */
function ajouter_recette() {
    // 1: Ajouter un objet "recette" au tableau "recettes" :
    recettes.push({
                      titre: "Titre", 
                      description: "Description",
                      ingredients: [],
                      etapes: [],
                      indicateurs: {
                          difficulte: 1,
                          duree: 1,
                          prix: 1
                      }
                  });
    console.log(`Ajout d'une recette`);

    // 2: Sauvegarder la liste des recettes :
    sauvegarder_recettes()
    
    // 3: Afficher la liste des recettes :
    afficher_liste_recettes();
}

/**
 * Affiche la liste des recettes.
 */
function afficher_liste_recettes() {
    // 1: Vider la liste des recettes :
    // L'instruction "innerHTML = ``" permettra de vider tout le html contenu dans le UL
    liste.innerHTML = `` ;

    // 2: Parcourir les recettes du tableau "recettes" :
    // Le numero de l'élément est enregistré dans le i tandis que si on avait mis "of" (à la place de "in") on aurait directement stocké l'élément
    for (let i in recettes) {
        let recette = recettes[i];

        // 3: Vérifier si la recette correspond à la recherche :
        if (
            recherche.value == ''
            || strNoAccent(recette.titre.toLowerCase()).replace(/[^0-9a-z]/gi, '').indexOf(strNoAccent(recherche.value.toLowerCase()).replace(/[^0-9a-z]/gi, '')) != -1
        ) {
            // 4: Ajouter le code html correspondant à la recette parcouru à la liste des recettes :
            liste.innerHTML += `<li>
                                    <button class="resume-recette" onclick="afficher_recette(${i}); defiler()">
                                        <h1>${recette.titre}</h1>
                                        <p>${recette.description}</p>
                                        <ul>
                                            <li>Difficulté :
                                                <img src="images/icones/difficulte.svg">
                                                <img ${recette.indicateurs.difficulte < 2 ? 'class="grisee"' : '' } src="images/icones/difficulte.svg">
                                                <img ${recette.indicateurs.difficulte < 3 ? 'class="grisee"' : '' } src="images/icones/difficulte.svg">
                                            </li>
                                            <li>Durée :
                                                <img src="images/icones/duree.svg">
                                                <img ${recette.indicateurs.duree < 2 ? 'class="grisee"' : '' } src="images/icones/duree.svg">
                                                <img ${recette.indicateurs.duree < 3 ? 'class="grisee"' : '' } src="images/icones/duree.svg">
                                            </li>
                                            <li>Prix :
                                                <img src="images/icones/prix.svg">
                                                <img ${recette.indicateurs.prix < 2 ? 'class="grisee"' : '' } src="images/icones/prix.svg">
                                                <img ${recette.indicateurs.prix < 3 ? 'class="grisee"' : '' } src="images/icones/prix.svg">
                                            </li>
                                        </ul>
                                    </button>
                                </li>`
        }
    }
    console.log(`Affichage de la liste des recettes.`);
    
    // 4: Activer ou désactiver les boutons en fonction de leur emplacement dans la page :
    verifier_activite_boutons();
}

/**
 * Affiche la recette sélectionnée dans la liste.
 * 
 * @param {number} numero L'emplacement de la recette à afficher dans le tableau "recettes".
 */
function afficher_recette(numero) {
    // 1: Enregistrer dans la variable "recette" la recette du tableau "recettes" à afficher :
    let recette = recettes[numero];

    // 2: Afficher le bouton de retour à la liste des recettes :
    bouton_retour_liste.toggleAttribute('disable', false);
    bouton_retour_liste.style.cursor = 'pointer';
    bouton_retour_liste.style.opacity = '1';

    // 2: Rendre le titre et la description non modifiables :
    titre.toggleAttribute('contenteditable', false);
    description.toggleAttribute('contenteditable', false);

    // 3: Modifier le titre par le titre de la recette à afficher :
    titre.innerHTML = recette.titre;

    // 4: Modifier la description par la description de la recette à afficher :
    description.innerHTML = recette.description;

    // 5: Modifier la liste des ingrédients par la liste des ingrédients de la recette à afficher :
    ingredients.innerHTML = ``;
    for (let i in recette.ingredients) {
        let ingredient = recette.ingredients[i];
        ingredients.innerHTML += `<li><p>${ingredient}</p></li>`;
    }

    // 6: Modifier la liste des étapes par la liste des étapes de la recette à afficher : 
    etapes.innerHTML = ``;
    for (let i in recette.etapes) {
        let etape = recette.etapes[i];
        etapes.innerHTML += `<li>${etape}</li>`;
    }

    // 7: Modifier les indicateurs par les indicateurs de la recette à afficher :
    indicateurs.innerHTML = `<li>Difficulté :
                                 <img src="images/icones/difficulte.svg">
                                 <img ${recette.indicateurs.difficulte < 2 ? 'class="grisee"' : '' } src="images/icones/difficulte.svg">
                                 <img ${recette.indicateurs.difficulte < 3 ? 'class="grisee"' : '' } src="images/icones/difficulte.svg">
                             </li>
                             <li>Durée :
                                 <img src="images/icones/duree.svg">
                                 <img ${recette.indicateurs.duree < 2 ? 'class="grisee"' : '' } src="images/icones/duree.svg">
                                 <img ${recette.indicateurs.duree < 3 ? 'class="grisee"' : '' } src="images/icones/duree.svg">
                             </li>
                             <li>Prix :
                                 <img src="images/icones/prix.svg">
                                 <img ${recette.indicateurs.prix < 2 ? 'class="grisee"' : '' } src="images/icones/prix.svg">
                                 <img ${recette.indicateurs.prix < 3 ? 'class="grisee"' : '' } src="images/icones/prix.svg">
                             </li>`

    // 8: Modifier les actions disponible dans le menu :
    menu.innerHTML = `<div id="edition">
                          <button onclick="afficher_options('edition')">Éditer</button>
                          <fieldset disabled>
                              <button onclick="fermer_options()"><img src="images/icones/annuler.svg" alt="X"></button>
                              <button onclick="fermer_options(); editer_recette(${numero})"><img src="images/icones/valider.svg" alt="V"></button>
                          </fieldset>
                      </div>  
                      <div id="suppression">
                          <button onclick="afficher_options('suppression')">Supprimer</button>
                          <fieldset disabled>
                              <button onclick="fermer_options()"><img src="images/icones/annuler.svg" alt="X"></button>
                              <button onclick="fermer_options(); supprimer_recette(${numero})"><img src="images/icones/valider.svg" alt="V"></button>
                          </fieldset>
                      </div>`;
    console.log(`Affichage de la recette numero ${numero}.`);

    // 9: Activer ou désactiver les boutons en fonction de leur emplacement dans la page :
    verifier_activite_boutons();
}

function editer_recette(numero) {
    // 1: Enregistrer la recette à éditer dans la variable "recette" :
    let recette = recettes[numero];

    // 2: Cacher le bouton de retour à la liste des recettes :
    bouton_retour_liste.toggleAttribute('disable', true);
    bouton_retour_liste.style.cursor = 'default';
    bouton_retour_liste.style.opacity = '0';

    // 3: Rendre le titre modifiable :
    titre.toggleAttribute('contenteditable', true);

    // 4: Rendre la description modifiable :
    description.toggleAttribute('contenteditable', true);

    // 5: Rendre la liste des ingrédients modifiable :
    modifications_ingredients = recette.ingredients.slice();
    afficher_editeur_liste('ingredients');

    // 6: Rendre la liste des etapes modifiable :
    modifications_etapes = recette.etapes.slice();
    afficher_editeur_liste('etapes');

    // 7: Rendre les indicateurs modifiables :
    modifications_indicateurs = JSON.parse(JSON.stringify(recette.indicateurs));
    afficher_editeur_indicateurs();

    // 7: Modifier les actions disponible dans le menu :
    menu.innerHTML = `<div id="sauvegarde">
                          <button onclick="afficher_options('sauvegarde')">Sauvegarder</button>
                          <fieldset disabled>
                              <button onclick="fermer_options()"><img src="images/icones/annuler.svg" alt="X"></button>
                              <button onclick="fermer_options(); sauvegarder_recette(${numero})"><img src="images/icones/valider.svg" alt="V"></button>
                          </fieldset>
                      </div>  
                      <div id="quitte">
                          <button onclick="afficher_options('quitte')">Quitter</button>
                          <fieldset disabled>
                              <button onclick="fermer_options()"><img src="images/icones/annuler.svg" alt="X"></button>
                              <button onclick="fermer_options(); afficher_recette(${numero})"><img src="images/icones/valider.svg" alt="V"></button>
                          </fieldset>
                      </div>`;
    console.log(`Édition de la recette numero ${numero}.`);
}

function afficher_editeur_liste(nom_liste) {
    switch (nom_liste) {
        case 'ingredients' :
            ingredients.innerHTML = ``;
            for (let i in modifications_ingredients) {
                let ingredient = modifications_ingredients[i];
                ingredients.innerHTML += `<li>
                                              <div>
                                                  <p contenteditable onkeyup="enregistrer_element_liste('ingredients', ${i})">${ingredient}</p>
                                                  <nav>
                                                      ${i > 0 ? `<button onclick="elever_element_liste('ingredients', ${i})"><img src="images/icones/elever.svg" alt="↑"></button>` : ``}
                                                      ${i < modifications_ingredients.length - 1 ? `<button onclick="abaisser_element_liste('ingredients', ${i})"><img src="images/icones/abaisser.svg" alt="↓"></button>` : ``}
                                                      <button onclick="supprimer_element_liste('ingredients', ${i})"><img src="images/icones/annuler.svg" alt="X"></button>
                                                  </nav>
                                              </div>
                                          </li>`;
            }
            ingredients.innerHTML += `<nav><button onclick="ajouter_element_liste('ingredients')"><img src="images/icones/ajouter.svg" alt="+"></button></nav>`;
            break;
        case 'etapes' :
            etapes.innerHTML = ``;
            for (let i in modifications_etapes) {
                let etape = modifications_etapes[i];
                etapes.innerHTML += `<li>
                                         <div>
                                             <p contenteditable onkeyup="enregistrer_element_liste('etapes', ${i})">${etape}</p>
                                             <nav>
                                                 ${i > 0 ? `<button onclick="elever_element_liste('etapes', ${i})"><img src="images/icones/elever.svg" alt="↑"></button>` : ``}
                                                 ${i < modifications_etapes.length -1 ? `<button onclick="abaisser_element_liste('etapes', ${i})"><img src="images/icones/abaisser.svg" alt="↓"></button>` : ``}
                                                 <button onclick="supprimer_element_liste('etapes', ${i})"><img src="images/icones/annuler.svg" alt="X"></button>
                                             </nav>
                                         </div>
                                     </li>`;
            }
            etapes.innerHTML += `<nav><button onclick="ajouter_element_liste('etapes')"><img src="images/icones/ajouter.svg" alt="+"></button></nav>`;
            break;
    }
    console.log(`Affichae de l'éditeur de la liste "${nom_liste}".`);
}

function enregistrer_element_liste(nom_liste, numero) {
    switch (nom_liste) {
        case 'ingredients' :
            modifications_ingredients[numero] = document.querySelector(`#ingredients-recette li:nth-child(${numero + 1}) p`).innerHTML;
            break;
        case  'etapes' :
            modifications_etapes[numero] = document.querySelector(`#etapes-recette li:nth-child(${numero + 1}) p`).innerHTML;
            break;
    }
    console.log(`Enregistrement de l'élément ${numero} dans la liste "${nom_liste}".`);
}

function ajouter_element_liste(nom_liste) {
    switch (nom_liste) {
        case 'ingredients' :
            modifications_ingredients.push('');
            break;
        case  'etapes' :
            modifications_etapes.push('');
            break;
    }
    console.log(`Ajout d'un élément à la liste "${nom_liste}".`);

    afficher_editeur_liste(nom_liste);
}

function elever_element_liste(nom_liste, numero) {
    switch (nom_liste) {
        case 'ingredients' :
            let valeur_ingredient = modifications_ingredients[numero];
            modifications_ingredients.splice(numero, 1);
            modifications_ingredients.splice(numero - 1, 0, valeur_ingredient);
            break;
        case  'etapes' :
            let valeur_etape = modifications_etapes[numero];
            modifications_etapes.splice(numero, 1);
            modifications_etapes.splice(numero - 1, 0, valeur_etape);
            break;
    }
    console.log(`Élévation de l'élément numero ${numero} de la liste "${nom_liste}" d'un niveau.`);

    afficher_editeur_liste(nom_liste);
}

function abaisser_element_liste(nom_liste, numero) {
    switch (nom_liste) {
        case 'ingredients' :
            let valeur_ingredient = modifications_ingredients[numero];
            modifications_ingredients.splice(numero + 2, 0, valeur_ingredient);
            modifications_ingredients.splice(numero, 1);
            break;
        case  'etapes' :
            let valeur_etape = modifications_etapes[numero];
            modifications_etapes.splice(numero + 2, 0, valeur_etape);
            modifications_etapes.splice(numero, 1);
            break;
    }
    console.log(`Abaissement de l'élément numero ${numero} de la liste "${nom_liste}" d'un niveau.`);

    afficher_editeur_liste(nom_liste);
}

function supprimer_element_liste(nom_liste, numero) {
    switch (nom_liste) {
        case 'ingredients' :
            modifications_ingredients.splice(numero, 1);
            break;
        case  'etapes' :
            modifications_etapes.splice(numero, 1);
            break;
    }
    console.log(`Suppression de l'élément numero ${numero} de la liste "${nom_liste}".`);
    
    afficher_editeur_liste(nom_liste);
}

function afficher_editeur_indicateurs() {
    indicateurs.innerHTML = `<li>Difficulté :
                                 <button onclick="definir_indicateur('difficulte', 1)"><img src="images/icones/difficulte.svg"></button>
                                 <button onclick="definir_indicateur('difficulte', 2)"><img ${modifications_indicateurs.difficulte < 2 ? 'class="grisee"' : '' } src="images/icones/difficulte.svg"></button>
                                 <button onclick="definir_indicateur('difficulte', 3)"><img ${modifications_indicateurs.difficulte < 3 ? 'class="grisee"' : '' } src="images/icones/difficulte.svg"></button>
                             </li>
                             <li>Durée :
                                 <button onclick="definir_indicateur('duree', 1)"><img src="images/icones/duree.svg"></button>
                                 <button onclick="definir_indicateur('duree', 2)"><img ${modifications_indicateurs.duree < 2 ? 'class="grisee"' : '' } src="images/icones/duree.svg"></button>
                                 <button onclick="definir_indicateur('duree', 3)"><img ${modifications_indicateurs.duree < 3 ? 'class="grisee"' : '' } src="images/icones/duree.svg"></button>
                             </li>
                             <li>Prix :
                                 <button onclick="definir_indicateur('prix', 1)"><img src="images/icones/prix.svg"></button>
                                 <button onclick="definir_indicateur('prix', 2)"><img ${modifications_indicateurs.prix < 2 ? 'class="grisee"' : '' } src="images/icones/prix.svg"></button>
                                 <button onclick="definir_indicateur('prix', 3)"><img ${modifications_indicateurs.prix < 3 ? 'class="grisee"' : '' } src="images/icones/prix.svg"></button>
                             </li>`
    console.log(`Affichage de l'éditeur des indicateurs.`);
}

function definir_indicateur(indicateur, valeur) {
    modifications_indicateurs[indicateur] = valeur;
    console.log(`Définition de l'indicateur "${indicateur}" à la valeur "${valeur}".`);

    afficher_editeur_indicateurs();
}

function sauvegarder_recette(numero) {
    recettes[numero].titre = titre.innerHTML;

    recettes[numero].description = description.innerHTML;

    recettes[numero].ingredients = [];
    nouveaux_ingredients = document.querySelectorAll(`#ingredients-recette li p`);
    for (nouvel_ingredient of nouveaux_ingredients) {
        recettes[numero].ingredients.push(nouvel_ingredient.innerHTML);
    }

    recettes[numero].etapes = [];
    nouvelles_etapes = document.querySelectorAll(`#etapes-recette li p`);
    for (nouvelle_etape of nouvelles_etapes) {
        recettes[numero].etapes.push(nouvelle_etape.innerHTML);
    }

    recettes[numero].indicateurs = modifications_indicateurs;
    console.log(`Sauvegarde de la recette numero ${numero}.`);

    sauvegarder_recettes();
    afficher_recette(numero);
    afficher_liste_recettes();
}

/**
 * Supprime la recette sélectionnée dans la liste.
 * 
 * @param {number} numero L'emplacement de la recette à supprimer dans le tableau "recettes".
 */
function supprimer_recette(numero) {
    // 1: Supprimer la recette n° [numero] du tableau "recettes" :
    recettes.splice(numero, 1);
    console.log(`Suppression de la recette numero ${numero}.`);

    // 2: Sauvegarder la liste des recettes :
    sauvegarder_recettes();

    // 3: Afficher la liste des recettes :
    afficher_liste_recettes();

    // 4: Défiler sur la section "liste-recettes" :
    defiler();
}



/**
 * Fait défiler les sections "liste_recettes" et "consultation_recette" alternativement de droite à gauche et de gauche à droite.
 */
function defiler() {
    // 1: Ajouter une durée d'animation aux sections de la page égale à leur largeur :
    liste_recettes.style.animationDuration = liste_recettes.offsetWidth + 'ms';
    consultation_recette.style.animationDuration = consultation_recette.offsetWidth + 'ms';

    // 2: Modifier la propriété CSS "top" des éléments afin de fluidifier l'animation :
    // Enregristre dans la variable decalage le niveau de defilement de le page (nmbr px defini)( la barre reviens a 0 après le defilement)
    let decalage = html.scrollTop;
    html.scrollTop = 0; 
    if (liste_recettes.classList.contains('visible')) {
        liste_recettes.style.top = 0 - decalage + 'px';
        consultation_recette.style.top = 0;
    } else if (consultation_recette.classList.contains('visible')) {
        consultation_recette.style.top = 0 - decalage + 'px';
        liste_recettes.style.top = 0;
    }

    // 3: Échanger de section visible pour créer l'animation :
    consultation_recette.classList.toggle('visible');
    liste_recettes.classList.toggle('visible');
    console.log(`Défilement à l'autre section.`);

    // 4: Activer ou désactiver les boutons en fonction de leur emplacement dans la page :
    verifier_activite_boutons();
}



/**
 * Affiche les options correspondant à un bouton.
 * 
 * @param {string} bouton Le nom du bouton dont il faut afficher les options.
 */
function afficher_options(bouton) {
    // 1: Fermer toutes les options de boutons :
    fermer_options(bouton);

    // 2: Ouvrir les options du bouton choisi :
    document.querySelector(`#${bouton} fieldset`).toggleAttribute('disabled')
    document.getElementById(bouton).classList.toggle('options-visibles');
    console.log(`Affichage des options du bouton "${bouton}".`);
}

/**
 * Ferme les options de tous les boutons, hormis celles du bouton indiqué en argument.
 * @param {string} exception Le nom du bouton dont on ne doit pas fermer les options (facultatif).
 */
function fermer_options(exception) {
    // 1: Regrouper dans la liste "fieldsets" tous les fieldsets descendant d'un bouton dont les options sont visibles et dont l'id n'est pas "exception" :
    let fieldsets = document.querySelectorAll(`:not(#${exception}).options-visibles fieldset`);

    // 2: Parcourir les éléments de la liste "fieldsets" dans la variable "fieldset" :
    for (let fieldset of fieldsets) {
        // 3: Retirer l'attribut "disabled" du fieldset parcouru :
        fieldset.toggleAttribute('disabled')
    }

    // 4: Regrouper dans la liste "boutons" tous les boutons dont les options sont visibles et dont l'id n'est pas "exception" :
    let boutons = document.querySelectorAll(`:not(#${exception}).options-visibles`);

    // 5: Parcourir les éléments de la liste "boutons" dans la variable "bouton" :
    for (let bouton of boutons) {
        // 6: Retirer la classe "options-visibles" du bouton parcouru :
        bouton.classList.toggle('options-visibles');
    }
    console.log(`Fermeture des options.`);
}

/**
 * Active ou désactive les boutons en fonction de s'il sont visible sur la page ou pas.
 */
function verifier_activite_boutons() {
    // 1: Activer ou désactiver les boutons de la section "liste-recettes" pour empêcher le focus sur les éléments non visibles :
    boutons_liste = document.querySelectorAll('#liste-recettes button');
    for (let bouton of boutons_liste) {
        if (liste_recettes.classList.contains('visible')) {
            bouton.toggleAttribute('disabled', false);
        } else {
            bouton.toggleAttribute('disabled', true);
        }
    }

    // 2: Activer ou désactiver les boutons de la section "consultation-recette" pour empêcher le focus sur les éléments non visibles :
    boutons_recettes = document.querySelectorAll('#consultation-recette button');
    for (let bouton of boutons_recettes) {
        if (consultation_recette.classList.contains('visible')) {
            bouton.toggleAttribute('disabled', false);
        } else {
            bouton.toggleAttribute('disabled', true);
        }
    }
    console.log(`Verification de l'activité des boutons.`);
}



/**
 * Sauvegarde le tableau "recettes" encodé en JSON dans le "localStorage".
 */
function sauvegarder_recettes() {
    localStorage.setItem('recettes', JSON.stringify(recettes));
    console.log(`Sauvegarde des recettes.`);
}



/**
 * Retire les accents d'une chaîne de caractères.
 * 
 * @param {string} a Chaîne de caractère à traiter.
 * @returns Chaîne de caractère traitée.
 */
function strNoAccent(a) {
    var b="áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ",
        c="aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY",
        d="";
    for(var i = 0, j = a.length; i < j; i++) {
      var e = a.substring(i, i + 1);
      d += (b.indexOf(e) !== -1) ? c.substring(b.indexOf(e), b.indexOf(e) + 1) : e;
    }
    return d;
  }



// Lancer les fonctions nécessaires au fonctionnement du site :
afficher_liste_recettes();