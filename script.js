const products = {
  clasica: {
    name: "Mini chocotorta clásica",
    description: "Pequeña porción de chocotorta presentada en un práctico vasito individual. Elaborada con capas de galletitas de chocolate y una deliciosa mezcla de dulce de leche y queso crema.",
    price: "$2.500",
    ingredients: ["Galletitas Chocolinas", "Dulce de leche", "Queso crema", "Leche"],
    images: ["assets/mini-chocotorta-clasica.jpg", "assets/clasica-detalle.jpg"],
    alt: "Mini chocotorta clásica"
  },
  crema: {
    name: "Mini chocotorta con crema",
    description: "La misma combinación de galletitas de chocolate, dulce de leche y queso crema, con crema por encima para una presentación todavía más especial.",
    price: "$3.000",
    ingredients: ["Galletitas Chocolinas", "Dulce de leche", "Queso crema", "Leche", "Crema"],
    images: ["assets/mini-chocotorta-crema.jpg", "assets/crema-detalle.jpg"],
    alt: "Mini chocotorta con crema"
  }
};

const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalIngredients = document.getElementById("modalIngredients");
const modalPrice = document.getElementById("modalPrice");
const modalOrder = document.getElementById("modalOrder");
const galleryCount = document.getElementById("galleryCount");
const galleryDots = document.getElementById("galleryDots");
let activeProduct = null;
let activeSlide = 0;
let lastFocusedElement = null;

function renderSlide() {
  if (!activeProduct) return;
  const product = products[activeProduct];
  modalImage.src = product.images[activeSlide];
  modalImage.alt = product.alt;
  galleryCount.textContent = `${activeSlide + 1} / ${product.images.length}`;
  [...galleryDots.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === activeSlide);
    dot.setAttribute("aria-label", `Ver fotografía ${index + 1}`);
  });
}

function openProduct(key) {
  const product = products[key];
  if (!product) return;
  activeProduct = key;
  activeSlide = 0;
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price;
  modalIngredients.replaceChildren();
  product.ingredients.forEach(item => {
    const tag = document.createElement("span");
    tag.textContent = item;
    modalIngredients.appendChild(tag);
  });
  galleryDots.replaceChildren();
  product.images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.addEventListener("click", () => { activeSlide = index; renderSlide(); });
    galleryDots.appendChild(dot);
  });
  const message = encodeURIComponent(`Hola, quisiera consultar por ${product.name} (${product.price}).`);
  modalOrder.href = `https://wa.me/543764130238?text=${message}`;
  renderSlide();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll("[data-product]").forEach(button => {
  button.addEventListener("click", () => openProduct(button.dataset.product));
});
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("galleryPrev").addEventListener("click", () => {
  if (!activeProduct) return;
  activeSlide = (activeSlide - 1 + products[activeProduct].images.length) % products[activeProduct].images.length;
  renderSlide();
});
document.getElementById("galleryNext").addEventListener("click", () => {
  if (!activeProduct) return;
  activeSlide = (activeSlide + 1) % products[activeProduct].images.length;
  renderSlide();
});
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  if (modal.classList.contains("open") && event.key === "ArrowRight") document.getElementById("galleryNext").click();
  if (modal.classList.contains("open") && event.key === "ArrowLeft") document.getElementById("galleryPrev").click();
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
}));
