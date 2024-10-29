async function chargerProduits() {
  try {
    const response = await fetch("produits.json");
    const produits = await response.json();
    afficherProduits(produits);
  } catch (error) {
    console.error("Erreur lors du chargement des produits :", error);
  }
}

function afficherProduits(produits) {
  const listeProduits = document.getElementById("liste-produits");
  listeProduits.innerHTML = produits
    .map(
      (produit) => `
      <div class="produit">
        <img src="${produit.image}" alt="${produit.nom_produit}">
        <h2>${produit.nom_produit}</h2>
        <p>${produit.descriptif}</p>
        <div class="en-savoir-plus">
         <button class="details-btn">+</button>
         <span>de détails</span>
         </div>
        <div class="details">
        <ul class="caracteristiques">
          <li>Résolution: ${produit.caracteristiques.résolution}</li>
          <li>Zoom: ${produit.caracteristiques.zoom}</li>
          <li>Connectivité: ${produit.caracteristiques.connectivité}</li>
          <li>Écran: ${produit.caracteristiques.écran}</li>
        </ul>
        </div>
        <p>Prix: ${produit.prix}</p>
        <button onclick="ajouterAuPanier('${produit.nom_produit}' , '${produit.prix}' , '${produit.image}')">Ajouter au Panier</button>
      </div>
    `
    )
    .join("");
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const details = button.parentElement.nextElementSibling;
      details.style.display =
        details.style.display === "none" || details.style.display === ""
          ? "block"
          : "none";
    });
  });
}
if (document.title === "Liste des Appareils photos banger") {
  chargerProduits();
}

function ajouterAuPanier(nomProduit, prixProduit, produitImage) {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const produit = panier.find((p) => p.nom === nomProduit);
  if (produit) {
    produit.quantite += 1;
  } else {
    panier.push({
      nom: nomProduit,
      quantite: 1,
      prix: prixProduit,
      image: produitImage,
    });
  }

  localStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
  alert(nomProduit + " " + prixProduit + " ajouté au panier !");
}

function afficherPanier() {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const listePanier = document.getElementById("liste-panier");
  let total = 0;

  if (listePanier) {
    listePanier.innerHTML = panier
      .map((item) => {
        const prixTrim = parseFloat(
          item.prix.trim().replace("€", "").replace(" ", "")
        );
        const montantArticle = prixTrim * item.quantite;
        total += montantArticle;

        return `
            <div class="panier-item">
            <img src="${item.image}" alt="${item.nom}">
            <div class="panier-info">
              <p>Produit : ${item.nom}</p>
               <p>Quantité: ${item.quantite}</p>
                <p>Prix : ${item.prix} </p>
              </div>
              <button onclick="retirerDuPanier('${item.nom}')">Retirer</button>
            </div>
          `;
      })
      .join("");

    listePanier.innerHTML += `<h3>Total du Panier : ${total.toFixed(2)} €</h3>`;
  }
}

if (document.title === "Panier") {
  afficherPanier();
}

function retirerDuPanier(nomProduit) {
  let panier = JSON.parse(localStorage.getItem("panier")) || [];
  panier = panier.filter((item) => item.nom !== nomProduit);

  localStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
}

if (document.title === "Panier") {
  document.getElementById("valider-commande").addEventListener("click", () => {
    document.getElementById("popup-commande").classList.remove("hidden");
  });

  document.getElementById("fermer-popup").addEventListener("click", () => {
    document.getElementById("popup-commande").classList.add("hidden");
  });

  document.getElementById("commande-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const nom = formData.get("nom");
    const adresse = formData.get("adresse");
    const contact = formData.get("contact");
    const numeroCommande = Math.floor(Math.random() * 100000);

    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    let recapPanier = "";
    let total = 0;

    panier.forEach((item) => {
      const prixNettoye = parseFloat(
        item.prix.trim().replace("€", "").replace(" ", "")
      );
      const montantArticle = prixNettoye * item.quantite;
      total += montantArticle;

      recapPanier += `
          Nom : ${item.nom}
          Quantité : ${item.quantite}
          Prix : ${item.prix}
          Montant : ${montantArticle.toFixed(2)} €
          \n`;
    });

    recapPanier += `Total du Panier : ${total.toFixed(2)} €`;

    alert(
      `Commande confirmée !\nNuméro de commande : ${numeroCommande}\nNom : ${nom}\nAdresse : ${adresse}\nContact : ${contact}\nProduits : \n${recapPanier}`
    );

    document.getElementById("popup-commande").classList.add("hidden");
    localStorage.removeItem("panier");
    afficherPanier();
  });
}
