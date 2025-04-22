import { trapFocus, getFocusableElements } from "./common.js";
gsap.registerPlugin(ScrollTrigger);

layout();
section();
canvas();
gallery();


//////////////////////////////////////////////////
////////// Lenis
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
    lenis.raf(time * 500)
})

gsap.ticker.lagSmoothing(0)


//////////////////////////////////////////////////
////////// Section
function section() {
    /// Common scroll animation
    gsap.utils.toArray(".sec").forEach((sec, i) => {
        const scrollAnimElements = sec.querySelectorAll(".scroll-anim");
    
        const tl = gsap.timeline({ paused: true });
    
        scrollAnimElements.forEach((element) => {
            tl.from(element, {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
            });
        });
    
        ScrollTrigger.create({
            trigger: sec,
            start: "top center",
            end: "bottom top",
            //markers: true,
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
        });
    });


    ///// Hero
    gsap.from(".hero__title", {opacity: 0, y: 30, duration: 1, delay: 1})


    ///// About
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about",
            scrub: 1,
            start: "0% 0%",
            end: "600%",
            pin: true,
            //markers: true,
        }
    });

    function animateTextBox(i) {
        return gsap.timeline()
            .to(`.about__text-box:nth-child(${i})`, { opacity: 1, "pointer-events" : "unset"})
            .from(`.about__text-box:nth-child(${i}) .about__title span`, { opacity: 0, y: 20, stagger: 0.1 }, "<")
            .from(`.about__text-box:nth-child(${i}) .about__desc, .about__text-box:nth-child(${i}) .about__button-wrap`, { opacity: 0, y: 20 }, "<")
            .to(`.about__text-box:nth-child(${i}) .about__title span`, { "--active-line": "100%", stagger: 0.5 }, "<")
            .to(`.about__text-box:nth-child(${i})`, { opacity: 0 });
    }

    aboutTl
    .to({}, { delay: 0.2 }) // 초기 지연
    .to(".about__cta", { opacity: 1 })
    .add(animateTextBox(1))
    .call(() => gsap.to(".about__cta", { opacity: 0 }))
    .add(animateTextBox(2))
    .to({}, { duration: 1 }); // 종료 지연


    ///// Viewfinder
    gsap.timeline({
        scrollTrigger: {
            trigger: ".viewfinder",
            start:"top bottom",
            end:"top 30%",
            scrub:2,
            //markers: true,
        }
    })
    .to(".viewfinder", {"clip-path":"inset(0% round 0px)",ease:"none"})

    // rotate
    gsap.to(".viewfinder__rotate-list", {rotate: 360, ease: Linear.easeNone,
        scrollTrigger: {
            trigger: ".viewfinder",
            start:"-50% top",
            end:"bottom top",
            scrub: 0.5,
            //markers: true,
        }
    })

    gsap.utils.toArray(".viewfinder__rotate-title span").forEach(item => {
        gsap.fromTo(item, {yPercent: 20},{
            yPercent: 0,
            ease: "none",
            duration: 0.5,
            scrollTrigger: {
                trigger: item,
                start: "top bottom", 
                end: "bottom bottom",
                scrub: 0.5,
                //markers: true,
            },  
        });
    });


    /// Scene
    ScrollTrigger.create({
        trigger: ".scene",
        scrub: 1,
        start: "0% 0%",
        end: "600%",
        pin: true,
        //markers: true,
    })
    
    gsap.timeline({
        scrollTrigger: {
            trigger: ".scene",
            start:"top bottom",
            end:"top 30%",
            scrub:2,
            //markers: true,
        }
    })
    .to(".scene__canvas", {"clip-path":"inset(0% round 0px)",ease:"none"})

    
    ///// Camp
    gsap.from(".camp__title span span", {yPercent:80,
        scrollTrigger: {
            trigger: ".camp__title",
            start:"top bottom",
            end:"bottom+=30% bottom",
            scrub:1,
            // markers: true,
            refreshPriority: -1,
        }
    })
}

//////////////////////////////////////////////////
////////// Canvas
function canvas() {
    function setCanvas(id, triggerClass, frameCount, imagePath) {
        const canvas = document.querySelector(id);
        const ctx = canvas.getContext("2d");
        
        const currentFrame = (idx) => `${imagePath}/${idx.toString().padStart(3, '0')}.webp`;
        
        const images = [];
        const card = { frame: 0 };
        
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i + 1);
            images.push(img);
        }
        
        gsap.to(card, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: triggerClass,
                scrub: 1,
                start: "0% 0%",
                end: "600%",
            },
            onUpdate: render,
        });
        
        images[0].onload = render;
        
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(images[card.frame], 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        }

        return canvas;
    }

    function resizeCanvas(canvases) {
        const aspectRatio = 16 / 9;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const largerSide = width / height > aspectRatio ? { w: width, h: width / aspectRatio } : { w: height * aspectRatio, h: height };
        
        canvases.forEach(canvas => {
            canvas.width = largerSide.w;
            canvas.height = largerSide.h;
            canvas.style.width = `${canvas.width}px`;
            canvas.style.height = `${canvas.height}px`;
        });
    }

    const canvasAbout = setCanvas("#canvasAbout", ".about", 384, "./assets/images/sequences/about");
    const canvasScene = setCanvas("#canvasScene", ".scene", 193, "./assets/images/sequences/scene");

    function onResize() {
        resizeCanvas([canvasAbout, canvasScene]);
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    onResize();
}

//////////////////////////////////////////////////
////////// Layout
function layout() {
    // Heder Scroll
    let lastScrollY = window.scrollY;
    const header = document.querySelector(".header__outer");

    window.addEventListener("scroll", function () {
        if (window.scrollY > lastScrollY) {
            gsap.to(header, { yPercent: -100, opacity: 0 });
        } else {
            gsap.to(header, { yPercent: 0, opacity: 1 });
        }
        lastScrollY = window.scrollY;
    });

    ScrollTrigger.create({
        trigger: ".has-hide",
        start: "top top",
        //markers: true,
        onEnter: () => {
            gsap.to(header, {autoAlpha: 0, duration: 1})
        },
        onLeaveBack: () => {
            gsap.to(header, {autoAlpha: 1, duration: 1})
        }
    });


    // Header Menu
    const body = document.body;
    const menu = document.querySelector(".menu");
    const menuTrigger = document.querySelector(".menu-trigger");
    const menuCloseButton = document.querySelector(".menu-close");
    const focusableEls = getFocusableElements(menu);

    // Header menu open animation
    const mm = gsap.matchMedia();
    let menuTl; // 전역 변수 선언

    mm.add({
        isDesktop: "(min-width: 1025px)",
        isMobile: "(max-width:1024px)"
    }, (context) => {
        let { isDesktop } = context.conditions;
        
        menuTl = gsap.timeline({ paused: true }); // 전역 변수에 할당
        
        menuTl
        .to(menu, { autoAlpha: 1, duration: 0.2 })
        .to(".menu__overlay", { autoAlpha: 1, duration: 0.5 })
        .to(".menu__inner", { autoAlpha: 1, duration: 0.1 })
        .to(".menu__inner", { height: isDesktop ? "auto" : "100svh", duration: 0.5 })
        .from(".menu__logo", { scale: "0.9", duration: 0.5 }, "<");
    });


    // Header menu click event
    // Open
    menuTrigger.addEventListener("click", function () {
        lenis.stop();
        body.classList.add("scroll-lock");
        menuTl.play();
        menuTrigger.setAttribute("aria-expanded", "true");

        document.addEventListener("keydown", function (event) {
            trapFocus(event, focusableEls);
        });
    });

    // Close
    function closeMenu() {
        lenis.start();
        body.classList.remove("scroll-lock");
        menuTl.reverse();
        menuTrigger.setAttribute("aria-expanded", "false");

        document.removeEventListener("keydown", function (event) {
            trapFocus(event, focusableEls);
        });
    }

    menuCloseButton.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menuTrigger.getAttribute("aria-expanded") === "true") {
            closeMenu();
        }
    });


    // Footer
    gsap.fromTo(".footer__bg img",{yPercent: -25},{
        scrollTrigger: {
            trigger: ".footer",
            start: "top bottom",
            end: "10% top",
            scrub: true,
            //markers: true,
        },
        yPercent: 0,
        ease:'none'
    });


    $("a[href='#']").click(function(){
        e.preventDefault();
    });

    // Resize
    let delay = 300;
    let timer = null;

    window.addEventListener("resize", function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            //console.log('resize');
        }, delay);
    });
}

//////////////////////////////////////////////////
////////// Gallery
function gallery() {
    // Thumbs gallery 
    var thumbSwiper = new Swiper('.gallery-thum', {
        spaceBetween: 5,
        freeMode: true, //슬라이드 넘길 때 위치 고정 여부
        watchSlidesProgress: true, //각 슬라이드의 진행과 visibility를 계산함
        navigation: {
            nextEl: ".gallery-thum .swiper-button-next",
            prevEl: ".gallery-thum .swiper-button-prev"
        },
        breakpoints: {
            768: {
                slidesPerView: 5.5,
            },
            480: {
                slidesPerView: 2.5,
            }
        }
    });

    // Modal gallery
    var mainSwiper = new Swiper('.gallery-modal__swiper', {
        spaceBetween: 10,
        slidesPerView: 1,
        navigation: {
            nextEl: ".gallery-modal .swiper-button-next",
            prevEl: ".gallery-modal .swiper-button-prev"
        },
        thumbs: {
            swiper: thumbSwiper,
        },
    });

    // Modal
    const thumbnailGallery = document.querySelectorAll(".gallery-thum .swiper-slide");
    const modal = document.querySelector(".gallery-modal");
    const modalSwiper = document.querySelector(".gallery-modal__swiper").swiper;
    const closeModalBtn = document.querySelector(".gallery-modal__close");
    const focusableEls = getFocusableElements(modal);

    //// 모달 열기
    // 모든 슬라이드에 tabindex="0" 추가
    thumbnailGallery.forEach((item, index) => {
        item.setAttribute("tabindex", "0");

        // 클릭 시 모달 열기
        item.addEventListener("click", function () {
            openModal(index);
        });

        // Enter, Space 키로 모달 열기
        item.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal(index);
            }
        });
    });

    function openModal(index) {
        lenis.stop();
        document.body.classList.add("scroll-lock");
        modal.classList.add("open");
        modalSwiper.slideTo(index); // 모달 갤러리의 동일한 이미지로 이동
        closeModalBtn.focus(); // 모달이 열리면 닫기 버튼에 포커스 이동
        document.addEventListener("keydown", function(event) {
            trapFocus(event, focusableEls);
        });
    }

    //// 모달 닫기
    // 클릭 시 모달 닫기
    closeModalBtn.addEventListener("click", function () {
        closeModal();
    });

    // 모달 외부 클릭 시 닫기
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });

    function closeModal() {
        lenis.start();
        document.body.classList.remove("scroll-lock");
        modal.classList.remove("open");
        document.removeEventListener("keydown", function(event) {
            trapFocus(event, focusableEls);
        });
        thumbnailGallery[modalSwiper.activeIndex].focus(); // 모달이 닫히면 active된 동일 이미지로 포커스 이동
    }
}