let input = document.getElementById('question');

let counter = document.getElementById('char-count');

let container = document.querySelector('.char-counter');

const form = document.getElementById('chatForm');

const errorMessage = document.getElementById('error-message')

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

// Form handler
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const question = formData.get("question");

    console.log(formData);
    console.log(question);

    if (question.length < 10) {
        errorMessage.textContent = "Stil et ordentligt spørgsmål!";
        return;
    } 

    if (question.length > 280) {
        errorMessage.textContent = "Spørgsmålet må højst være 280 tegn langt";
        return;
    }

    errorMessage.textContent = "";
    console.log("Spørgsmålet er gyldigt");
});
  
