// Q&A Accordion + Tabs
document.addEventListener("DOMContentLoaded", function() {
    const QAContainer = document.querySelector(".QA-content");
    const menu = document.querySelector(".QA-menu");
    const groups = document.querySelectorAll(".QA-group");

    // Tab switching (All / Qualifications / Experience)
    if (menu) {
        menu.addEventListener("click", function(e) {
            const li = e.target.closest("li");
            if (!li) return;

            // Update active state on menu
            menu.querySelectorAll("li").forEach(item => item.classList.remove("active"));
            li.classList.add("active");

            const filter = li.dataset.filter;

            // Show/hide groups based on data-category
            groups.forEach(group => {
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
        QAContainer.addEventListener("click", function(e) {
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
            otherGroups.forEach(other => {
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

    hamburgerButton.addEventListener("click", () => mobileMenu.classList.toggle("active"));
});

// Contact Form Email Sending

function sendMail() {
    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };

    emailjs.send('service_cxlx47k', 'template_zmajbsj', params)
        .then(function(response) {
            alert('Email Sent!');
            // Optionally clear the form
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('message').value = '';
        }, function(error) {
            alert('Failed to send email. Check console for details.');
            console.error('EmailJS error:', error);
        });
}
