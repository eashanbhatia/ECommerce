// let productContainer = document.querySelector('.productContainer');
// productContainer.addEventListener('click',(ev)=>{
//     if(ev.target.classList.contains('addToCartBtn')){
//         let id = ev.target.getAttribute('id');
//         console.log(id);
//     }
//     else if(ev.target.classList.contains('wishListBtn')){
//         let id = ev.target.getAttribute('id');
//         console.log(id);
//     }
// })

let shopSection = document.querySelector('.shop-section');
shopSection.addEventListener('click',async (ev)=>{
    if(ev.target.classList.contains('clothes')){
        console.log('clothes');  //65d38bdf8b9ca1338d0cba2a
        // app.get('/clothes',(req,res,next)=>{
        //     console.log('clothes click hua');
        // })
        // let list = await productsCategory.findById('65d38bdf8b9ca1338d0cba2a').exec();
        // console.log(list); 
        axios.get(`/productscategory?name=65d38bdf8b9ca1338d0cba2a`)
        .then((data)=>{
            // let productsArray = data.data.products;
            console.log(data.data);
            // console.log(data.data.products);

        })
        .catch((err)=>{
            console.log(err);
        });
    }



    else if (ev.target.classList.contains('food')){
        console.log('food');
    }
    else if (ev.target.classList.contains('furniture')){
        console.log('furniture');
    }
    else if (ev.target.classList.contains('electronics')){
        console.log('electronics');
    }
})


