(() => {
  "use strict";

  /* =====================
   * Helpers
   ===================== */

  const select = (el, all = false) => {
    el = el.trim();
    return all
      ? [...document.querySelectorAll(el)]
      : document.querySelector(el);
  };

  const on = (type, el, handler, all = false) => {
    const elements = select(el, all);
    if (!elements) return;

    if (all) {
      elements.forEach((e) => e.addEventListener(type, handler));
    } else {
      elements.addEventListener(type, handler);
    }
  };

  const onScroll = (el, handler) => el.addEventListener("scroll", handler);

  /* =====================
   * Navbar active on scroll
   ===================== */

  const navbarLinks = select("#navbar .scrollto", true);

  const updateNavbarActive = () => {
    const position = window.scrollY + 200;

    navbarLinks.forEach((link) => {
      if (!link.hash) return;

      const section = select(link.hash);
      if (!section) return;

      link.classList.toggle(
        "active",
        position >= section.offsetTop &&
          position <= section.offsetTop + section.offsetHeight,
      );
    });
  };

  window.addEventListener("load", updateNavbarActive);
  onScroll(document, updateNavbarActive);

  /* =====================
   * Smooth scroll
   ===================== */

  on(
    "click",
    ".scrollto",
    function (e) {
      if (!this.hash) return;

      const target = select(this.hash);
      if (!target) return;

      e.preventDefault();

      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    },
    true,
  );

  /* =====================
   * Typed.js (SAFE)
   ===================== */

  try {
    const typedEl = select(".typed");

    if (typedEl && typedEl.dataset.typedItems && typeof Typed !== "undefined") {
      const strings = typedEl.dataset.typedItems.split(",");

      new Typed(".typed", {
        strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
      });
    }
  } catch (err) {
    console.warn("Typed.js falhou:", err);
  }

  /* =====================
   * Isotope (SAFE)
   ===================== */

  window.addEventListener("load", () => {
    try {
      const container = select(".portfolio-container");

      if (!container || typeof Isotope === "undefined") return;

      const isotope = new Isotope(container, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();

          select("#portfolio-flters li", true).forEach((el) =>
            el.classList.remove("filter-active"),
          );

          this.classList.add("filter-active");

          isotope.arrange({
            filter: this.dataset.filter,
          });

          isotope.on("arrangeComplete", () => {
            if (window.AOS) AOS.refresh();
          });
        },
        true,
      );
    } catch (err) {
      console.warn("Isotope falhou:", err);
    }
  });

  /* =====================
   * Lightbox
   ===================== */

  if (typeof GLightbox !== "undefined") {
    GLightbox({
      selector: ".portfolio-lightbox",
    });
  }

  /* =====================
   * Swiper
   ===================== */

  if (typeof Swiper !== "undefined") {
    new Swiper(".portfolio-details-slider", {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  /* =====================
   * PureCounter
   ===================== */

  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }

  /* =====================
   * Back to Top
   ===================== */

  const backToTop = select(".back-to-top");

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle("active", window.scrollY > 300);
    };

    window.addEventListener("load", toggleBackToTop);
    onScroll(document, toggleBackToTop);
  }

  /* =====================
   * MOBILE MENU (FIX PRINCIPAL)
   ===================== */

  const mobileNavToggle = select(".mobile-nav-toggle");

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-active");

      this.classList.toggle("bi-list");
      this.classList.toggle("bi-x");
    });
  }

  on(
    "click",
    "#navbar .scrollto",
    function () {
      if (document.body.classList.contains("mobile-nav-active")) {
        document.body.classList.remove("mobile-nav-active");

        const toggle = select(".mobile-nav-toggle");

        if (toggle) {
          toggle.classList.add("bi-list");
          toggle.classList.remove("bi-x");
        }
      }
    },
    true,
  );
})();
