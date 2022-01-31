// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

let currentProducts = [];
let currentPagination = {};
let favouriteuuid =[];
let favouritelist=[];

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrands = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};
/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};
function favourite(uuidElement)
{favouriteuuid.push(uuidElement);}
/**
 * Render list of products
 * @param  {Array} products
 */

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}</span>
        <button onclick=favourite("${product.uuid}")>fav</button>
      </div>
    `;
    })
    .join('');
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};
/**
 * Render page selector
 * @param  {Object} pagination
 */

const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};
/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
};
/**
 * Render new products selector
 * @param  {Object} paginationNew
 */
  const renderIndicatorsNew = paginationNew => {
  const countNew = paginationNew.length;
  spanNbNewProducts.innerHTML = countNew;
};

function percentile(data, q) {
  var pos = ((data.length) - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if( (data[base+1]!==undefined) ) {
    return data[base].price + rest * (data[base+1].price - data[base].price);
  } else {
    return data[base].price;
  }
}
/**
 * Render last released date indicator
 * @param  {Object} last
 */
 const render_last_released_date = last => {
  last=sortbydateDesc(last);
  const last_date = last[0].released;
  spanLastReleasedDate.innerHTML = last_date;
};

/**
 * Render brand selector
 * @param  {Object} brand
 * @param  {Object} brandSelected
 */
 const renderBrands = (brand,brandSelected)=> {
  //const brandstot = brand;
  const options = Array.from(
    brand,
    (brand) =>`<option value="${brand}">${brand}</option>`
  ).join('');
  selectBrands.innerHTML = options;
  selectBrands.selectedIndex = brand.indexOf(brandSelected);
};

function newrelease(products){
  let newProductRelease = [];
  for (var i=0; i<products.length; i++)
  {
    if((Math.abs(Date.now()-Date.parse(products[i].released))/(1000 * 60 * 60 * 24))<14)
    {newProductRelease.push(products[i]);}
  }
  return newProductRelease;
}

const render2 = (products, pagination,brandSelected) => {
  if (buttonReleasedbool==true)
    {products=newrelease(products);}
  if(buttonReasonablebool==true)
    {products=reasonable(products);}
  if (buttonfavouritebool==true)
    {
      favouritelist=[];
      favouriteuuid=[ ... new Set(favouriteuuid)]
      favouriteuuid.forEach(element => {
        products.forEach(elemuuid=> {
          if (element==elemuuid.uuid & favouritelist.indexOf(elemuuid) <0)
          {favouritelist.push(elemuuid);}
        })  
      });
      favouritelist=[ ... new Set(favouritelist)]
      products=favouritelist;
    }
  let brandstot=['No brand selected'];
  for (let step=0;step<products.length;step++)
  {
    brandstot.push(products[step].brand);
  }
  brandstot=[ ... new Set(brandstot)]
 
  var const_brands={};
  for (var i=0; i<products.length; i++)
  {
    const_brands[products[i].brand]=[];
  }
  for (var i=0; i<products.length; i++)
  {
    const_brands[products[i].brand].push(products[i]);
  }
  if(brandSelected!='No brand selected' )
  {products=const_brands[brandSelected];}

  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);

}
/**
 * Declaration of all Listeners
 */
/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage,parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,'No brand selected'));
});
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value),parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,'No brand selected'));
   
});

selectSort.addEventListener('change',event =>{
  if(event.target.value=="price-asc"){
      fetchProducts(currentPagination.currentPage,parseInt(selectShow.value))
      .then(setCurrentProducts)
      .then(() => render2(sortbypriceAsc(currentProducts), currentPagination,'No brand selected'))}
  else if(event.target.value=="price-desc"){
    fetchProducts(currentPagination.currentPage,parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(sortbypriceDesc(currentProducts), currentPagination,'No brand selected'))}
  else {
    fetchProducts(currentPagination.currentPage,parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,'No brand selected'))
  }
});


document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,'No brand selected'))
);


var buttonReleasedbool=false;
function buttonReleased()
{ if (buttonReleasedbool==false){buttonReleasedbool=true;}
else {buttonReleasedbool=false;}
{
  fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,'No brand selected'));
};}

var buttonReasonablebool=false;
function buttonReasonable()
{ if (buttonReasonablebool==false){buttonReasonablebool=true;}
else {buttonReasonablebool=false;}
{
  fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
};}