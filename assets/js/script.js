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
    // Hero
    //const heroTl = gsap.timeline({repeat: -1, repeatDelay: 5});
    gsap
    .from(".hero__title", {opacity:0, y:30, duration:1})


    // About
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


    // for(let i = 1; i < 3; i++) {
    //     if (i === 1) {
    //         aboutTl
    //             .to({},{delay:0.2})
    //             .to(".about__cta",{ opacity: 1})
    //             .to(".about__cta", {opacity: 0})
    //     } else {
    //         aboutTl
    //         .to(".about__cta", {opacity: 0})
    //     }
    //     aboutTl
    //     .to(`.about__text-box:nth-child(${i})`, {autoAlpha: 1})
    //     .from(`.about__text-box:nth-child(${i}) .about__title span`, {opacity:0, y:10, stagger: 0.1}, "<")
    //     .from(`.about__text-box:nth-child(${i}) .about__desc`,{opacity:0, y:10}, "<")
    //     .from(`.about__text-box:nth-child(${i}) .about__button-wrap`, {opacity:0, y:10}, "<")
    //     .to(`.about__text-box:nth-child(${i}) .about__title span`, {"--active-line": "100%", stagger: 0.5}, "<")
    //     .to(`.about__text-box:nth-child(${i})`, {autoAlpha: 0})
    //     .to({},{duration:2})
    // }


    // Viewfinder
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

    
    // Scene
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

    
    // Camp
    gsap.from(".camp__title span span", {yPercent:80,
        scrollTrigger: {
            trigger: ".camp__title",
            start:"-=30% top",
            end:"bottom bottom",
            scrub:1,
            //markers: true,
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
                pin: true,
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
    // 브라우저 현재 화면 사이즈 (검색창 미포함 / 스크롤바 미포함)
    //window.inner* 는 스크롤바를 포함해서 1920으로 됨 > X가 overflow
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    canvas2.width = document.body.clientWidth;
    canvas2.height = document.body.clientHeight;

    canvasAbout(); 
    canvasScene();
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas, false);
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

    
    // Heder Menu
    const menuTl = gsap.timeline({paused: true});

    menuTl
    .to(".menu",{autoAlpha:1, duration: 0.2})
    .to(".menu__overlay",{autoAlpha:1, duration: 0.5})
    .to(".menu__inner",{autoAlpha:1, duration: 0.1})
    .to(".menu__inner",{height:"auto", duration: 0.5})
    .from(".menu__logo",{scale:"0.9", duration: 0.5}, "<")


    $(".menu-trigger").click(function(){
        menuTl.play()
    });

    $(".menu-close").click(function(){
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
    })
}