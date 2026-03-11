let noClickCount = 0;

function handleNoClick() {
    const question = document.getElementById("question");
    const noButton = document.getElementById("no-btn");
    const gif = document.getElementById("reaction-gif");

    if (noClickCount === 0) {
        question.innerText = "¿Estás segura? 🥺";
        gif.src = "../img/sad.gif";
        gif.classList.remove("d-none");
    } else if (noClickCount === 1) {
        question.innerText = "No te lo permitiré 😤";
        gif.src = "../img/angry.gif";
    } else {
        const randomX = Math.random() * 60 + "%";
        const randomY = Math.random() * 60 + "%";
        noButton.style.position = "absolute";
        noButton.style.left = randomX;
        noButton.style.top = randomY;
    }

    noClickCount++;
}

function acceptProposal() {
    document.getElementById("question").innerText = "¡Sabía que dirías que sí! ❤️";

    const gif = document.getElementById("reaction-gif");
    gif.src = "../img/happy.gif";
    gif.classList.remove("d-none");

    document.getElementById("buttons").innerHTML = `
        <div class="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <a href="album.html" class="btn btn-primary btn-lg">Ver nuestro álbum</a>
            <a href="../index.html" class="btn btn-light btn-lg">Ir al inicio</a>
        </div>
    `;
}
