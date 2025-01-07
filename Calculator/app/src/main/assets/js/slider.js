window.onload = function () {
  const slide = document.querySelector(".slide"),
        slideItems = document.querySelectorAll(".slide_item"),
        pagination = document.querySelector(".slide_pagination"),
        dots = document.querySelector(".slide_pagination"),
        maxSlide = slideItems.length;
        
  let slideWidth,
      currSlide;
  
  if (slide) {
    slideWidth = slide.clientWidth;

    currSlide = 0;
    dots.setAttribute("aria-label", `총 ${maxSlide} 페이지 중 1 페이지`);
  }

  const elements = [
    {
      selector: ".aria-txt",
      attributes: { tabindex: 0, role: "text" },
    },
  ];

  elements.forEach(({ selector, attributes }) => {
    document.querySelectorAll(selector).forEach((node) => {
      Object.entries(attributes).forEach(([key, value]) => {
        node.setAttribute(key, value);
      });
    });
  });

  window.addEventListener("resize", () => {
    slideWidth = slide.clientWidth;
  });

  for (let i = 0; i < maxSlide; i++) {
    pagination.innerHTML += `<li${i === 0 ? ' class="active"' : ""}>•</li>`;
  }

  const paginationItems = document.querySelectorAll(".slide_pagination > li");

  const updateSlidePosition = () => {
    slideItems.forEach((item) => {
      const itemStyle = window.getComputedStyle(item),
            marginRight = parseInt(itemStyle.marginRight, 10),
            mainSlide = slideItems[currSlide];

      item.style.left = `-${(slideWidth + marginRight) * currSlide}px`;
      mainSlide.focus();
    });
  };

  const updatePagination = () => {
    paginationItems.forEach((item, index) => {
      item.classList.toggle("active", index === currSlide);
    });
    dots.setAttribute("aria-label", `총 ${maxSlide} 페이지 중 ${currSlide + 1} 페이지`);
  };

  const checkDots = (e) => {
    const index = Array.from(e.parentElement.children).indexOf(e);
    currSlide = index;
    updateSlidePosition();
    updatePagination();
  };

  const checkFocus = (e) => {
    const index = Array.from(slideItems).indexOf(e);
    currSlide = index;
    updateSlidePosition();
    updatePagination();
  };

  paginationItems.forEach((item) => {
    item.addEventListener("click", () => checkDots(item));
  });
  
  slideItems.forEach((item) => {
    item.setAttribute('tabindex', 0);
    item.addEventListener("focus", () => checkFocus(item));
  });
};
