# 🚗 Scout Motors <br>인터렉티브 사이트 클론 코딩

시퀀스 스크롤 애니메이션을 적용하고, IR 기법과 WAI-ARIA, Skip Menu 등의 기능을 활용하여 웹 접근성을 고려한 반응형 클론 코딩 사이트입니다.

- 제작기간: 2025.03.02 ~ 2025.03.05 + Refactor
- 사용언어: HTML, SCSS, JavaScript
- 라이브러리: jQuery, GSAP(ScrollTrigger), Lenis
- 유형: 반응형
- [사이트 바로가기](https://miraeae.github.io/scoutmotors)

![Image](https://github.com/user-attachments/assets/a1f2f73e-f75e-4c75-a719-414a77064ba4)


## 💡 Point
1. [웹 접근성 향상](#1-웹-접근성-향상)
2. [시퀀스 스크롤 애니메이션](#2-시퀀스-스크롤-애니메이션)
3. [Safari 브라우저 호환성](#3-safari-브라우저-호환성)
4. [카드 회전 애니메이션](#4-카드-회전-애니메이션)

***

### 1. 웹 접근성 향상

웹 접근성을 높이기 위해 IR(Image Replacement) 기법, WAI-ARIA, Skip Menu 등을 적용하였습니다. 이를 통해 키보드 사용자와 보조 기기 사용자도 원활하게 웹사이트를 이용할 수 있도록 하였습니다.

#### 1-1. Skip Menu 적용

키보드 사용자가 ``Tab`` 키를 이용해 사이트를 탐색할 때, 주요 콘텐츠 영역으로 바로 이동할 수 있도록 ```Skip Menu```를 적용하였습니다.

![Image](https://github.com/user-attachments/assets/0cfb5fa1-b4eb-45ea-bdd4-4427f35d0da3)

```
<body>
    <div class="skip-menu">
        <a href="#container" class="box-button box-button--primary">Skip to main content</a>
    </div>
    ···
</body>
```
<br>

#### 1-2. 🛠 중첩된 링크 요소 이슈 해결

제품 리스트 등의 UI에서 버튼을 감싸는 형태의 링크가 존재하여 키보드 포커스 및 스크린리더 사용 시 중복 인식되는 문제가 있었습니다.

![Image](https://github.com/user-attachments/assets/a413ab84-c539-42fd-a6ac-13ae85a5c03c)

이를 해결하기 위해 내부 버튼에 ``aria-hidden="true"`` 및 ``tabindex="-1"`` 속성을 추가하였습니다.

```
<a href="#" aria-hidden="true" tabindex="-1" class="product__item-button box-button box-button--primary">Discover</a>
```
- aria-hidden="true": 요소를 시각적으로 유지하면서 보조 기기가 읽지 않도록 설정
- tabindex="-1": 키보드 포커스에서 제외하여 중복 탐색 방지

<br>

또한, 감싸고 있는 링크에는 ``sr-only`` 클래스를 사용하여 대체 텍스트를 제공하였습니다.

```
<a href="#" class="product__item-link">
    <span class="sr-only">Discover Traveler</span>
</a>
```

<br>

#### 1-3. 🛠 포커스 이탈 해결

메뉴 오픈 후 닫기 전까지 내부에서 포커스가 되어야 하는데 마지막 요소 이후 외부 요소로 포커스가 이동하는 문제가 있었습니다.

![Image](https://github.com/user-attachments/assets/17a03095-0e7e-44cd-8df6-883f0a23c311)

이를 해결하기 위해 trapFocus 함수를 구현하였습니다. 메뉴 오픈 시 trapFocus 함수를 호출하고, 메뉴를 닫으면 제거하도록 했습니다.

```
function trapFocus(event) {
    const firstElement = menuLinks[0];
    const lastElement = menuLinks[menuLinks.length - 1];

    if (event.key === "Tab") {
        if (event.shiftKey) { // 첫 요소에서 Shift + Tab 하면 마지막 요소로 이동
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else { // 마지막 요소 다음 다시 첫 요소로 이동
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}
```

메뉴 닫기는 ESC로도 가능하게 하여 편의성을 높였습니다.

```
document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menu.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });
```
***

### 2. 시퀀스 스크롤 애니메이션

``canvas``와 ``GSAP``를 활용하여 시퀀스 스크롤 애니메이션을 구현했습니다.

![Image](https://github.com/user-attachments/assets/622311a6-c01e-4340-94cd-89fa7e4a223a)

#### 📄 HTML

```
<canvas class="about__canvas" id="canvasAbout"></canvas>
```

#### 💻 JavaScript

canvas 요소를 JavaScript로 가져오고, 이를 이용해 2D 컨텍스트를 가져옵니다.

```
const canvas = document.querySelector("#canvasAbout");
const ctx = canvas.getContext("2d");
```

<br>

이미지 프레임 수, 이미지를 저장할 배열과 프레임을 조정할 객체를 선언합니다.
```
const frameCount = 384;

const images = [];
const card = {
    frame: 0,
};
```

<br>

현재 프레임의 이미지 경로를 반환하는 currentFrame 함수를 만들어줍니다. 숫자 인덱스를 최소 길이가 3자인 문자열로 반환하고 필요한 경우 0으로 채워줍니다. (ex. 001, 002, ...)

```
const currentFrame = (idx) => {
    return `./assets/images/sequences/about/${idx.toString().padStart(3, '0')}.webp`
};
```
<br>

이미지 프레임 수만큼 반복문을 실행하여 Image 객체를 생성하고, src 속성을 설정한 후 배열에 추가합니다.

```
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i + 1);
    images.push(img);
}
```

<br>

GSAP을 사용해 설정을 해줍니다.
```
gsap.to(card, {
    frame: frameCount - 1,
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
```
- frame: frameCount - 1 → GSAP가 card.frame 값을 0에서 마지막 프레임(frameCount - 1)까지 변경하며 애니메이션을 조절합니다.
- onUpdate: render → card.frame 값이 변경될 때마다 render() 함수를 호출하여 해당 프레임의 이미지를 캔버스에 다시 그립니다.

<br>

첫 번째 이미지를 로드한 후에 render() 함수를 호출하여 애니메이션을 실행합니다. render 함수는 캔버스를 초기화한 후, card.frame에 해당하는 이미지를 캔버스에 그리는 역할을 합니다.
```
images[0].onload = render;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[card.frame], 0, 0, canvas.offsetWidth, canvas.offsetHeight);
}
```

<br>

#### 🛠 Viewport 높이 조정 및 Resize 이슈 해결

canvas의 사이즈를 full-size로 지정해 줄 때 아래의 문제가 있었습니다.

- innerWidth: PC에서 스크롤바가 차지하는 영역을 포함하여 가로 overflow → ✅ clientWidth 로 해결
- clientHeight: 모바일 Safari에서 하단 주소창때문에 여백 발생 → ✅ 모바일 Safari와 다른 브라우저의 뷰포트 높이를 다르게 처리

```
function getViewportHeight() {
    // 모바일 Safari 여부 확인
    const isMobileSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && /iPhone|iPad|iPod/.test(navigator.userAgent);
    
    return isMobileSafari ? window.innerHeight : document.documentElement.clientHeight;
}

function resizeCanvas() {
    const width = document.documentElement.clientWidth;
    const height = getViewportHeight();

    canvas.width = width;
    canvas.height = height;

    canvasAbout();
}
```

캔버스 사이즈가 지정되면 브라우저 창의 크기가 바뀌어도 캔버스 사이즈는 그대로 남아있게 되는데 이를 방지하고자 브라우저 크기에 맞춰 캔버스 크기를 지정하는 resize 함수를 생성했습니다.

```
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas); // 모바일 기기에서 화면 회전 시 높이 조정
resizeCanvas();
```

시퀀스 애니메이션과 함께 실행되어야하는 pin, 텍스트 효과는 충돌 방지를 위해 따로 작성을 해주었습니다.

***

### 3. Safari 브라우저 호환성

브라우저에 따라 지원하는 코덱이 다르기 때문에 mp4와 webm 파일을 함께 사용하였습니다.

```
<video loop autoplay muted playsinline>
    <source src="./assets/images/hero-video.webm" type="video/webm">
    <source src="./assets/images/hero-video.mp4" type="video/mp4">
</video>
```
#### 🛠 Safari에서 WebM 투명도 미지원 문제

WebM 파일은 Chrome에서 VP9 코덱을 통해 알파 채널(투명도)을 지원하지만, Safari에서는 지원하지 않고 mp4 영상은 구할 수 없는 상황이라 사파리에서만 대체 이미지를 사용하였습니다.

![Image](https://github.com/user-attachments/assets/e7ce38ef-3dd1-4200-ae93-f569a51f5bde)

```
@supports (-webkit-touch-callout: none) {
    .camp__video {
        display: none;
    }
    .camp__img {
        display: block;
    }
}
```

***

### 4. 카드 회전 애니메이션

![Image](https://github.com/user-attachments/assets/c7fdd464-8783-434f-8215-a2f7eb3fe37a)

#### 📄 HTML

css 함수를 이용하여 인덱스 값을 지정해주었습니다.

```
<ul class="viewfinder__rotate-list">
  <li class="viewfinder__rotate-item" style="--rotate-index:0"></li>
  ···
  <li class="viewfinder__rotate-item" style="--rotate-index:11"></li>
</ul>
```

#### 🎨 CSS

HTML에 작성한 인덱스값을 활용하여 12개의 요소를 30도씩 회전시켜 원형으로 배치하였습니다.

```
.viewfinder{
    ···
    &-item {
        position: absolute;
        top: 0;
        left: 50%;
        width: 9.5vw;
        height: 100%;
        transform: translateX(-50%) rotate(calc(30deg * var(--rotate-index)));
    }
}
```

#### 💻 JavaScript

GSAP를 활용하여 특정 영역에 도달하면 회전되도록 애니메이션을 적용해 주었습니다.

```
gsap.to(".viewfinder__rotate-list", {rotate: 360, ease: Linear.easeNone,
    scrollTrigger: {
        trigger: ".viewfinder",
        start:"-50% top",
        end:"bottom top",
        scrub: 0.5,
        //markers: true,
    }
})
```
