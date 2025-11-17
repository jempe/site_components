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

		this.styleTag = document.createElement("style");
		document.head.append(this.styleTag);
		this.styleTag.innerHTML = `
        #${this.element.id} .jempe_slideshow_item {
            width : ${this.options.slideWidth};
        }
        #${this.element.id} .jempe_slideshow_slider {
            gap : ${this.options.slideGap};
            transition: transform 0.3s ease-in-out;
        }
        #${this.element.id} .jempe_slideshow {
            overflow-x: hidden;
            overflow-y: hidden;
        }
        `;

		this.init();
	}

	init() {
		this.slidesContainer = this.element.querySelector('.jempe_slideshow');
		this.slider = this.element.querySelector(".jempe_slideshow_slider");
		this.originalSlides = Array.from(
			this.element.querySelectorAll(".jempe_slideshow_item"),
		);
		this.originalSlideCount = this.originalSlides.length;

		// Clone slides for the end
		this.originalSlides.forEach((slide) => {
			this.slider.appendChild(slide.cloneNode(true));
		});

		// Clone slides for the beginning
		this.originalSlides.slice().reverse().forEach((slide) => {
			this.slider.prepend(slide.cloneNode(true));
		});

		this.slides = this.element.querySelectorAll(".jempe_slideshow_item");
		this.currentIndex = this.originalSlideCount;

		// Set initial position without animation
		this.slider.style.transition = "none";
		this.update();

		// Force a reflow to apply the transform instantly, then re-enable transitions
		this.slider.offsetHeight;
		this.slider.style.transition = "transform 0.3s ease-in-out";

		this.isDragging = false;
		this.startX = 0;
		this.startTranslate = 0;

		this.slider.addEventListener(
			"transitionend",
			() => this.handleTransitionEnd(),
		);

		this.slidesContainer.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
		window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
		window.addEventListener('pointerup', () => this.handlePointerUp());
	}

	next() {
		this.currentIndex++;
		this.update();
	}

	prev() {
		this.currentIndex--;
		this.update();
	}

	goTo(index) {
		if (index >= 0 && index < this.originalSlideCount) {
			this.currentIndex = index + this.originalSlideCount;
			this.update();
		}
	}

	handleTransitionEnd() {
		// Check if we are at the end clones
		if (this.currentIndex >= this.originalSlideCount * 2) {
			this.currentIndex = this.originalSlideCount;
			this.slider.style.transition = "none";
			this.update();
			this.slider.offsetHeight; // Force reflow
			this.slider.style.transition = "transform 0.3s ease-in-out";
		}

		// Check if we are at the beginning clones
		if (this.currentIndex < this.originalSlideCount) {
			this.currentIndex = this.originalSlideCount * 2 - 1;
			this.slider.style.transition = "none";
			this.update();
			this.slider.offsetHeight; // Force reflow
			this.slider.style.transition = "transform 0.3s ease-in-out";
		}
	}

	update() {
		const slideWidth = parseInt(this.options.slideWidth, 10);
		const slideGap = parseInt(this.options.slideGap, 10);
		const offset = -this.currentIndex * (slideWidth + slideGap);
		this.slider.style.transform = `translateX(${offset}px)`;
	}

	getCurrentTranslateX() {
		const style = window.getComputedStyle(this.slider);
		const matrix = new DOMMatrix(style.transform);
		return matrix.m41;
	}

	handlePointerDown(e) {
		e.preventDefault();
		this.isDragging = true;
		this.startX = e.pageX;
		this.startTranslate = this.getCurrentTranslateX();
		this.slider.style.transition = 'none';
		this.slider.style.cursor = 'grabbing';
	}

	handlePointerMove(e) {
		if (!this.isDragging) return;
		const currentX = e.pageX;
		const diff = currentX - this.startX;
		const newTranslate = this.startTranslate + diff;
		this.slider.style.transform = `translateX(${newTranslate}px)`;
	}

	handlePointerUp() {
		if (!this.isDragging) return;
		this.isDragging = false;

		const slideWidth = parseInt(this.options.slideWidth, 10);
		const slideGap = parseInt(this.options.slideGap, 10);
		const itemWidth = slideWidth + slideGap;

		const currentTranslate = this.getCurrentTranslateX();
		this.currentIndex = Math.round(-currentTranslate / itemWidth);

		this.slider.style.transition = 'transform 0.3s ease-in-out';
		this.slider.style.cursor = 'grab';
		this.update();
	}
}
