// About page: Q&A tabs and accordion

document.addEventListener("DOMContentLoaded", function () {
  const qaContainer = document.querySelector(".QA-content");
  const menu = document.querySelector(".QA-menu");
  const groups = document.querySelectorAll(".QA-group");

  // Tab switching (All / Qualifications / Experience)
  if (menu) {
    menu.addEventListener("click", function (event) {
      const selectedItem = event.target.closest("li");
      if (!selectedItem) return;

      // Update active state on menu
      menu
        .querySelectorAll("li")
        .forEach((item) => item.classList.remove("active"));
      selectedItem.classList.add("active");

      const filter = selectedItem.dataset.filter;

      // Show/hide groups based on data-category
      groups.forEach((group) => {
        if (filter === "all" || group.dataset.category === filter) {
          group.style.display = ""; // default
        } else {
          group.style.display = "none";
        }
      });
    });
  }

  // Accordion behaviour (inside visible groups)
  if (qaContainer) {
    qaContainer.addEventListener("click", function (event) {
      const groupHeader = event.target.closest(".QA-group-header");
      if (!groupHeader) return;

      const group = groupHeader.parentElement;
      const groupBody = group.querySelector(".QA-group-body");
      const icon = groupHeader.querySelector("i");

      // Toggle this group
      icon.classList.toggle("fa-plus");
      icon.classList.toggle("fa-minus");
      groupBody.classList.toggle("open");

      // Close other open Q&A bodies
      const otherGroups = qaContainer.querySelectorAll(".QA-group");
      otherGroups.forEach((other) => {
        if (other !== group) {
          const otherGroupBody = other.querySelector(".QA-group-body");
          const otherIcon = other.querySelector(".QA-group-header i");
          otherGroupBody.classList.remove("open");
          if (otherIcon) {
            otherIcon.classList.remove("fa-minus");
            otherIcon.classList.add("fa-plus");
          }
        }
      });
    });
  }
});

// Shared navigation: mobile menu toggle

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.querySelector(".hamburger-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (!hamburgerButton || !mobileMenu) return;

  hamburgerButton.setAttribute("aria-expanded", "false");
  hamburgerButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    hamburgerButton.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      hamburgerButton.setAttribute("aria-expanded", "false");
    });
  });
});

// Blog page: filters and newest-first ordering

document.addEventListener("DOMContentLoaded", () => {
  const categoryFilter = document.querySelector("#topic-filter");
  const dateFilters = document.querySelectorAll(".month-filter, .year-filter");
  const postsContainer = document.querySelector(".blog-posts");
  const posts = [...document.querySelectorAll(".blog-post")];
  const noPosts = document.querySelector(".no-posts");
  const postCount = document.querySelector(".post-count");
  if (
    !categoryFilter ||
    !dateFilters.length ||
    !postsContainer ||
    !posts.length
  ) {
    return;
  }

  let selectedCategory = "all";
  let selectedDate = { month: "all", year: null };

  posts.sort((firstPost, secondPost) => {
    const firstDate = new Date(firstPost.querySelector("time").dateTime);
    const secondDate = new Date(secondPost.querySelector("time").dateTime);
    return secondDate - firstDate;
  });

  posts.forEach((post) => postsContainer.append(post));

  // Apply both filters while keeping the posts in date order.
  const renderPosts = () => {
    let visiblePosts = 0;

    posts.forEach((post) => {
      const matchesCategory =
        selectedCategory === "all" ||
        post.dataset.category === selectedCategory;
      const matchesDate = selectedDate.year
        ? post.dataset.year === selectedDate.year
        : selectedDate.month === "all" ||
          post.dataset.month === selectedDate.month;
      const isVisible = matchesCategory && matchesDate;

      post.hidden = !isVisible;
      if (isVisible) visiblePosts += 1;
    });

    if (noPosts) noPosts.hidden = visiblePosts > 0;
    if (postCount) {
      postCount.textContent = `${visiblePosts} ${visiblePosts === 1 ? "post" : "posts"}`;
    }
  };

  categoryFilter.addEventListener("change", () => {
    selectedCategory = categoryFilter.value;
    renderPosts();
  });

  dateFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      selectedDate = {
        month: filterButton.dataset.month || null,
        year: filterButton.dataset.year || null,
      };
      dateFilters.forEach((button) => button.classList.remove("active"));
      filterButton.classList.add("active");
      renderPosts();
    });
  });

  renderPosts();
});

// Home page: testimonial modal

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".testimonial-card");
  const modal = document.getElementById("testimonial-modal");
  const quote = document.getElementById("testimonial-modal-quote");
  const author = document.getElementById("testimonial-modal-author");
  const closeButton = modal?.querySelector(".testimonial-modal-close");
  let activeCard;

  if (!cards.length || !modal || !quote || !author || !closeButton) return;

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("testimonial-modal-open");
    activeCard?.focus();
    activeCard = null;
  };

  const openModal = (card) => {
    const cardQuote = card.querySelector("blockquote");
    const cardAuthor = card.querySelector(".author");
    if (!cardQuote || !cardAuthor) return;

    quote.textContent = card.dataset.modalQuote || cardQuote.textContent.trim();
    author.textContent = cardAuthor.textContent.trim();
    activeCard = card;
    modal.hidden = false;
    document.body.classList.add("testimonial-modal-open");
    closeButton.focus();
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-testimonial]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
});

// Contact page: EmailJS form and send cooldown

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const sendButton = document.getElementById("send-button");
  const status = document.getElementById("form-status");
  const cooldownKey = "contact-form-cooldown";
  const cooldownDuration = 60 * 1000;
  let cooldownTimer;

  const setStatus = (message, type = "") => {
    status.textContent = message;
    status.className = `form-status ${type}`.trim();
  };

  const updateCooldown = () => {
    const remaining = Number(sessionStorage.getItem(cooldownKey)) - Date.now();
    if (remaining <= 0) {
      sessionStorage.removeItem(cooldownKey);
      sendButton.disabled = false;
      clearInterval(cooldownTimer);
      setStatus("You can send another message.");
      return;
    }

    sendButton.disabled = true;
    setStatus(
      `Message sent. You can send another in ${Math.ceil(remaining / 1000)}s.`,
      "success",
    );
  };

  if (sessionStorage.getItem(cooldownKey)) updateCooldown();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity() || sendButton.disabled) {
      form.reportValidity();
      return;
    }

    sendButton.disabled = true;
    setStatus("Sending message...");

    const formData = new FormData(form);
    const params = Object.fromEntries(formData.entries());

    try {
      await emailjs.send("service_cxlx47k", "template_zmajbsj", params);
      sessionStorage.setItem(cooldownKey, Date.now() + cooldownDuration);
      form.reset();
      updateCooldown();
      cooldownTimer = setInterval(updateCooldown, 1000);
    } catch (error) {
      sendButton.disabled = false;
      setStatus("Something went wrong. Please try again.", "error");
      console.error("EmailJS error:", error);
    }
  });
});
