const API_URL = "http://localhost:3000/posts";
const form = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");

document.addEventListener("DOMContentLoaded", fetchPosts);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const postData = {
    image: document.getElementById("image").value.trim(),
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim()
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    });

    if (!res.ok) throw new Error("Error al guardar el post");

    form.reset();
    fetchPosts();
  } catch (err) {
    console.error(err);
    alert("Error guardando el post. Intenta de nuevo.");
  }
});

async function fetchPosts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener los posts");

    const posts = await res.json();
    postsContainer.innerHTML = posts.map(post => `
      <div class="post">
        <img src="${post.image}" alt="${post.title}" />
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <button class="delete-btn" data-id="${post.id}">Eliminar</button>
      </div>
    `).join("");

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        deletePost(id);
      });
    });

  } catch (err) {
    console.error(err);
    postsContainer.innerHTML = `<p>Error cargando los posts.</p>`;
  }
}

async function deletePost(id) {
  if (!confirm("¿Seguro que quieres eliminar este post?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Error al eliminar el post");

    fetchPosts(); 
  } catch (err) {
    console.error(err);
    alert("Error eliminando el post. Intenta de nuevo.");
  }
}
