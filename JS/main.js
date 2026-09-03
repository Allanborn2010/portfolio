// Q&A Accordion + Tabs
document.addEventListener("DOMContentLoaded", function () {
  const QAContainer = document.querySelector(".QA-content");
  const menu = document.querySelector(".QA-menu");
  const groups = document.querySelectorAll(".QA-group");

  // Tab switching (All / Qualifications / Experience)
  if (menu) {
    menu.addEventListener("click", function (e) {
      const li = e.target.closest("li");
      if (!li) return;

      // Update active state on menu
      menu
        .querySelectorAll("li")
        .forEach((item) => item.classList.remove("active"));
      li.classList.add("active");

      const filter = li.dataset.filter;

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
  if (QAContainer) {
    QAContainer.addEventListener("click", function (e) {
      const groupHeader = e.target.closest(".QA-group-header");
      if (!groupHeader) return;

      const group = groupHeader.parentElement;
      const groupBody = group.querySelector(".QA-group-body");
      const icon = groupHeader.querySelector("i");

      // Toggle this group
      icon.classList.toggle("fa-plus");
      icon.classList.toggle("fa-minus");
      groupBody.classList.toggle("open");

      // Close other open Q&A bodies
      const otherGroups = QAContainer.querySelectorAll(".QA-group");
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

// Mobile Menu Toggle

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

// Contact Form Email Sending

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
