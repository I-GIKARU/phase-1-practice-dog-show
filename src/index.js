document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("table-body");
    const form = document.getElementById("dog-form");
    let currentDogId = null;
  
    // Fetch and display all dogs
    function fetchDogs() {
      fetch("http://localhost:3000/dogs")
        .then(response => response.json())
        .then(dogs => {
          tableBody.innerHTML = "";
          dogs.forEach(dog => renderDogRow(dog));
        });
    }
  
    function renderDogRow(dog) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
      `;
      tableBody.appendChild(row);
    }
  
    tableBody.addEventListener("click", event => {
      if (event.target.classList.contains("edit-btn")) {
        const dogId = event.target.dataset.id;
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then(response => response.json())
          .then(dog => {
            form.name.value = dog.name;
            form.breed.value = dog.breed;
            form.sex.value = dog.sex;
            currentDogId = dog.id;
          });
      }
    });
  
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!currentDogId) return;
  
      const updatedDog = {
        name: form.name.value,
        breed: form.breed.value,
        sex: form.sex.value
      };
  
      fetch(`http://localhost:3000/dogs/${currentDogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDog)
      }).then(() => {
        fetchDogs();
        form.reset();
        currentDogId = null;
      });
    });
  
    fetchDogs();
  });
  