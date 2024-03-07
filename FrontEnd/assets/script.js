


(async () => {
  const reponseWorks = await fetch("http://localhost:5678/api/works");
  const works = await reponseWorks.json();
  genererGallery(works);

  const reponseCategory = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategory.json();
  genererTri(categories, works);

  const token = window.localStorage.getItem("token");
  tokenTrouve(token);


})
  ();





function tokenTrouve(token) {

  if (token === null) {
    const marginHeader = document.querySelector(".marginHeader");
    marginHeader.style.margin = "50px";
    console.log("Aucun token trouvé dans le localStorage");
  } else {
    console.log("Token présent :", token);

    AfficherPageAdmin();
  }
}



// Récuperer les images de la galerie via l'Api

function genererGallery(works) {
  const sectionGallery = document.querySelector(".gallery");
  sectionGallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {

    //homePage
    const gallery = works[i];

    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const captionElement = document.createElement("figcaption");

    imageElement.src = gallery.imageUrl;
    captionElement.innerHTML = gallery.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
    sectionGallery.appendChild(figureElement);


    //gallery 

    const modaleWrapperGallery = document.querySelector('.modaleWrapperGallery');

    const imgModale = document.createElement("img");
    imgModale.className = "modalImg";
    imgModale.src = gallery.imageUrl;

    modaleWrapperGallery.appendChild(imgModale);
    const imgTrash = document.createElement("img");
    imgTrash.src = "./assets/icons/trash.svg";
    imgTrash.className = "imgTrash";
    imgModale.appendChild(imgTrash);

    imgModale.dataset.id = gallery.id 

    imgModale,addEventListener("click", () => {
      console.log(gallery.id);

      fetch("http://localhost:5678/api/works") + gallery.id , {
        method: "Delete",
        headers: {
          authorization: `bearer ${window.localStorage.getItem("token")}`
        } 
      }
    }).then((res) => {
      if (res.status === 204){
        works.find()
        genererGallery(works)
        console.log(works)
      }
    });  
  }

  const form_container = document.querySelector(".form_container");
  form_container.style.display = "none";
  const modaleWrapperBtnAjout = document.querySelector(".modaleWrapperBtn");

  modaleWrapperBtnAjout.addEventListener("click", () => {
    const modaleWrapperTitle = document.querySelector(".modaleWrapperTitle");
    modaleWrapperTitle.innerHTML = "Ajout photo";
    const modaleWrapperGallery = document.querySelector(".modaleWrapperGallery");
    modaleWrapperGallery.style.display = "none";
    modaleWrapper = document.querySelector(".modaleWrapper");

    const rectangle = document.createElement("div");
    modaleWrapperTitle.after(rectangle);
    rectangle.className = "rectangle";

    const imgPhoto = document.createElement("img");
    imgPhoto.src = "./assets/icons/photo.svg";
    imgPhoto.className = "imgPhoto";
    rectangle.appendChild(imgPhoto);
    modaleWrapperBtnAjout.style.display = "none";
    
    const BtnAjoutPhoto = document.createElement("button");
    BtnAjoutPhoto.className = "BtnAjoutPhoto";
    rectangle.appendChild(BtnAjoutPhoto);
    BtnAjoutPhoto.innerHTML = "+ Ajouter photo";

    const TextRectangle = document.createElement("p");
    TextRectangle.className = "TextRectangle";
    rectangle.appendChild(TextRectangle);
    TextRectangle.innerHTML = "jpg, png : 4mo max";


    form_container.style.display ="flex";
    form_container.className = "form_container";
    modaleWrapper.appendChild(form_container);

    const form_titre = document.createElement("div");
    form_titre.className = "form_style";
    form_container.appendChild(form_titre);
    form_titre.innerHTML = `
    <label for="titre">Titre</label>
    <input type="text" id="titre" name="titre">
  `;

    const form_categorie = document.createElement("div");
    form_categorie.classList.add("form_style");
    form_container.appendChild(form_categorie);
    form_categorie.innerHTML = `
    <label for="categorie">Catégorie</label>
    <input type="text" id="categorie" name="categorie">
  `;

    const arrow_back = document.createElement("img");
    arrow_back.src = "./assets/icons/arrow_back.svg";
    arrow_back.className = "arrow_back";
    modaleWrapper.appendChild(arrow_back);

    const BtnValider = document.createElement("button");
    BtnValider.className = "BtnValider";
    modaleWrapper.appendChild(BtnValider);
    BtnValider.innerHTML = "Valider";

    arrow_back.addEventListener("click", () => {
      modaleWrapperGallery.style.display = "flex";
      modaleWrapperBtnAjout.style.display = "flex";
      form_container.style.display = "none";
      TextRectangle.style.display = "none";
      imgPhoto.style.display = "none";
      BtnAjoutPhoto.style.display = "none";
      BtnValider.style.display = "none";
      rectangle.style.display = "none";
    });
    

  });
}



//Affichage des Works et le tri

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




 function AfficherModale() {



  const modale = document.querySelector('.modale')
  modale.style.display = "flex"

  const btnCross = document.querySelector('.cross')
  btnCross.addEventListener("click", () => {
    modale.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    const modale = document.querySelector('.modale');
    if (event.target === modale) {
      modale.style.display = "none";
    }
  });

}


const btnLogin = document.querySelector(".navLink");
btnLogin.addEventListener("click", () => {
  document.location.href = "./assets/login.html";
});



function AfficherPageAdmin() {

  const body = document.querySelector("body");
  const header = document.querySelector("header");


  const banniereEdition = document.createElement("div");
  const banniereEditionText = document.createElement("p");
  const banniereEditionIcon = document.createElement("img");

  banniereEdition.className = "banniereEdition";
  banniereEditionIcon.className = "banniereEditionIcon";

  document.body.appendChild(banniereEdition);
  banniereEdition.appendChild(banniereEditionText);
  body.insertBefore(banniereEdition, header);
  banniereEdition.appendChild(banniereEditionIcon);

  banniereEditionText.textContent = "Mode édition";
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
  sectionPortfolioIcon.src = "./assets/icons/Modif.svg";
  sectionPortfolioIconText.innerHTML = "Modifier";

  const logout = document.querySelector(".navLink");
  logout.textContent = "logout";

  sectionPortfolioIcon.className = "divModifierImg";
  sectionPortfolio.insertBefore(divModifier, sectionGallery);



  logout.addEventListener("click", () => {
    document.location.href = "index.html";
    window.localStorage.removeItem("token");

    console.log("Token supprimé");
  });

  const navBar = document.querySelector(".barTri");
  navBar.style.display = "none";


  const btnModifier = document.querySelector(".divModifierText");
  btnModifier.addEventListener("click", () => {
    AfficherModale();
  });
}
















 