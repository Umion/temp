class Carousel {
  /**
   *
   * @param {String} sliderID the ID to query on the page
   * @param {String} sliderClass the className of the slider inner
   * @param {String} slideClass the className of the slider slides
   * @returns
   */
  constructor(
    sliderID,
    sliderClass = "carousel-slider",
    slideClass = "slide",
    centerID = "carousel-center"
  ) {
    // Grab the elements
    this.elem = document.getElementById(sliderID);
    if (this.elem == null) return Carousel.InvalidSliderStructure(sliderID);

    this.slider = this.elem.querySelector(`.${sliderClass}`);
    if (this.slider == null) return Carousel.InvalidSliderStructure(sliderID);

    this.slides = this.slider.querySelectorAll(`.${slideClass}`);
    if (!this.slides.length) return Carousel.InvalidSliderStructure(sliderID);

    this.center = document.getElementById(centerID);
    if (this.center == null) return Carousel.InvalidSliderStructure(sliderID);

    this.center.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    // this.slider.style.transition = "transform 0.3s ease";

    // Initialize properties
    this.activeSlide = null;
    this.startSlide = null;
    this.startX = null;
    this.dragStartX = null;
    this.moved = false;
    this.dragStarted = false;
    this.centerClick = false;
    this.activeHoldStarted = false;
    this.onChange = (activeSlide) => {};
    this.onActiveClick = () => {};
    this.onActiveHoldStart = () => {};
    this.onActiveHoldEnd = () => {};

    // Add event listeners
    this.elem.addEventListener("mousedown", (e) => {
      this.onDragStart(e);
    });
    this.elem.addEventListener("touchstart", (e) => {
      this.onDragStart(e);
    });
    this.elem.addEventListener("mouseleave", () => {
      if (this.moved) {
        this.onDragEnd();
      }
    });
    this.elem.addEventListener("mouseup", () => {
      if (this.activeHoldStarted) {
        this.endHoldTimer();
      } else if (this.moved) {
        this.onDragEnd();
      } else {
        // this.activeSlide = null;
        this.dragStarted = false;
        this.elem.classList.remove("active");
        this.slider.style.transition = "transform 0.3s ease";

        this.cancelHoldTimer();

        if (this.centerClick) {
          this.onActiveClick && this.onActiveClick();
        }
        this.centerClick = false;
      }
    });
    this.elem.addEventListener("touchend", () => {
      if (this.activeHoldStarted) {
        this.endHoldTimer();
      } else if (this.moved) {
        this.onDragEnd();
      } else {
        // this.activeSlide = null;
        this.dragStarted = false;
        this.elem.classList.remove("active");
        this.slider.style.transition = "transform 0.3s ease";

        this.cancelHoldTimer();

        // if (this.centerClick) {
        //   this.onActiveClick && this.onActiveClick();
        // }
        this.centerClick = false;
      }
    });
    this.elem.addEventListener("mousemove", (e) => {
      if (this.dragStarted && !this.activeHoldStarted) {
        this.onMove(e);
      }
    });
    this.elem.addEventListener("touchmove", (e) => {
      if (this.dragStarted && !this.activeHoldStarted) {
        this.onMove(e);
      }
    });
    window.addEventListener("resize", () => {
      this.moveToActiveSlide();
    });

    // add event listener to all slides to track clicks
    this.slides.forEach((slide, index) => {
      slide.addEventListener("mouseup", (e) => {
        if (!this.moved) {
          this.elem.classList.remove("active");
          this.setActiveSlide(index);
          this.moveToActiveSlide();
          this.moved = false;
          this.dragStarted = false;
          this.centerClick = false;
        }
      });
    });

    // Set the active slide and classes
    this.setActiveSlide(0);
    this.moveToActiveSlide();
  }

  /**
   * Logs a warning for an invalid slider structure (empty or missing elements)
   *
   * @param {String} sliderID
   */
  static InvalidSliderStructure = (sliderID) => {
    console.warn(
      `The DraggableSlider with ID ${sliderID} will not work as it has some missing elements.`
    );
  };

  /**
   * Get the index of the slide which is closest to the center of the slider
   *
   * @returns {Number} the index of the slide
   */
  getActiveSlide = () => {
    let res = 0;
    for (let i = 1; i < this.slides.length; i++)
      if (
        Math.abs(this.getSlideOffset(i)) < Math.abs(this.getSlideOffset(i - 1))
      )
        res = i;
    return res;
  };

  /**
   * Get the absolute horizontal offset of a slide from the slider's center point
   *
   * @param {Number} slide the index of the slide
   * @returns {Number} the absolute of the offset in pixels
   */
  getSlideOffset = (slide) => {
    let sliderRect = this.elem.getBoundingClientRect();
    let slideRect = this.slides[slide].getBoundingClientRect();
    return (
      slideRect.left +
      slideRect.width / 2 -
      (sliderRect.left + sliderRect.width / 2)
    );
  };

  /**
   * Get the left CSS property value of the slider's inner
   * @returns {Number}
   */
  getInnerLeft = () => {
    let res = parseInt(this.slider.style.transform.split("(")[1]);
    if (isNaN(res) || res == null) return 0;
    return res;
  };

  /**
   * Initialize the active state of the slider
   *
   * @param {Event} e
   */
  onDragStart = (e) => {
    console.log("drag start");
    const centerClick = e.target.id === "carousel-center";

    this.slider.style.transition = "";

    if (centerClick) {
      this.centerClick = true;
    }

    this.elem.classList.add("active");
    this.moved = false;
    this.startX = e.pageX || e.touches[0].pageX;
    this.dragStartX = e.pageX || e.touches[0].pageX;
    this.startSlide = this.activeSlide;
    this.dragStarted = true;

    this.startHoldTimer();
  };

  /**
   * Remove the active state of the slider
   */
  onDragEnd = () => {
    console.log("drag end");
    this.elem.classList.remove("active");
    this.slider.style.transition = "transform 0.3s ease";

    this.cancelHoldTimer();

    this.moveToActiveSlide();
    this.moved = false;
    this.dragStarted = false;
    this.dragStartX = null;
    this.centerClick = false;
  };

  /**
   * Get the touch / mouse move distance and move the slider inner
   *
   * @param {Event} e
   */
  onMove = (e) => {
    let pos = e.pageX || e.touches?.[0].pageX;

    // console.log("on move");
    // console.log("start of drag:", this.startX);
    // console.log("new position:", e.pageX);
    // console.log("new position (touch):", e.touches?.[0].pageX);
    // console.log("pos:", pos);

    const movedDistance = pos - this.dragStartX;
    const moved = movedDistance >= 1 || movedDistance <= -1;

    if (moved) {
      this.moved = true;
      if (this.holdTimer) {
        this.cancelHoldTimer();
      }
    }

    if (!this.elem.classList.contains("active")) return;

    e.preventDefault();

    let dist = pos - this.startX;

    this.startX = pos;
    // this.slider.style.left = this.getInnerLeft() + dist + "px";
    this.slider.style.transform = `translate(${this.getInnerLeft() + dist}px)`;
    this.setActiveSlide(this.getActiveSlide());
    this.centerClick = false;
  };

  /**
   * Move the slider to the active slide
   */
  moveToActiveSlide = () => {
    if (this.activeSlide == null) this.activeSlide = 0;
    this.moveToSlide(this.activeSlide);
  };

  /**
   * Move the slider to a specified slide, to the last one if the number is greater than the
   * amount of slides or to the first one if the number is inferior to zero.
   *
   * @param {Number} slide the index of the slide
   */
  moveToSlide = (slide) => {
    this.slider.style.transform = `translate(${
      this.getInnerLeft() - this.getSlideOffset(this.activeSlide) + "px"
    })`;

    setTimeout(() => {
      this.onChange && this.onChange(this.activeSlide);
    }, 100);
  };

  /**
   * Set a slide as active and update the active class
   *
   * @param {Number} slide the slide to set as active
   */
  setActiveSlide = (slide) => {
    // Edge cases
    if (slide < 0) slide = 0;
    if (slide > this.slides.length - 1) slide = this.slides.length - 1;

    this.activeSlide = slide;
    for (let i = 0; i < this.slides.length; i++) {
      if (i == this.activeSlide) this.slides[i].classList.add("active");
      else this.slides[i].classList.remove("active");
    }
  };

  startHoldTimer = () => {
    console.log("startHoldTimer");
    this.holdTimer = setTimeout(() => {
      console.log("this.moved", this.moved);
      if (!this.moved) {
        this.onActiveHoldStart && this.onActiveHoldStart();
        this.activeHoldStarted = true;
      }
      this.activeHoldStarted = true;
      this.holdTimer = null;
    }, 500); // Customize the delay before 'onActiveHoldStart' event fires
  };

  endHoldTimer = () => {
    console.log("endHoldTimer");
    clearTimeout(this.holdTimer);
    this.activeHoldStarted = false;
    if (this.onActiveHoldEnd) {
      this.onActiveHoldEnd();
    }
  };

  cancelHoldTimer = () => {
    console.log("cancelHoldTimer");
    clearTimeout(this.holdTimer);
  };
}

window.addEventListener("DOMContentLoaded", (event) => {
  const brands = [
    "Dior 30 Montaigne Sunglasses",
    "Dior Bucket Hats",
    "Dior Vanity Case Bags",
    "Dior Chiffre Rouge Watches",
    "Balenciaga 3XL Sneakers",
  ];
  const effectList = [
    [
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f5048cefc21895f05_icn_cirkl_black_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de04bacbf7cfafab24ce10_Suglasses-Cube-12_3_comp.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "28.41deg 83.09deg 12.62m",
        fieldOfView: "30deg",
        minCameraOrbit: "auto auto 11.95m",
        minFieldOfView: "26.96deg",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df6639658bed50fed1586f_icn_cirkl_blue_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de04ba8465b69c31f40f73_Suglasses-Cube-12_1_comp.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "28.41deg 83.09deg 12.62m",
        fieldOfView: "30deg",
        minCameraOrbit: "auto auto 11.95m",
        minFieldOfView: "26.96deg",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df6639474801ebcaddb37d_icn_cirkl_yellow_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de04bae14bde34b1602fc9_Suglasses-Cube-12_2_comp.glb.txt",
        exposure: 1,
        cameraOrbit: "41.74deg 85.35deg 12.62m",
        environment: "neutral",
      },
    ],
    [
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df6625fd38dc95cbdf8b7d_icn_cirkl_hat_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65e09f3f3b78ef520a040919_hat_dark3.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "0.5325deg 89.02deg 86.52m",
        minCameraOrbit: "auto auto 78.57m",
        minFieldOfView: "24.96deg",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df6625474801ebcadd9856_icn_cirkl_hat_02.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65e09f3e1a1c7036c3b866d5_hat_light3.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "0.5325deg 89.02deg 86.52m",
        minCameraOrbit: "auto auto 78.57m",
        minFieldOfView: "24.96deg",
        environment: "neutral",
      },
    ],
    [
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65af989f0460f01182b18ac2_texture_1.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65d9011591caf38c3d05ae37_DIORTRAVEL_VANITY_CASE_004.glb.txt",
        exposure: 1.5,
        cameraTarget: "-0.003971m 0.09m 0.004712m",
        cameraTarget: "-0.003971m 0.09m 0.004712m",
        cameraOrbit: "1.545deg 87.57deg 0.691m",
        minCameraOrbit: "auto auto 0.6362m",
        minFieldOfView: "25.6deg",
        environment: "https://cdn.jsdelivr.net/gh/Umion/temp/Jewelry-HDRI.hdr",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65af989f9590b831c4fe770e_texture_2.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65d901158d2501f2379da707_diortravel_vanity_logo.glb.txt",
        exposure: 1.5,
        cameraTarget: "-0.003971m 0.09m 0.004712m",
        cameraOrbit: "1.545deg 87.57deg 0.691m",
        minCameraOrbit: "auto auto 0.6362m",
        minFieldOfView: "25.6deg",
        environment: "https://cdn.jsdelivr.net/gh/Umion/temp/Jewelry-HDRI.hdr",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65af989fa5fd0155dffad903_texture_3.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65d901f6566cca65116ff36d_VANITY_CASE_BlackWhite.glb.txt",
        exposure: 1.5,
        cameraTarget: "-0.003971m 0.09m 0.004712m",
        cameraOrbit: "1.545deg 87.57deg 0.691m",
        minCameraOrbit: "auto auto 0.6362m",
        minFieldOfView: "25.6deg",
        environment: "https://cdn.jsdelivr.net/gh/Umion/temp/Jewelry-HDRI.hdr",
      },
    ],
    [
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f5048cefc21895f05_icn_cirkl_black_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df29de9792773b9885675b_watch_v1_2_comp.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "-0.2184deg 93.9deg 8.125m",
        minCameraOrbit: "auto auto 7.464m",
        minFieldOfView: "25.5deg",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f5048cefc21895f05_icn_cirkl_black_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df29de9b4f36a47fb2d000_watch_v2_02_comp.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "-0.2184deg 93.9deg 8.125m",
        minCameraOrbit: "auto auto 7.464m",
        minFieldOfView: "25.5deg",
        environment: "neutral",
      },
    ],
    [
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f5048cefc21895f05_icn_cirkl_black_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65d8ff99134348b6c3f6b86c_Balenciaga_Black_R.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "0deg 75deg 672.9m",
        minCameraOrbit: "auto auto 628.5m",
        minFieldOfView: "26.29deg",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f127e47e299465aec_icn_cirkl_gray_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de1bdbd13c4e5af9de3109_Balenciaga_Gray_R.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "0deg 75deg 672.9m",
        minCameraOrbit: "auto auto 628.5m",
        minFieldOfView: "26.29deg",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f241f1824ca8d253b_icn_cirkl_pink_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de1bdbc5fa370abb512797_Balenciaga_pink_R.glb.txt",
        exposure: 1,
        cameraTarget: "auto auto auto",
        cameraOrbit: "0deg 75deg 672.9m",
        minCameraOrbit: "auto auto 628.5m",
        minFieldOfView: "26.29deg",
        environment: "neutral",
      },
    ],
  ];

  let index = 2;
  let subIndex = 0;
  const modelViewer = document.querySelector("model-viewer");
  const sidebarSlider = document.querySelector(".slider-sidebar");
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  const brandOut = document.querySelector("h3.viewer-heading");

  const bar = document.querySelector(".progress");
  const barinner = document.querySelector(".progress__inner");

  modelViewer.addEventListener("progress", (event) => {
    if (event.detail.totalProgress < 1) {
      bar.style.opacity = 1;
    } else {
      bar.style.opacity = 0;
    }
    barinner.style.width = event.detail.totalProgress * 100 + "%";
  });

  modelViewer.addEventListener("poster-dismissed", (e) => {
    document.querySelector(".prompt").style.opacity = 1;
    bar.style.opacity = 0;
    //modelViewer.environmentImage = "https://github.com/Umion/temp/raw/main/Jewelry-HDRI.hdr"
  });

  const carousel = new Carousel("carousel");
  carousel.setActiveSlide(2);
  carousel.moveToActiveSlide();

  const switchModel = (idx, subIdx) => {
    modelViewer.setAttribute("exposure", effectList[idx][subIdx].exposure);
    modelViewer.setAttribute(
      "camera-target",
      effectList[idx][subIdx].cameraTarget
    );
    modelViewer.setAttribute(
      "camera-orbit",
      effectList[idx][subIdx].cameraOrbit
    );
    modelViewer.setAttribute(
      "min-camera-orbit",
      effectList[idx][subIdx].minCameraOrbit
    );
    modelViewer.setAttribute(
      "min-field-ofView",
      effectList[idx][subIdx].minFieldOfView
    );
    modelViewer.setAttribute(
      "environment-image",
      effectList[idx][subIdx].environment
    );
    modelViewer.setAttribute("src", effectList[idx][subIdx].model);
  };

  sidebarItems.forEach((s, i) => {
    s.onclick = () => {
      if (i === subIndex) return;
      sidebarItems.forEach((si) => {
        si.classList.remove("active");
      });
      s.classList.add("active");
      switchModel(index, i);
      subIndex = i;
    };
  });

  carousel.onChange = async (value) => {
    if (index !== value) {
      index = value;
      subIndex = 0;
      if (brands[value]) {
        brandOut.innerHTML = brands[value];
      }
      sidebarItems.forEach((s, i) => {
        s.classList.remove("active");
        s.classList.remove("inactive");
        if (!i) {
          s.classList.add("active");
        }
        if (effectList[value][i]) {
          s.querySelector("img").src = effectList[value][i].icon;
        } else {
          s.classList.add("inactive");
        }
      });
      switchModel(value, subIndex);
    }
  };
});
