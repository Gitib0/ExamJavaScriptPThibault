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
        <ul class="caracteristiques">
          <li>Résolution: ${produit.caracteristiques.résolution}</li>
          <li>Zoom: ${produit.caracteristiques.zoom}</li>
          <li>Connectivité: ${produit.caracteristiques.connectivité}</li>
          <li>Écran: ${produit.caracteristiques.écran}</li>
        </ul>
        <p>Prix: ${produit.prix}</p>
        <button onclick="ajouterAuPanier('${produit.nom_produit}' , '${produit.prix}')">Ajouter au Panier</button>
      </div>
    `
    )
    .join("");
}
if (document.title === "Liste des Appareils photos banger") {
  chargerProduits();
}

function ajouterAuPanier(nomProduit, prixProduit) {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const produit = panier.find((p) => p.nom === nomProduit);
  console.log(produit);
  if (produit) {
    produit.quantite += 1;
  } else {
    panier.push({ nom: nomProduit, quantite: 1, prix: prixProduit });
  }

  localStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
  alert(nomProduit + " " + prixProduit + " ajouté au panier !");
}

function afficherPanier() {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const listePanier = document.getElementById("liste-panier");

  if (listePanier) {
    listePanier.innerHTML = panier
      .map(
        (item) => `
          <div class="panier-item">
            <p>Produit : ${item.nom} - Quantité: ${item.quantite} - Prix : ${item.prix}</p>
            <button onclick="retirerDuPanier('${item.nom}')">Retirer</button>
          </div>
        `
      )
      .join("");
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
    const recapPanier = panier
      .map((item) => `${item.nom} (Quantité: ${item.quantite})`)
      .join(", ");

    alert(
      `Commande confirmée !\nNuméro de commande : ${numeroCommande}\nNom : ${nom}\nAdresse : ${adresse}\nContact : ${contact}\nProduits : ${recapPanier}`
    );

    document.getElementById("popup-commande").classList.add("hidden");
    localStorage.removeItem("panier");
    afficherPanier();
  });
}
