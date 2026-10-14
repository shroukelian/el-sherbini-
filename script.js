(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero headline wipe + fade sequence ---------- */
  function runHeroSequence() {
    var wipeLines = document.querySelectorAll("[data-wipe]");
    var sub = document.querySelector(".hero-sub");
    var actions = document.querySelector(".hero-actions");

    if (reduceMotion) {
      wipeLines.forEach(function (el) { el.style.clipPath = "inset(0 0 0 0)"; });
      if (sub) sub.style.opacity = "1";
      if (actions) actions.style.opacity = "1";
      return;
    }

    wipeLines.forEach(function (el, i) {
      setTimeout(function () {
        el.style.transition = "clip-path .9s cubic-bezier(.2,.8,.2,1)";
        el.style.clipPath = "inset(0 0 0 0)";
      }, 200 + i * 260);
    });

    setTimeout(function () {
      [sub, actions].forEach(function (el) {
        if (!el) return;
        el.style.transition = "opacity .7s ease";
        el.style.opacity = "1";
      });
    }, 200 + wipeLines.length * 260 + 150);
  }

  if (document.readyState === "complete") {
    runHeroSequence();
  } else {
    window.addEventListener("load", runHeroSequence);
  }

  /* ---------- Service cards reveal ---------- */
  var serviceItems = document.querySelectorAll(".service-card");
  if ("IntersectionObserver" in window && serviceItems.length && !reduceMotion) {
    var serviceIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var i = Array.prototype.indexOf.call(serviceItems, entry.target);
            entry.target.style.animationDelay = (i % 4) * 0.1 + "s";
            entry.target.classList.add("in-view");
            serviceIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    serviceItems.forEach(function (item) { serviceIo.observe(item); });
  } else {
    serviceItems.forEach(function (item) { item.classList.add("in-view"); });
  }

  /* ---------- Coverage counter ---------- */
  var counter = document.querySelector(".stat-num");
  if (counter) {
    var target = parseInt(counter.getAttribute("data-count"), 10) || 0;
    var animateCounter = function () {
      if (reduceMotion) {
        counter.textContent = target;
        return;
      }
      var current = 0;
      var step = Math.max(1, Math.round(target / 30));
      var timer = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = current;
      }, 40);
    };
    if ("IntersectionObserver" in window) {
      var counterIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter();
              counterIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counterIo.observe(counter);
    } else {
      animateCounter();
    }
  }

  /* ---------- Gallery grid staggered reveal ---------- */
  var galleryGrid = document.querySelector(".gallery-grid");
  if (galleryGrid) {
    var galleryItems = galleryGrid.querySelectorAll(".gallery-item");
    if (!reduceMotion) {
      galleryItems.forEach(function (item) {
        item.style.opacity = "0";
        item.style.transform = "scale(0.94)";
      });
    }
    if ("IntersectionObserver" in window && !reduceMotion) {
      var galleryIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              galleryItems.forEach(function (item, i) {
                setTimeout(function () {
                  item.style.transition = "opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1)";
                  item.style.opacity = "1";
                  item.style.transform = "scale(1)";
                }, i * 70);
              });
              galleryIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      galleryIo.observe(galleryGrid);
    } else {
      galleryItems.forEach(function (item) {
        item.style.opacity = "1";
        item.style.transform = "scale(1)";
      });
    }
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("nav-open");
      navToggle.classList.toggle("is-active", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("nav-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contact form -> WhatsApp ---------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      var name = (data.get("name") || "").trim();
      var phone = (data.get("phone") || "").trim();
      var service = data.get("service") || "";
      var details = (data.get("details") || "").trim();

      var lines = [
        "طلب خدمة جديد من موقع الشربيني:",
        "الاسم: " + name,
        "الجوال: " + phone,
        "نوع الخدمة: " + service
      ];
      if (details) lines.push("التفاصيل: " + details);

      var message = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/966504297267?text=" + message, "_blank");
    });
  }
})();