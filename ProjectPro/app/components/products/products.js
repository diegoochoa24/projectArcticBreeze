import { getProducts } from "../../js/providers/products.js";
import Swal from 'https://cdn.skypack.dev/sweetalert2';

export const init = () => {
  console.log("Initializing Products...");
  getProducts().then((response) => {
    console.log(response);
    if (response) showProducts(response);
  });
};


function showProducts(data) {
    console.log('Showing Products...');
    let template = document.getElementById('template-product');
    if (!template) {
        console.log('Template element not found');
        return;
    }
    let fragment = document.createDocumentFragment();
    var index = 0;

    data.forEach(d => {
        console.log(d);

        let templateContent = template.content.cloneNode(true);
        templateContent.querySelector('#product-name').textContent = d.productName;
        templateContent.querySelector('#product-price').textContent = "$"+d.price;
        console.log("https://arcticbreeze.blob.core.windows.net/productocontenedor/"+d.productImage);
        if(d.productImage == null || d.productImage == ""){
          templateContent.querySelector('#product-img').src = "../../api/photos/products/ac_model_x.jpeg";
        }else{
          templateContent.querySelector('#product-img').src = "https://arcticbreeze.blob.core.windows.net/productocontenedor/"+d.productImage;
        }
        let button = templateContent.querySelector('#cart-button');
        button.dataset.productId = d.productID;

        button.addEventListener('click', (e) => {
          let productId = e.currentTarget.dataset.productId;
          handleProductSelection(productId);
        });
        
        fragment.appendChild(templateContent);
        index++;
    });

    document.getElementById('catalog').appendChild(fragment);
}

function handleProductSelection(productId) {
  Swal.fire({
    title: "Add to your cart?",
    showDenyButton: true,
    confirmButtonText: "Add to cart",
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      let counts = JSON.parse(localStorage.getItem('productCounts')) || {};

      if (counts[productId]) {
        counts[productId]++;
      } else {
        counts[productId] = 1;
      }
    
      localStorage.setItem('productCounts', JSON.stringify(counts));
    
      console.log(`Product ${productId} selected ${counts[productId]} times.`);
      Swal.fire("Product Added!", "", "success");
    } 
  });
}


