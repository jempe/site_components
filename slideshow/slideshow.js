class JempeSlideshow {
    constructor(elementID, options) {
        this.element = document.getElementById(elementID);
        if (!this.element) {
            console.error(`Element with ID "${elementID}" not found.`);
            return;
        }

        const defaultOptions = {
            slideWidth: "200px",
            slideGap: "20px",
        };

        this.options = { ...defaultOptions, ...options };

        this.init();
    }

    init() {
        this.slidesContainer = this.element.querySelector('.jempe_slideshow');
        this.slides = this.element.querySelectorAll('.jempe_slideshow_item');
        this.currentIndex = 0;
        this.update();
    }

    next() {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
            this.update();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.update();
        }
    }

    goTo(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentIndex = index;
            this.update();
        }
    }

    update() {
        const slideWidth = parseInt(this.options.slideWidth, 10);
        const slideGap = parseInt(this.options.slideGap, 10);
        const scrollAmount = this.currentIndex * (slideWidth + slideGap);
        this.slidesContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}
