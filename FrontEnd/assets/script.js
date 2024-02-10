(async () => {
  const reponseWorks = await fetch("http://localhost:5678/api/works");
  const works = await reponseWorks.json();
  genererGallery(works);

  const reponseCategory = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategory.json();
  genererTri(categories, works);

})
  ();



// Générer les images de la galerie
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

//Creation de la barre de tri

function genererTri(categories, works) {
  const sectionPortfolio = document.getElementById("portfolio");
  const sectionGallery = document.querySelector(".gallery");
  const divBar = document.createElement("div");
  divBar.className = "divTri";
  const btnTous = document.createElement("button");
  btnTous.innerHTML = "Tous";
  divBar.appendChild(btnTous);
  btnTous.classList.add("tri");

  for (let i = 0; i < categories.length; i++) {
    const tabTri = categories[i];
    const btnTri = document.createElement("button");
    btnTri.innerHTML = tabTri.name;
    sectionPortfolio.appendChild(divBar);
    divBar.appendChild(btnTri);
    btnTri.className = "tri";

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
  sectionPortfolio.insertBefore(divBar, sectionGallery);
}




