// Initialisation des variables
let works = [];
let cat = [];

// Fonction chargées au chargement de la page
loadData();
loadCat();

// Récupération du token dans le storage
const token = window.localStorage.getItem("token");

//Ajout des projets dans la modale
const modaleWrapperBtn = document.querySelector(".modaleWrapperBtn");
modaleWrapperBtn.addEventListener("click", AjoutProjet);

// Ajouter un gestionnaire d'événement pour le soumission du formulaire
const BtnValider = document.querySelector(".BtnValider");
BtnValider.addEventListener("click", FormSubmission);


// Charge les données des images via l'API
function loadData() {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      works = data;
      genererGallery(works);
    })
    .catch((error) => console.error("Erreur lors du chargement des works :", error));
}

// Charge les catégorie via l'API
function loadCat() {
  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      cat = data;
      genererTri(cat, works);
      tokenTrouve(token);
    })
    .catch((error) => console.error("Erreur lors du chargement des catégories :", error));
}

// Gestion du token pour acceder à la page admin
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

}

// Ajoute les projets à la galerie
function AjoutProjet() {
  const modaleWrapperGallery = document.querySelector(".modaleWrapperGallery");
  modaleWrapperGallery.style.display = "none";
  const modaleWrapperBtn = document.querySelector(".modaleWrapperBtn");
  const form_container = document.querySelector(".form_container");
  form_container.style.display = "flex";
  const modaleWrapperTitle = document.querySelector(".modaleWrapperTitle");
  modaleWrapperTitle.style.display = "none";
  const form_Title = document.querySelector(".form_Title");
  form_Title.style.display = "flex";
  const arrow_back = document.querySelector(".arrow_back");
  const BtnValider = document.querySelector(".BtnValider");
  const BtnAjoutPhoto = document.querySelector(".BtnAjoutPhoto");

  arrow_back.addEventListener("click", () => {
    modaleWrapperTitle.style.display = "flex";
    modaleWrapperGallery.style.display = "flex";
    modaleWrapperBtn.style.display = "flex";
    form_container.style.display = "none";
    arrow_back.style.display = "none";
  });

  form_container.style.display = "flex";
  form_container.className = "form_container";
  arrow_back.style.display = "flex";
  modaleWrapperBtn.style.display = "none";
  BtnValider.style.display = "flex";

  BtnAjoutPhoto.addEventListener("click", () => {
    input.click();
  });

}

// Gestion de l'input et le changement des images à ajouter
const input = document.querySelector(".input_file");
input.addEventListener("change", (e) => {
  const filePreview = document.querySelector(".file_preview");
  input.style.display = "none";

  // Effacer le contenu précédent de la prévisualisation
  filePreview.innerHTML = "";
  console.log("contenu effacé");
  console.log(e.target.files[0])

  // Sélectionner tous les champs du formulaire
  const titleInput = document.getElementById("titre");
  const categoryInput = document.getElementById("categorie");
  const imageInput = document.querySelector(".input_file");

  // Ajouter un gestionnaire d'événement de saisie pour vérifier si tous les champs sont remplis
  function validateForm() {
    // Vérifier si tous les champs sont remplis
    const allFieldsFilled = titleInput.value.trim() !== "" &&
      categoryInput.value !== "" &&
      imageInput.files.length > 0;

    // Modifier la couleur du bouton en conséquence
    if (allFieldsFilled) {
      BtnValider.classList.add("BtnValider_vert"); // Couleur verte
    } else {
      BtnValider.classList.remove("BtnValider_vert"); // Réinitialiser la couleur du bouton
    }
  }


  titleInput.addEventListener("input", validateForm);
  categoryInput.addEventListener("input", validateForm);
  imageInput.addEventListener("change", validateForm);

  const file = input.files[0];
  // Vérifier si un fichier est sélectionné
  if (isPngOrJpg(file)) {
    const reader = new FileReader();
    
    reader.onload = function (event) {
      // Créer une balise d'image pour afficher la prévisualisation
      const imgElement = document.createElement("img");
      imgElement.className = "preview";
      imgElement.src = event.target.result;
      filePreview.appendChild(imgElement);
      const errorMessage = document.querySelector(".error-message");
      const imgPhoto = document.querySelector(".imgPhoto");
      const upload_file = document.querySelector(".upload_file");
      const BtnAjoutPhoto = document.querySelector(".BtnAjoutPhoto");
      const TextImgType = document.querySelector(".TextImgType");
      imgPhoto.style.display = "none";
      upload_file.style.display = "none";
      BtnAjoutPhoto.style.display = "none";
      TextImgType.style.display = "none";
      filePreview.style.display = "flex";
      console.log('L\'image est au format PNG ou JPG');
      errorMessage.textContent = "";

    };

    reader.readAsDataURL(file);

  } else {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = "Choisissez un type d'image valide";
    console.log('L\'image n\'est pas au format PNG ou JPG');
    return;

    
  }

});

// Vérifie que les images soient au bon format
function isPngOrJpg(file) {
  // Vérifier si le fichier est une image
  if (file.type.startsWith('image/')) {
    // Vérifier si le type de l'image est PNG ou JPG
    return file.type === 'image/png' || file.type === 'image/jpeg';
  }
  return false; // Si ce n'est pas une image
}

// Gestion de l'ajout d'une image à la galerie 
function FormSubmission(event) {


  // Empêcher le comportement par défaut du formulaire qui recharge la page
  event.preventDefault();

  const filePreview = document.querySelector(".file_preview");

  const titleInput = document.getElementById("titre");
  const categoryInput = document.getElementById("categorie");
  const imageInput = document.querySelector(".input_file");
  const BtnValider = document.querySelector(".BtnValider");

  const title = titleInput.value;
  const categoryId = categoryInput.value;
  const image = imageInput.files[0];


  const errorMessage = document.querySelector(".error-message");
  const imgPhoto = document.querySelector(".imgPhoto");
  const BtnAjoutPhoto = document.querySelector(".BtnAjoutPhoto");
  const TextImgType = document.querySelector(".TextImgType");


  const modaleWrapperGallery = document.querySelector(".modaleWrapperGallery");
  filePreview.style.display = "flex";

  if (!title || !categoryId || !image) {
    errorMessage.textContent = "Veuillez remplir tous les champs";
    return;
  }

  if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
    errorMessage.textContent = "Choisissez une catégorie valide";
    return;
  }
  errorMessage.textContent = "";


  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", categoryId);


  try {
    // Envoyer une requête POST au serveur avec les données
    fetch('http://localhost:5678/api/works', {
      method: "POST",
      body: formData,
      headers: {
        authorization: `bearer ${window.localStorage.getItem("token")}`

      },
    }).then((response) => {
      if (response.status === 201) {
        console.log("Données envoyées avec succès");
        loadData();
        imageInput.value = "";
        titleInput.value = "";
        categoryInput.value = "";
        BtnValider.classList.add("BtnValider");
        BtnValider.classList.remove("BtnValider_vert");
        modaleWrapperGallery.innerHTML = "";
        filePreview.innerHTML = "";
        imgPhoto.style.display = "flex";
        input.style.display = "flex";
        BtnAjoutPhoto.style.display = "flex";
        TextImgType.style.display = "flex";
      } else {
        console.error("Échec de l'envoi des données");
      }
    })

    // Vérifier si la requête a réussi
  } catch (error) {
    console.error("Erreur lors de l'envoi des données :', error");
  }



}

// Affichage des Works et le tri
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
    option_cat.value = category.id
    select.appendChild(option_cat);
    console.log(category.name);
  })
}

// Affichage de la modale
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

// Gestion du bouton login
const btnLogin = document.querySelector(".navLink");
btnLogin.addEventListener("click", () => {
  document.location.href = "./assets/login.html";
});

// Affichage de la page de l'administrateur de la page
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
