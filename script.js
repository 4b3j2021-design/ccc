const navigationToggle = document.querySelector("[data-nav-toggle]");
const navigation = document.querySelector("#main-navigation");

if (navigationToggle && navigation) {
  const setNavigationOpen = (isOpen) => {
    navigationToggle.setAttribute("aria-expanded", String(isOpen));
    navigation.hidden = !isOpen;
  };

  navigationToggle.addEventListener("click", () => {
    setNavigationOpen(navigationToggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setNavigationOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigationToggle.getAttribute("aria-expanded") === "true") {
      setNavigationOpen(false);
      navigationToggle.focus();
    }
  });
}

document.querySelectorAll("[data-artwork-gallery]").forEach((gallery) => {
  const categoryButtons = Array.from(gallery.querySelectorAll("[data-category]"));
  const panels = Array.from(gallery.querySelectorAll("[data-category-panel]"));
  const previousButton = gallery.querySelector("[data-previous]");
  const nextButton = gallery.querySelector("[data-next]");
  const pageStatus = gallery.querySelector("[data-page-status]");

  if (!previousButton || !nextButton || !pageStatus || categoryButtons.length === 0 || panels.length === 0) {
    return;
  }

  let activeCategory = categoryButtons[0].dataset.category;
  let currentPage = 0;

  const activePanel = () => panels.find((panel) => panel.dataset.categoryPanel === activeCategory);

  const showPage = (page) => {
    const panel = activePanel();
    if (!panel) return;

    const slides = Array.from(panel.querySelectorAll(".gallery-slide"));
    currentPage = Math.max(0, Math.min(page, slides.length - 1));
    slides.forEach((slide, index) => {
      slide.hidden = index !== currentPage;
    });

    previousButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === slides.length - 1;
    pageStatus.textContent = `第 ${currentPage + 1} 頁，共 ${slides.length} 頁`;
  };

  const selectCategory = (category) => {
    if (!panels.some((panel) => panel.dataset.categoryPanel === category)) return;

    activeCategory = category;
    currentPage = 0;
    categoryButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.category === category));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.categoryPanel !== category;
    });
    showPage(currentPage);
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => selectCategory(button.dataset.category));
  });
  previousButton.addEventListener("click", () => showPage(currentPage - 1));
  nextButton.addEventListener("click", () => showPage(currentPage + 1));

  selectCategory(activeCategory);
});
