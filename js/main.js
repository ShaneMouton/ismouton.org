/**
 * ISMOUTON 2018-06-03
 */

(()=>{
  function routePage(urlString) {
    let hash = /.*#(.*)/.exec(urlString);
    if (hash) hash = hash[1];

    /* No hash then lets allow default link behavior */
    if (!hash) return;

    /* clear all active in navbar */
    let activeNavItems = document.querySelectorAll("nav ul li a.active");
    if (activeNavItems) activeNavItems.forEach(item => item.classList.remove("active"));

    let url = `/pages/${hash}.html`;
    fetch(url)
    .then((response) =>{
      if (response.status === 200) {
        return response.text();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((text) => {
      let main = document.querySelector("main");
      main.innerHTML = text;

      /* Set Active Links */
      let hashUrl = `#${hash}`;
      let newActive = document.querySelector(`nav > ul > li > a[href="${hashUrl}"`);
      if (newActive) newActive.classList.add("active");

      /* check the page for special classes that need to be transformed with js */
      processPage();
    })
    .catch((err) => {
      let main = document.querySelector("main");
      main.innerHTML = "That's a 404!";
    });
  }

  /* One router to rule them all */
  document.body.addEventListener("click", (e)=>{
    let target = e.target;
    if (target.tagName === "A") {
      let href = target.href;
      routePage(href);
    }
  });

  function processPage() {
    let imageReflectContainers = document.querySelectorAll(".imageReflectContainer");
    /* Add a reflection to imageReflectContainers */
    if (imageReflectContainers) {
      imageReflectContainers.forEach((item) => {
        const { src, height } = item.dataset;

        let img = document.createElement("img");
        let canvas = document.createElement("canvas");
        let canvasContainer = document.createElement("div");

        canvas.style.opacity = ".3";
        canvas.style.marginTop = "2px";
        canvas.style.transformOrigin = "bottom";
        canvas.style.transform = "perspective(500px) rotateX(14deg) rotateY(180deg) rotateZ(180deg)";
        canvas.style.position = "relative";   

        item.appendChild(img);
        canvasContainer.appendChild(canvas);
        
        fetch(src)
        .then((response) => response.blob())
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);

          img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            const scale = img.height / img.naturalHeight;
            let heightOfReflection = 0;

            canvas.width  = width;
            canvas.height = height;

            let context = canvas.getContext("2d");
            let image = new Image();

            image.src = imageUrl;
            context.drawImage(image,0,0);

            let imageData = context.getImageData(0,0,width, height);
            
            let alpha = 255;
            for(let i = height; i >= 0; i--){
              for(let j = 0; j < width; j++) {
                imageData.data[((i * (width * 4)) + (j * 4) + 3)] = alpha;
              }

              if ((alpha > 0)) { 
                alpha -= 2;
                heightOfReflection++;
              }
            }

            context.putImageData(imageData,0,0);
            item.appendChild(canvasContainer);

            heightOfReflection *= scale;
            item.style.width = width * scale + "px";
            let marginBottom = ~ ((canvas.height * scale) - heightOfReflection);
            canvas.style.marginBottom = marginBottom + "px";
            canvas.style.top = ~ (canvas.height * scale) + "px";
          };

          img.src = imageUrl;
        });
      });
    }
  }

  routePage(window.location.href)
})();