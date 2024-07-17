var slideIndex = 1;
var timer;
var slides = document.querySelector('.slides');
var slideCount = slides.children.length / 2;

function showSlides(n) {
    clearTimeout(timer);

    if (n > slideCount) { 
        slideIndex = 1;
        slides.style.transition = 'none';
        slides.style.transform = 'translateX(0)';
        setTimeout(() => {
            slides.style.transition = 'transform 0.5s ease';
            showSlides(slideIndex);
        }, 20);
    } else if (n < 1) { 
        slideIndex = slideCount;
        slides.style.transition = 'none';
        slides.style.transform = `translateX(-${100 * (slideCount - 1)}%)`;
        setTimeout(() => {
            slides.style.transition = 'transform 0.5s ease';
            showSlides(slideIndex);
        }, 20);
    } else {
        slides.style.transform = `translateX(-${100 * (slideIndex - 1)}%)`;
    }

    var dots = document.getElementsByClassName("dot");
    for (var i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[(slideIndex - 1) % slideCount].className += " active";

    timer = setTimeout(() => plusSlides(1), 10000); // Change image every 10 seconds
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

showSlides(slideIndex);