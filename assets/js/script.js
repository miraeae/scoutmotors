document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    layout();
    section();
    canvas();
});


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
                autoAlpha: 0,
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
            .to(`.about__text-box:nth-child(${i})`, { autoAlpha: 1 })
            .from(`.about__text-box:nth-child(${i}) .about__title span`, { opacity: 0, y: 20, stagger: 0.1 }, "<")
            .from(`.about__text-box:nth-child(${i}) .about__desc, .about__text-box:nth-child(${i}) .about__button-wrap`, { opacity: 0, y: 20 }, "<")
            .to(`.about__text-box:nth-child(${i}) .about__title span`, { "--active-line": "100%", stagger: 0.5 }, "<")
            .to(`.about__text-box:nth-child(${i})`, { autoAlpha: 0 });
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
    const canvas = document.querySelector("#canvasAbout");
    const ctx = canvas.getContext("2d");

    // canvasAbout
    function canvasAbout() {
        const frameCount = 384;

        // 숫자 인덱스를 최소 길이가 3자인 문자열로 반환하고 필요한 경우 0으로 채움
        // toString() - 객체가 가지고 있는 정보나 값들을 문자열로 만들어 리턴하는 메서드
        // padStart() - String 값의 메서드로, 결과 문자열이 주어진 길이에 도달할 때까지 시작 부분에 다른 문자열을 (필요하다면 여러 번) 채우는 메서드
        const currentFrame = (idx) => {
            return `./assets/images/sequences/about/${idx.toString().padStart(3, '0')}.webp`
        };

        const images = [];
        const card = {
            frame: 0,
        };

        // 이미지 프레임 수만큼 반복문을 돌려 빈 images배열에 이미지 객체들을 push
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i + 1);
            images.push(img);
        }

        gsap.to(card, {
            frame: frameCount - 1, //마지막 프레임으로 가게 frameCount - 1
            snap: "frame", //스크롤 위치에 따라 애니메이션의 특정 프레임 값에 스냅핑되도록 하는 설정
            ease: "none",
            scrollTrigger: {
                trigger: ".about",
                scrub: 1,
                start: "0% 0%",
                end: "600%",
                //markers: true
            },
            onUpdate: render,
        });


        // 첫 번째 이미지 로드 후 render 함수를 호출
        images[0].onload = render;

        // 이미지를 캔버스에 렌더링해주는 함수
        function render() {
            // 캔버스의 전체 영역을 클리어하여 투명으로 함 > 다음 프레임의 이미지를 그리기 전에 이전 프레임의 이미지를 지우는 역할 > 애니메이션이 부드럽게 보임
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // images[card.frame]: card 객체의 frame 속성에 해당하는 이미지를 가져온다.
            // (0, 0) 위치부터 시작, 뒤의 것은 그려지는 이미지의 너비와 높이
            ctx.drawImage(images[card.frame], 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        }
    }

    const canvas2 = document.querySelector("#canvasScene");
    const ctx2 = canvas2.getContext("2d");

    // canvasScene
    function canvasScene() {
        const frameCount = 193;

        const currentFrame = (idx) => {
            return `./assets/images/sequences/scene/${idx.toString().padStart(3, '0')}.webp`
        };

        const images = [];
        const card = {
            frame: 0,
        };

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
                trigger: ".scene",
                scrub: 1,
                start: "0% 0%",
                end: "600%",
                //pin: true,
                //markers: true
            },
            onUpdate: render,
        });

        images[0].onload = render;

        function render() {
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            ctx2.drawImage(images[card.frame], 0, 0, canvas2.offsetWidth, canvas2.offsetHeight);
        }
    }

    // Resize
    function resizeCanvas() {
        const width = document.documentElement.clientWidth;
        const height = window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight; // Safari 대응
    
        canvas.width = width;
        canvas.height = height;
    
        canvas2.width = width;
        canvas2.height = height;
    
        canvasAbout();
        canvasScene();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}


//////////////////////////////////////////////////
////////// Layout
function layout() {
    // Heder 
    let lastScrollY = window.scrollY;
    const header = document.querySelector(".header__outer");

    $(window).scroll(function() {
        if (window.scrollY > lastScrollY) {
            gsap.to(header, {yPercent: -100, opacity: 0})
        } else {
            gsap.to(header, {yPercent: 0, opacity: 1})
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

    // Heder Menu
    const mm = gsap.matchMedia();
    let menuTl; // 전역 범위에서 선언

    mm.add({
        isDesktop: `(min-width: 1025px)`,
        isMobile: `(max-width:1024px)`
    }, (context) => {
        // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
        let { isDesktop } = context.conditions;
        
        menuTl = gsap.timeline({ paused: true }); // 전역 변수에 할당
 
        menuTl
        .to(".menu", { autoAlpha: 1, duration: 0.2 })
        .to(".menu__overlay", { autoAlpha: 1, duration: 0.5 })
        .to(".menu__inner", { autoAlpha: 1, duration: 0.1 })
        .to(".menu__inner", { height: isDesktop ? "auto" : "100svh", duration: 0.5 })
        .from(".menu__logo", { scale: "0.9", duration: 0.5 }, "<");
    }
    );

    $(".menu-trigger").click(function(){
        lenis.stop();
        $("body").addClass("scroll-lock");
        menuTl.play()
    });

    $(".menu-close").click(function(){
        lenis.start();
        $("body").removeClass("scroll-lock");
        menuTl.reverse()
    });


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

    // 리사이즈 끝나고 0.3초마다 리셋
    let delay = 300;
    let timer = null;

    window.addEventListener("resize", function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            //console.log('resize');
        }, delay);
    });
}