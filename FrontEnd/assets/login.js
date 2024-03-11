

//Formulaire de Login

async function requeteLogin() {
  const formUser = document.querySelector(".formLogin");
  formUser.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    // Création de la requête
    const login = {
      email: event.target.email.value,
      password: event.target.mdp.value
    };
    console.log(login);

    const chargeUtile = JSON.stringify(login);

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: chargeUtile
      });

      if (response.status === 200) {
        // Récupération du token depuis l'API
        const tokenData = await response.json();
        const userToken = tokenData.token;
        // Stockage du token dans le localStorage
        window.localStorage.setItem("token", userToken);
        console.log("Token récupéré avec succès :", userToken);
        window.localStorage.getItem("token");
        RedirectionAdminMode ();
      } else {
        console.error("Échec de la récupération du token");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token :", error);
    }
  });
}

function RedirectionAdminMode (){ 
  document.location.href="../index.html";
}
// Appel de la fonction requeteLogin pour gérer la soumission du formulaire de login
requeteLogin();








