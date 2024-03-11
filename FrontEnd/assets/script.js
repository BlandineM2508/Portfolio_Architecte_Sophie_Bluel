


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

    //Gestion de la galerie de la HomePage
    const gallery = works[i];
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const captionElement = document.createElement("figcaption");

    imageElement.src = gallery.imageUrl;
    captionElement.innerHTML = gallery.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
    sectionGallery.appendChild(figureElement);

    //Gestion de la galerie de la Modale 

    
    const modaleWrapperGallery = document.querySelector('.modaleWrapperGallery');
    const div_imgModale = document.createElement("div");
    div_imgModale.className = "div_imgModale";
    const imgModale = document.createElement("img");
    imgModale.className = "imgModale";
    imgModale.src = gallery.imageUrl;
    
    
    //Creation de l'icone poubelle
    const imgTrash = document.createElement("img");
    imgTrash.src = "./assets/icons/trash.svg";
    imgTrash.className = "imgTrash";
    div_imgModale.appendChild(imgModale);
    div_imgModale.appendChild(imgTrash);
    modaleWrapperGallery.appendChild(div_imgModale);
    div_imgModale.appendChild(imgModale);

    imgTrash.addEventListener("click", (event) => {
      console.log(gallery.id);
      const imageID = gallery.id;

      fetch("http://localhost:5678/api/works/" + imageID, {
        method: "DELETE",
        headers: {
          authorization: `bearer ${window.localStorage.getItem("token")}`
        }
      })
        .then((res) => {
          if (res.status === 204) {
            console.log("Suppression de l'image id :" + gallery.id);

            const imageGalerie = document.querySelector(".gallery");
            if (imageGalerie) {
              figureElement.remove();
            }

            const imageParent = event.target.parentElement;
            if (imageParent) {
              imageParent.remove();
            }
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression :", error);
        });
    });

    
  }




  

  //Gestion de l'ajout de projet dans la Modale

  const form_container = document.querySelector(".form_container");

  const modaleWrapperBtnAjout = document.querySelector(".modaleWrapperBtn");
  
  modaleWrapperBtnAjout.addEventListener("click", () => {
    const imgPhoto = document.querySelector("imgPhoto");
     
    const modaleWrapperGallery = document.querySelector(".modaleWrapperGallery");
    modaleWrapperGallery.style.display = "none";
    modaleWrapper = document.querySelector(".modaleWrapper");
  
  
    const form_container = document.querySelector(".form_container");
    form_container.style.display = "flex";
    const modaleWrapperTitle = document.querySelector(".modaleWrapperTitle");
    modaleWrapperTitle.style.display = "none";
    const form_Title = document.querySelector(".form_Title");
    form_Title.style.display = "flex";
    const arrow_back = document.querySelector(".arrow_back");
    const rectangle = document.querySelector(".rectangle");
    const TextRectangle = document.createElement("p");
    const BtnValider = document.querySelector(".BtnValider");
    TextRectangle.className = "TextRectangle";
    rectangle.appendChild(TextRectangle);
    TextRectangle.innerHTML = "jpg, png : 4mo max"; 

    form_container.style.display = "flex";
    form_container.className = "form_container";
    arrow_back.style.display = "flex";
    modaleWrapperBtnAjout.style.display = "none";
    BtnValider.style.display = "flex";
    

  
  

  
     

    arrow_back.addEventListener("click", () => {
      modaleWrapperTitle.style.display = "flex";
      modaleWrapperGallery.style.display = "flex";
      modaleWrapperBtnAjout.style.display = "flex";
      form_container.style.display = "none";
      TextRectangle.style.display = "none";
      arrow_back.style.display = "none";
    });


  });
}


function handleFileSelect(input) {
  const filePreview = document.querySelector(".file-preview");

  // Réinitialiser le contenu du conteneur de prévisualisation des fichiers
  filePreview.innerHTML = '';


  const file = input.files;
  const reader = new FileReader();

  // Lorsque le fichier est lu, créer une balise d'image pour l'afficher
  reader.onload = function (event) {
    const imgElement = document.createElement("img");
    imgElement.src = event.target.result;
    filePreview.appendChild(imgElement);
  }

  // Lire le contenu du fichier comme une URL de données
  reader.readAsDataURL(file);
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


  //Generation des catégories dans le formulaire de la modale
  const select = document.getElementById("categorie");
   
  categories.forEach(category => {
    const option_cat = document.createElement("option");
    option_cat.innerText = category.name;
    select.appendChild(option_cat);
    console.log(category.name);
  })
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
















