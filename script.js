// Smooth scrolling for menu links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href.startsWith("#")) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// Welcome message
window.onload = function () {
    console.log("Welcome to Zafaa Foods!");
};