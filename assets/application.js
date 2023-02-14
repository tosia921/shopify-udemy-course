// Main Menu Dropdown

    const hamburgerIcon = document.querySelector("#mobileMainMenuButton")
    const hamburgerMenu = document.querySelector("#mobile-main-menu")
    const dropdownItems = document.querySelectorAll(".dropdown-menu-item")

    hamburgerIcon.addEventListener('click', function() {
        if(hamburgerMenu.classList.contains('hidden')){
            hamburgerMenu.classList.remove('hidden')
            hamburgerMenu.classList.add('flex')
        } else if(hamburgerMenu.classList.contains('flex')){
            hamburgerMenu.classList.remove('flex')
            hamburgerMenu.classList.add('hidden')
        }
    })

    dropdownItems.forEach(dropdownItem => {
        dropdownItem.addEventListener('click', function(e) {
            e.preventDefault();
            const nestedTitle = dropdownItem.innerText.toLowerCase().replace(' ','-')
            const nestedMenu = document.querySelector(`.nested-menu-${nestedTitle}`)

            if(nestedMenu.classList.contains('hidden')){
                nestedMenu.classList.remove('hidden')
                nestedMenu.classList.add('flex')
            } else if(nestedMenu.classList.contains('flex')){
                nestedMenu.classList.remove('flex')
                nestedMenu.classList.add('hidden')
            }
        })
    })

    
//cart

class cartQuanityButton extends HTMLElement {
    constructor() {
        super();

        this.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                console.log(button)
                this.updateQuanity(button)
            })
            
        })

    }

    updateQuanity(button) {
        const input = this.querySelector("input");
        const value = Number(input.value)
        const isPlus = button.classList.contains("plus")
        const key = button.closest('.cart-item').getAttribute('data-key')

        if(isPlus){
            const newValue = value + 1;
            input.value = newValue;
            changeItemQuanity(key, newValue)
        } else if ( value > 1) {
            const newValue = value - 1;
            input.value = newValue;
            changeItemQuanity(key, newValue)
        }
    }
}

customElements.define('cart-quanity-button', cartQuanityButton);


document.querySelectorAll('.remove-item').forEach(remove => {
    remove.addEventListener('click', (e) => {
        e.preventDefault();

        const item = remove.closest('.cart-item');
        const key = item.getAttribute('data-key')

        axios.post('cart/change.js', {
            id: key,
            quantity: 0
        }).then(res => {
            if(res.data.items.length === 0) {
                document.querySelector(".cart-content").remove();
                
                const html = document.createElement('div');
                html.innerHTML = `<div class="empty-cart max-x-6xl h-60 my-4 mx-auto flex items-center justify-center"></div>
                <div class="text-center">
                    <h1 class="text-3xl my-4">Your Cart is empty</h1>
                    <div class="my-4 py-4">
                        <a href="/" class="border border-gray-600 text-white bg-gray-600 px-8 py-3">Continue Shopping</a>
                    </div>
                </div>
                </div>`;

                document.querySelector("#cart").appendChild(html)

            } else {
                
                const format = document.querySelector('[data-money-format]').getAttribute(['data-money-format']);
                const totalPrice = formatMoney(res.data.total_price, format); 

                document.querySelector("#total-price").textContent = totalPrice;
                document.querySelector(`[data-key="${key}"] .item-price`).textContent = itemPrice

                item.remove();

            }
        })
    })
})

// Updating cart note
document.querySelector('[name="note"]').addEventListener("keyup", debounce((e) => {
    axios.post('/cart/update.js', {
        note: e.target.value
    })
}, 500))

// change item Quanity function
function changeItemQuanity(key, quantity) {
    axios.post('/cart/change.js', {
        id: key,
        quantity
    }).then(res => {
        const format = document.querySelector('[data-money-format]').getAttribute(['data-money-format']);
        const totalPrice = formatMoney(res.data.total_price, format);   
        const item = res.data.items.find(item => item.key === key);
        const itemPrice = formatMoney(item.final_line_price, format);

        document.querySelector("#total-price").textContent = totalPrice;
        document.querySelector(`[data-key="${key}"] .item-price`).textContent = itemPrice
    })
}

//Debounce Function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Money format function
function formatMoney(cents, format) {
    if (typeof cents == 'string') { cents = cents.replace('.',''); }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || this.money_format);
  
    function defaultOption(opt, def) {
       return (typeof opt == 'undefined' ? def : opt);
    }
  
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');
  
      if (isNaN(number) || number == null) { return 0; }
  
      number = (number/100.0).toFixed(precision);
  
      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';
  
      return dollars + cents;
    }
  
    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }
  
    return formatString.replace(placeholderRegex, value);
  };
