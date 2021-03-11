

const StoregeController = (function () {

  return{
    storeProduct:function (product){
      let products;
      if(localStorage.getItem('products')==null){
  
        products=[];
        products.push(product);
        
      }else{
        products=JSON.parse(localStorage.getItem('products'));
        products.push(product);
      }
      localStorage.setItem('products',JSON.stringify(products));
    },
    getProducts: function(){
      let products;
      if(localStorage.getItem('products')==null){
        products=[];
  
      }else{
        products=JSON.parse(localStorage.getItem('products'));
      }
      return products;
    },
    updateProduct: function(product){
      let products=JSON.parse(localStorage.getItem('products'));
      products.forEach((prd,index)=>{
        if(product.id==prd.id){
          products.splice(index,1,product);
        }

      });
      localStorage.setItem('products',JSON.stringify(products));

    },
    deleteProduct: function(id){
      let products=JSON.parse(localStorage.getItem('products'));
      products.forEach((prd,index)=>{
        if(id==prd.id){
          products.splice(index,1);
        }

      });
      localStorage.setItem('products',JSON.stringify(products));

    }
  }
  
  })();

const ProductController = (function () {
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    products: StoregeController.getProducts(),
    selectedProducts: null,
    totalPrice: 0,
  };

  return {
    getProduct: function () {
      return data.products;
    },
    getData: function () {
      return data;
    },
    getProductById: function (id) {
        let product;

        data.products.forEach((prd)=>{
            if(prd.id == id) {
                product = prd;
                
            }
        })
        return product;
    },
    setCurrentProduct: function (product) {
        data.selectedProducts = product;
    },
    getCurrentProduct: function () {
        return data.selectedProducts;
    },
    addProduct: function (name, price) {
      let id;
      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }
      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    updateProduct: function (name,price){
        let product= null;

        data.products.forEach((prd)=>{
            if(prd.id==data.selectedProducts.id){
                prd.name=name;
                prd.price=parseFloat(price);
                product=prd;
            }
        });

        return product;

    },
    deleteProduct: function (product){

      data.products.forEach((prd,index)=>{

        if(prd.id==product.id){
          data.products.splice(index,1);
        }

      })
    },
    getTotal: function () {
      let total = 0;
      data.products.forEach((item) => {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
  };
})();



const UIController = (function () {
  const Selectors = {
    productList: "#item-list",
    productListItems: "#item-list tr",
    addButton: ".addBtn",
    productName: "#productName",
    productPrice: "#productPrice",
    productsCard: "#productCard",
    totalTL: "#totalTL",
    totalUSD: "#totalUSD",
    updateButton: ".updateBtn",
    deleteButton: ".deleteBtn",
    cancelButton: ".cancelBtn"
  };
  return {
    createProductList: function (products) {
      let html = "";

      products.forEach((prd) => {
        html += `<tr>
                            <td>${prd.id}</td>
                            <td>${prd.name}</td>
                            <td>${prd.price}$</td>
                                <td class="text-right">
                                   
                                    <i class="far fa-edit edit-product"></i>
                                    
                                    
                                </td>
                       </tr>`;
      });

      document.querySelector(Selectors.productList).innerHTML += html;
    },
    getSelectors: function () {
      return Selectors;
    },
    addProduct: function (prd) {
      document.querySelector(Selectors.productsCard).style.display = "block";
      let item = `<tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price}$</td>
                <td class="text-right">
                <i class="far fa-edit edit-product"></i>
                    
                </td>
       </tr>`;
      document.querySelector(Selectors.productList).innerHTML += item;
    },
    clearInputs: function () {
      document.querySelector(Selectors.productName).value = "";
      document.querySelector(Selectors.productPrice).value = "";
    },
    clearInfo: function (){
     const items= document.querySelectorAll(Selectors.productListItems);
     items.forEach((item)=>{
       if(item.classList.contains("bg-info")){
         item.classList.remove("bg-info");
         item.classList.remove("text-white");
       }
     })
    },
    hideCard: function () {
      document.querySelector(Selectors.productsCard).style.display = "none";
    },

    showTotal: function (total) {
      async function exchange() {
        const getCurrentUSD = await fetch(
          "https://api.exchangeratesapi.io/latest?symbols=USD,TRY"
        );
        const response = await getCurrentUSD.json();
        return response.rates;
      }
      exchange().then((rates) => {
        document.querySelector(Selectors.totalUSD).innerHTML = total;
        document.querySelector(Selectors.totalTL).innerHTML = parseFloat(
          total * rates.TRY
        ).toFixed(2);
      });
    },
    addProductForm: function(){
        const selectedProducts= ProductController.getCurrentProduct();
        
        document.querySelector(Selectors.productName).value=selectedProducts.name;
        document.querySelector(Selectors.productPrice).value=selectedProducts.price;

    },
    deleteProduct:function(){
      let items=document.querySelectorAll(Selectors.productListItems);
      items.forEach((item)=>{
        if(item.classList.contains("bg-info")){
          item.remove();
        }
      })
    },
    addingState: function (item) {
        UIController.clearInfo();
        UIController.clearInputs();
        document.querySelector(Selectors.addButton).style.display='inline';
        document.querySelector(Selectors.updateButton).style.display='none';
        document.querySelector(Selectors.deleteButton).style.display='none';
        document.querySelector(Selectors.cancelButton).style.display='none';
    },
    editState: function (tr) {

       
        tr.classList.add("bg-info");
        tr.classList.add("text-white");
        document.querySelector(Selectors.addButton).style.display='none';
        document.querySelector(Selectors.updateButton).style.display='inline';
        document.querySelector(Selectors.deleteButton).style.display='inline';
        document.querySelector(Selectors.cancelButton).style.display='inline';
    },
    updateProduct: function (prd){

        let updatedItems =null;
      ;
        let items=document.querySelectorAll(Selectors.productListItems);
        items.forEach((item)=>{
            if(item.classList.contains("bg-info")){
                item.children[1].innerHTML=prd.name;
                item.children[2].innerHTML=prd.price+" $";
                
                updatedItems=item;
            }

        })

        return updatedItems;

    }

  };
})();
//main
const App = (function (ProductController, UIController, StoregeController) {
  const UISelectors = UIController.getSelectors();

  const loadEventListeners = function () {
    document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);
    
    document.querySelector(UISelectors.productList).addEventListener("click",productEditClick)
    
    document.querySelector(UISelectors.updateButton).addEventListener("click", editProductSubmit);

    document.querySelector(UISelectors.cancelButton).addEventListener("click",cancelUpdate);
    
    document.querySelector(UISelectors.deleteButton).addEventListener("click",deleteProductSubmit);
  };

  const deleteProductSubmit = function(e) {
    e.preventDefault();
    const selectedProduct = ProductController.getCurrentProduct();
    ProductController.deleteProduct(selectedProduct);
    UIController.deleteProduct();
    const total = ProductController.getTotal();

    UIController.showTotal(total);

    StoregeController.deleteProduct(selectedProduct.id);

    UIController.addingState();
    if(total==0) UIController.hideCard();
  
  }

  const cancelUpdate=function(e) {
    e.preventDefault();
    UIController.addingState();
    UIController.clearInfo();


  }

    const editProductSubmit = function(e){
        e.preventDefault();
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if(productName!=="" && productPrice!==""){
          const updatedProduct =  ProductController.updateProduct(productName, productPrice);
        
           UIController.updateProduct(updatedProduct);

          const total = ProductController.getTotal();

          UIController.showTotal(total);

          StoregeController.updateProduct(updatedProduct);

          UIController.addingState();

        }

    }

    const productEditClick = function(e){
      
        if(e.target.classList.contains('edit-product')){
            const id= e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            
            const product = ProductController.getProductById(id);

            ProductController.setCurrentProduct(product);
            
          UIController.clearInfo();

            UIController.addProductForm();

            UIController.editState(e.target.parentNode.parentNode);
           
        }
  e.preventDefault();
    }

  const productAddSubmit = function (e) {
    e.preventDefault();
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (
      productName !== "" &&
      productPrice !== "" &&
      isNaN(productPrice) == false
    ) {
      const newProduct = ProductController.addProduct(
        productName,
        productPrice
      );
      UIController.addProduct(newProduct);

      StoregeController.storeProduct(newProduct);

      const total = ProductController.getTotal();
      UIController.clearInputs();
      UIController.showTotal(total);

     
    } else {
      alert("Price must be a number");
    }
  };

  return {
    init: function () {

        UIController.addingState();

      const products = ProductController.getProduct();

      if (products.length == 0) {
        UIController.hideCard();
      } else {
        UIController.createProductList(products);
      }

      loadEventListeners();
    },
  };
})(ProductController, UIController, StoregeController);

App.init();
