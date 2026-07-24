fetch("menu.json")
.then(response => response.json())
.then(data => {

let menu = document.getElementById("menu");


data.categories.forEach(category => {


let title = document.createElement("h2");

title.innerHTML = category.title;

menu.appendChild(title);



category.items.forEach(item => {


let card = document.createElement("div");

card.className="card";


card.innerHTML = `
${item.image ? `<img src="${item.image}" alt="${item.name}" class="menu-image">` : ""}

<h3>${item.name}</h3>

<p>${item.volume || ""}</p>

<p>${item.description}</p>

<div class="price">
${item.price} هزار تومان
</div>
`;


menu.appendChild(card);


});


});


});
