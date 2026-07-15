const menuContainer = document.getElementById("menu");
const featuredContainer = document.getElementById("featured-products");
const searchInput = document.getElementById("search");


let allItems = [];


// دریافت اطلاعات منو

fetch("menu.json")

.then(response => response.json())

.then(data => {


    data.categories.forEach(category => {


        createCategory(category);



        category.items.forEach(item => {


            allItems.push(item);



            if(item.popular){


                createCard(
                    item,
                    featuredContainer
                );


            }


        });



    });



})

.catch(error => {

    menuContainer.innerHTML =
    "<p>خطا در بارگذاری منو</p>";

});




// ساخت دسته‌ها


function createCategory(category){


    const title =
    document.createElement("h2");


    title.className="category-title";

    title.innerText =
    category.title;


    menuContainer.appendChild(title);



    category.items.forEach(item=>{


        createCard(
            item,
            menuContainer
        );


    });


}




// ساخت کارت محصول


function createCard(item,container){



    const card =
    document.createElement("div");


    card.className="card";



    card.innerHTML = `


    ${
        item.image ?
        `<img src="${item.image}" 
        onerror="this.style.display='none'">`
        :
        ""
    }


    <h3>${item.name}</h3>


    ${
        item.volume ?
        `<div class="volume">
        ${item.volume}
        </div>`
        :
        ""
    }



    <p class="description">

    ${item.description}

    </p>



    <div class="price">

    ${item.price}

    هزار تومان

    </div>



    ${
        item.popular ?

        `<span class="badge">
        ⭐ پرفروش
        </span>`

        :

        ""

    }


    `;



    container.appendChild(card);


}





// جستجو


searchInput.addEventListener(
"input",
function(){


let value =
this.value.trim().toLowerCase();



document.querySelectorAll(".card")
.forEach(card=>{


let text =
card.innerText.toLowerCase();



if(text.includes(value)){


card.style.display="block";


}

else{


card.style.display="none";


}


});



});
