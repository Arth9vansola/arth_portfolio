'use strict';

// Element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// Sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// Sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// PAGE NAVIGATION FUNCTIONALITY
// =============================

const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Add click event to all nav links
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    
    // Get the nav link's data-nav-link value
    const target = this.getAttribute("data-nav-link");
    
    // Remove active class from all nav links
    for (let j = 0; j < navLinks.length; j++) {
      navLinks[j].classList.remove("active");
    }
    
    // Add active class to clicked nav link
    this.classList.add("active");
    
    // Remove active class from all pages
    for (let k = 0; k < pages.length; k++) {
      pages[k].classList.remove("active");
    }
    
    // Add active class to the matching page
    document.querySelector(`[data-page="${target}"]`).classList.add("active");
  });
}