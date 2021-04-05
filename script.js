let modalQt = 1;
let card = [];
let modalKey;

const $ = document.querySelector.bind(document);
const all = document.querySelectorAll.bind(document);

pizzaJson.map( (item, index) => {
  let pizzaItem  = $('.models .pizza-item').cloneNode(true);

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

// Listagem das Pizza

  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;

    $('.pizzaBig img').src = pizzaJson[key].img;
    $('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    $('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    $('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    $('.pizzaInfo--size.selected').classList.remove('selected');
    all('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if(sizeIndex == 2) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];;
    });

    $('.pizzaInfo--qt').innerHTML = modalQt;

    $('.pizzaWindowArea').style.opacity = 0;
    $('.pizzaWindowArea').style.display = 'flex';
    setTimeout( () => {
      $('.pizzaWindowArea').style.opacity = 1;
    }, 200)
  });

  $('.pizza-area').append(pizzaItem);
} );

// Eventos Modal
const closeModal = () => {
  $('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    $('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

all('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton')
.forEach( (item) => {
  item.addEventListener('click', closeModal);
} );

$('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQt > 1) {
    modalQt--;
    $('.pizzaInfo--qt').innerHTML = modalQt;
  }
});
$('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  $('.pizzaInfo--qt').innerHTML = modalQt;
});

all('.pizzaInfo--size').forEach( (size, seizeIndex) => {
  size.addEventListener('click', (e) => {
    $('.pizzaInfo--size.selected').classList.remove('selected');
    let price = $('.pizzaInfo--actualPrice');
    price.innerHTML = pizzaJson[seizeIndex].prices[seizeIndex];
    size.classList.add('selected');
  });
} );

$('.pizzaInfo--addButton').addEventListener('click', () => {
  let size = parseInt($('.pizzaInfo--size.selected').getAttribute('data-key'));
  let identifier = pizzaJson[modalKey].id+'@'+size;
  let key = card.findIndex((item)=> {
    return item.identifier == identifier;
  });
  if(key > -1) {
    card[key].qt += modalQt;
  }else {
    card.push({
      identifier,
      id:pizzaJson[modalKey].id,
      size,
      qt:modalQt
    });
  }

  updateCard();
  closeModal();
});

$('.menu-openner').addEventListener('click', () => {
  if(card.length > 0) {
    $('aside').style.left = 0;
  }
});

$('.menu-closer').addEventListener('click', () => {
  $('aside').style.left = '100vw';
});

function updateCard(){
 $('.menu-openner span').innerHTML = card.length;
 if(card.length > 0) {
   $('aside').classList.add('show');
   $('.cart').innerHTML = '';

   let subtotal = 0;
   let desconto = 0;
   let total = 0;

   for(let i in card) {
     let pizzaItem = pizzaJson.find((item)=>{
       return item.id == card[i].id;
     });

     subtotal += pizzaItem.prices[i] * card[i].qt;

     let cartItem = $('.models .cart--item').cloneNode(true);

     let pizzaSizeName;
     switch(card[i].size) {
       case 0:
        pizzaSizeName = 'p';
       break;
       case 1:
        pizzaSizeName = 'M';
       break;
       case 2:
        pizzaSizeName = 'G';
       break;
     }
     let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
     cartItem.querySelector('img').src = pizzaItem.img;
     cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
     cartItem.querySelector('.cart--item--qt ').innerHTML = card[i].qt;
     cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
       if(card[i].qt > 1) {
         card[i].qt--;
       } else {
         card.splice(i, 1);
       }
       updateCard();
     });
     cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
       card[i].qt++;
       updateCard();
     });
     $('.cart').append(cartItem);
   }
   desconto = subtotal * 0.1;
   total = subtotal - desconto;
   $('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
   $('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
   $('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


 } else {
   $('aside').classList.remove('show');
   $('aside').style.left = '100vw';
 }
}
