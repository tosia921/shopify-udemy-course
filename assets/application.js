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
    
