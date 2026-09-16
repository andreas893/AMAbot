let input = document.getElementById('question');

let counter = document.getElementById('char-count');

let container = document.querySelector('.char-counter');

let form = document.getElementById('chatForm');

input.addEventListener('input', (event) => {
    let length = event.target.value.length
    counter.innerHTML = length

    container.classList.remove('warning', 'danger')

    if (length > 150){
        container.classList.add('danger')
    } else if (length > 100){
        container.classList.add('warning')
    }

    form.addEventListener('submit', (event) =>{
        if (length > 200){
            event.preventDefault();
        }
    })

});

  
