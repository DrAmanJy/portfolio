const rotateBtn = document.querySelector('.rotate-btn');
const slides = document.querySelectorAll('.bg-slide');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const totalSlides = slides.length;
let index = 0;

menuIcon.onclick = () =>{
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}
rotateBtn.addEventListener('click',() => {
    rotateBtn.classList.add('active');
    setTimeout(() => {
        rotateBtn.classList.remove('active');
    }, 2100)

    slides.forEach(slide =>{
        if(slide.classList.contains('active')){
            slide.classList.add('active');
        }
        else {
            slide.classList.remove('active');
        }
    })
    slides[index].classList.remove('active');

    index++;

    if (index == totalSlides) {
        index = 0;
    }

    slides[index].classList.add('active');
});
