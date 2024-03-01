import Carousel from "./carousel";

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
        cameraOrbit: "41.74deg 85.35deg 12.62m",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df6639658bed50fed1586f_icn_cirkl_blue_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de04ba8465b69c31f40f73_Suglasses-Cube-12_1_comp.glb.txt",
        exposure: 1,
        cameraOrbit: "41.74deg 85.35deg 12.62m",
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
        cameraOrbit: "3.081deg 83.66deg 86.52m",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df6625474801ebcadd9856_icn_cirkl_hat_02.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65e09f3e1a1c7036c3b866d5_hat_light3.glb.txt",
        exposure: 1,
        cameraOrbit: "3.081deg 83.66deg 86.52m",
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
        cameraOrbit: "1.545deg 87.57deg 0.691m",
        minCameraOrbit: "auto auto 0.6362m",
        minFieldOfView: "25.6deg",
        environment:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df47589544a8924104f9cd_Jewelry-HDRI.jpg",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65af989fa5fd0155dffad903_texture_3.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65d901f6566cca65116ff36d_VANITY_CASE_BlackWhite.glb.txt",
        exposure: 1.5,
        cameraOrbit: "1.545deg 87.57deg 0.691m",
        minCameraOrbit: "auto auto 0.6362m",
        minFieldOfView: "25.6deg",
        environment:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df47589544a8924104f9cd_Jewelry-HDRI.jpg",
      },
    ],
    [
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f5048cefc21895f05_icn_cirkl_black_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df29de9792773b9885675b_watch_v1_2_comp.glb.txt",
        exposure: 1,
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
        cameraOrbit: "30.9deg 87.44deg 672.9m",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f127e47e299465aec_icn_cirkl_gray_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de1bdbd13c4e5af9de3109_Balenciaga_Gray_R.glb.txt",
        exposure: 1,
        cameraOrbit: "30.9deg 87.44deg 672.9m",
        environment: "neutral",
      },
      {
        icon: "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65df662f241f1824ca8d253b_icn_cirkl_pink_01.png",
        model:
          "https://uploads-ssl.webflow.com/659d5e3349088fcd7ab21373/65de1bdbc5fa370abb512797_Balenciaga_pink_R.glb.txt",
        exposure: 1,
        cameraOrbit: "30.9deg 87.44deg 672.9m",
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
      "camera-orbit",
      effectList[idx][subIdx].cameraOrbit
    );
    modelViewer.setAttribute(
      "min-camera-orbit",
      effectList[idx][subIdx].minCameraOrbit
    );
    modelViewer.setAttribute(
      "min-field-ofView",
      effectList[idx][subIdx].minCameraOrbit
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
