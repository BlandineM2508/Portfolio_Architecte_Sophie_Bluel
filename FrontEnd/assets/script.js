
/* import requeteLogin from "./login.js"; */
//Récupération des données du login

(async () => {
  const reponseWorks = await fetch("http://localhost:5678/api/works");
  const works = await reponseWorks.json();
  genererGallery(works);

  const reponseCategory = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategory.json();
  genererTri(categories, works);

  const body = document.querySelector("body");
  const header = document.querySelector("header");
  
  
  const banniereEdition = document.createElement("div");
  const banniereEditionText = document.createElement("p");
  const banniereEditionIcon = document.createElement("img");
  
  banniereEdition.className = "banniereEdition";
  banniereEditionIcon.className ="banniereEditionIcon";
  
  document.body.appendChild(banniereEdition);
  banniereEdition.appendChild(banniereEditionText);
  body.insertBefore(banniereEdition, header);
  banniereEdition.appendChild(banniereEditionIcon);
  
  banniereEditionText.textContent ="Mode édition";
  banniereEditionText.className = "banniereEditionText";
  banniereEditionIcon.src = "./assets/icons/Vector.svg";
  banniereEditionIcon.alt = "icone de l'édition";
  
  const sectionGallery = document.querySelector(".gallery");
  const sectionPortfolio = document.getElementById("portfolio");
  
  const divModifier = document.createElement("div");
  const sectionPortfolioIcon = document.createElement("img");
  const sectionPortfolioIconText = document.createElement("a");
  
  divModifier.className = "divModifier";
  sectionPortfolioIconText.className = "divModifierText";
  divModifier.appendChild(sectionPortfolioIcon);
  divModifier.appendChild(sectionPortfolioIconText);
  sectionPortfolioIcon.src =  "./assets/icons/Modif.svg";
  sectionPortfolioIconText.innerHTML ="Modifier";
  
  const logout = document.querySelector(".navLink");
  logout.textContent = "logout";
  sectionPortfolioIcon.className = "divModifierImg";
  sectionPortfolio.insertBefore(divModifier, sectionGallery);
  
  const navBar = document.querySelector(".barTri");
  navBar.style.display = "none";

  const btnModifier = document.querySelector(".divModifierText");
  btnModifier.addEventListener("click",() =>{
      AfficherModale ();
  });

/* 
  const divModifierLink = document.createElement("a");
  divModifier.appendChild(divModifierLink);
 */
})
  ();



// Récuperer les images de la galerie via l'Api

function genererGallery(works) {
  const sectionGallery = document.querySelector(".gallery");
  sectionGallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const gallery = works[i];

    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const captionElement = document.createElement("figcaption");

    imageElement.src = gallery.imageUrl;
    captionElement.innerHTML = gallery.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
    sectionGallery.appendChild(figureElement);
  }


}


//Affichage des Works et les trie

function genererTri(categories, works) {
  const sectionPortfolio = document.getElementById("portfolio");
  const sectionGallery = document.querySelector(".gallery");
  const navBar = document.createElement("div");
  navBar.className = "barTri";
  const btnTous = document.createElement("button");
  btnTous.innerHTML = "Tous";
  navBar.appendChild(btnTous);
  btnTous.classList.add("btnTri");

  for (let i = 0; i < categories.length; i++) {
    const tabTri = categories[i];
    const btnTri = document.createElement("button");
    btnTri.innerHTML = tabTri.name;
    sectionPortfolio.appendChild(navBar);
    navBar.appendChild(btnTri);
    btnTri.className = "btnTri";

    btnTri.addEventListener("click", () => {
      const imagesFiltrees = works.filter(function (image) {
        return image.categoryId === tabTri.id;
      });
      genererGallery(imagesFiltrees);
      console.log("Catégorie sélectionnée:", tabTri.id);
      console.log("Images filtrées:", imagesFiltrees);
    });
  }
  btnTous.addEventListener("click", () => {
    genererGallery(works);
    console.log(works);
  });
  sectionPortfolio.insertBefore(navBar, sectionGallery);
}


function AfficherModale () {
  //creation des éléments de la modale à afficher
  const modale = document.createElement("aside");
  const modaleWrapper = document.createElement("div");
  document.body.appendChild(modale);
  modale.appendChild(modaleWrapper);
  modale.className = "modale";
  modaleWrapper.className = "modaleWrapper";

  const modaleWrapperTitle = document.createElement("h2");
  const modaleWrapperBtn = document.createElement("button");
  const modaleWrapperGallery = document.createElement("div");
  modaleWrapper.appendChild(modaleWrapperTitle);
  modaleWrapper.appendChild(modaleWrapperGallery);
  modaleWrapper.appendChild(modaleWrapperBtn);
  modaleWrapperTitle.className = "modaleWrapperTitle";
  modaleWrapperGallery.className = "modaleWrapperGallery";
  modaleWrapperBtn.className = "modaleWrapperBtn";
 
  modaleWrapperTitle.innerHTML =  "Galerie photo";

  modaleWrapperBtn.innerHTML = "Ajouter une photo";

}




//Ajout des elements de la page Admin dans le Html
/* if (requeteLogin() === true) {



}  */



