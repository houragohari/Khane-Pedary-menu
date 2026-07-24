fetch("menu.json")
.then(response => response.json())
.then(data => {

    let menu = document.getElementById("menu");

    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    data.categories.forEach(category => {

        let title = document.createElement("h2");
        title.innerHTML = category.title;
        menu.appendChild(title);

        category.items.forEach(item => {

            let card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ""}
                <h3>${item.name}</h3>
                <p class="volume">${item.volume || ""}</p>
                <p class="description">${item.description}</p>
                <div class="price">${item.price} هزار تومان</div>
            `;

            if(item.image){
                card.addEventListener("click", () => {
                    modalImage.src = item.image;
                    modal.classList.add("show");
                });
            }

            menu.appendChild(card);

        });

    });

    modal.addEventListener("click", () => {
        modal.classList.remove("show");
    });

});
