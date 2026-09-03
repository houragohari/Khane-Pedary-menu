fetch("menu.json")

.then(response => response.json())

.then(data => {

    const categoryNav =
        document.getElementById("categoryNav");

    const book =
        document.getElementById("book");

    const prevBtn =
        document.getElementById("prevBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const currentPage =
        document.getElementById("currentPage");

    const totalPages =
        document.getElementById("totalPages");

    const search =
        document.getElementById("search");

    const searchResults =
        document.getElementById("searchResults");

    const menu =
        document.getElementById("menu");

    const modal =
        document.getElementById("imageModal");

    const modalImage =
        document.getElementById("modalImage");


    let currentCategory = 0;

    let currentPageIndex = 0;

    let pages = [];

    let touchStartX = 0;

    let touchEndX = 0;


    /* =========================
       CATEGORY BUTTONS
    ========================= */

    data.categories.forEach((category, index) => {

        const button =
            document.createElement("button");

        button.className =
            "category-btn";

        button.innerHTML =
            category.title;

        button.addEventListener("click", () => {

            openCategory(index);

        });

        categoryNav.appendChild(button);

    });


    /* =========================
       OPEN CATEGORY
    ========================= */

    function openCategory(index) {

        currentCategory = index;

        currentPageIndex = 0;

        const buttons =
            document.querySelectorAll(".category-btn");

        buttons.forEach((button, i) => {

            button.classList.toggle(
                "active",
                i === index
            );

        });


        const activeButton =
            buttons[index];

        if(activeButton){

            activeButton.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });

        }


        createPages();

    }


    /* =========================
       CREATE PAGES
    ========================= */

    function createPages() {

        const category =
            data.categories[currentCategory];

        book.innerHTML = "";

        pages = [];


        /*
           هر صفحه دو محصول
        */

        const items =
            category.items || [];


        for(
            let i = 0;
            i < items.length;
            i += 2
        ){

            const pageItems =
                items.slice(i, i + 2);


            const page =
                document.createElement("div");

            page.className =
                "book-page";


            const title =
                document.createElement("div");

            title.className =
                "page-category-title";

            title.innerHTML =
                category.title;


            const products =
                document.createElement("div");

            products.className =
                "page-products";


            pageItems.forEach(item => {

                const card =
                    createProductCard(item);

                products.appendChild(card);

            });


            page.appendChild(title);

            page.appendChild(products);

            book.appendChild(page);

            pages.push(page);

        }


        /*
           اگر دسته خالی بود
        */

        if(pages.length === 0){

            const page =
                document.createElement("div");

            page.className =
                "book-page";

            page.innerHTML = `
                <div class="page-category-title">
                    ${category.title}
                </div>

                <p style="text-align:center;">
                    آیتمی برای نمایش وجود ندارد.
                </p>
            `;

            book.appendChild(page);

            pages.push(page);

        }


        showPage();

    }


    /* =========================
       PRODUCT CARD
    ========================= */

    function createProductCard(item) {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        if(item.image){

            const img =
                document.createElement("img");

            img.src =
                item.image;

            img.alt =
                item.name;

            card.appendChild(img);

        }


        const name =
            document.createElement("h3");

        name.innerHTML =
            item.name;

        card.appendChild(name);


        if(item.volume){

            const volume =
                document.createElement("p");

            volume.className =
                "product-volume";

            volume.innerHTML =
                item.volume;

            card.appendChild(volume);

        }


        if(item.description){

            const description =
                document.createElement("p");

            description.className =
                "product-description";

            description.innerHTML =
                item.description;

            card.appendChild(description);

        }


        const price =
            document.createElement("div");

        price.className =
            "product-price";


        if(item.prices){

            price.innerHTML = `

                <span class="price-line">
                    تک نفره:
                    ${item.prices["تک نفره"]}
                    هزار تومان
                </span>

                <span class="price-line">
                    دو نفره:
                    ${item.prices["دو نفره"]}
                    هزار تومان
                </span>

            `;

        }

        else {

            price.innerHTML =
                `${item.price} هزار تومان`;

        }


        card.appendChild(price);


        /*
           باز شدن عکس
        */

        if(item.image){

            card.addEventListener(
                "click",
                () => {

                    modalImage.src =
                        item.image;

                    modal.classList.add(
                        "show"
                    );

                }
            );

        }


        return card;

    }


    /* =========================
       SHOW PAGE
    ========================= */

    function showPage(
        direction = ""
    ){

        pages.forEach((page, index) => {

            page.style.display =
                index === currentPageIndex
                    ? "block"
                    : "none";

        });


        const page =
            pages[currentPageIndex];


        if(direction){

            page.classList.remove(
                "flip-next",
                "flip-prev"
            );


            void page.offsetWidth;


            page.classList.add(
                direction === "next"
                    ? "flip-next"
                    : "flip-prev"
            );

        }


        currentPage.innerHTML =
            currentPageIndex + 1;

        totalPages.innerHTML =
            pages.length;


        prevBtn.disabled =
            currentPageIndex === 0;

        nextBtn.disabled =
            currentPageIndex === pages.length - 1;

    }


    /* =========================
       NEXT PAGE
    ========================= */

    function nextPage(){

        if(
            currentPageIndex <
            pages.length - 1
        ){

            currentPageIndex++;

            showPage("next");

        }

    }


    /* =========================
       PREVIOUS PAGE
    ========================= */

    function previousPage(){

        if(
            currentPageIndex > 0
        ){

            currentPageIndex--;

            showPage("prev");

        }

    }


    nextBtn.addEventListener(
        "click",
        nextPage
    );


    prevBtn.addEventListener(
        "click",
        previousPage
    );


    /* =========================
       SWIPE
    ========================= */

    book.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    book.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

        },
        { passive: true }
    );


    function handleSwipe(){

        const distance =
            touchEndX - touchStartX;


        if(Math.abs(distance) < 50){

            return;

        }


        /*
           چون سایت RTL است:
           کشیدن به چپ = صفحه بعد
           کشیدن به راست = صفحه قبل
        */

        if(distance < 0){

            nextPage();

        }

        else {

            previousPage();

        }

    }


    /* =========================
       SEARCH
    ========================= */

    search.addEventListener(
        "input",
        () => {

            const query =
                search.value.trim().toLowerCase();


            if(!query){

                searchResults.classList.remove(
                    "active"
                );

                menu.style.display =
                    "block";

                return;

            }


            menu.style.display =
                "none";

            searchResults.classList.add(
                "active"
            );


            let results = [];


            data.categories.forEach(category => {

                category.items.forEach(item => {

                    const text =
                        `
                        ${item.name}
                        ${item.description || ""}
                        ${category.title}
                        `.toLowerCase();


                    if(text.includes(query)){

                        results.push({
                            item,
                            category
                        });

                    }

                });

            });


            renderSearchResults(results);

        }
    );


    function renderSearchResults(results){

        searchResults.innerHTML = "";


        const title =
            document.createElement("h2");

        title.className =
            "search-results-title";

        title.innerHTML =
            `نتایج جستجو (${results.length})`;

        searchResults.appendChild(title);


        if(results.length === 0){

            searchResults.innerHTML += `

                <p style="
                    text-align:center;
                    color:#ddd;
                    padding:30px;
                ">
                    موردی پیدا نشد.
                </p>

            `;

            return;

        }


        results.forEach(result => {

            const item =
                result.item;

            const category =
                result.category;


            const card =
                document.createElement("div");

            card.className =
                "search-result-card";


            let priceHTML = "";


            if(item.prices){

                priceHTML = `

                    <span class="search-result-price">
                        تک نفره:
                        ${item.prices["تک نفره"]}
                        هزار تومان
                        <br>

                        دو نفره:
                        ${item.prices["دو نفره"]}
                        هزار تومان
                    </span>

                `;

            }

            else {

                priceHTML = `

                    <span class="search-result-price">
                        ${item.price}
                        هزار تومان
                    </span>

                `;

            }


            card.innerHTML = `

                <small>
                    ${category.title}
                </small>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${item.description || ""}
                </p>

                ${priceHTML}

            `;


            searchResults.appendChild(card);

        });

    }


    /* =========================
       MODAL
    ========================= */

    modal.addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "show"
            );

        }
    );


    modalImage.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    /* =========================
       START
    ========================= */

    openCategory(0);

});
