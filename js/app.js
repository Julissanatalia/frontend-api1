document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results');
    const metricsDisplay = document.getElementById('metrics');

    // Búsqueda inicial automática al cargar la página
    searchInput.value = 'House';
    fetchShows('House');

    // Eventos de click y tecla Enter
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) fetchShows(query);
    }

    async function fetchShows(query) {
        // Estado de carga
        resultsContainer.innerHTML = '<p style="text-align:center; width:100%;">Consultando servidor...</p>';
        metricsDisplay.textContent = 'Calculando métricas...';
        
        // Métrica: Inicia temporizador
        const startTime = performance.now(); 

        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            
            // Métrica: Finaliza temporizador
            const endTime = performance.now(); 
            const timeTaken = (endTime - startTime).toFixed(2);

            metricsDisplay.textContent = `⏱️ Latencia: ${timeTaken} ms | 📊 Resultados: ${data.length}`;

            renderResults(data);
        } catch (error) {
            resultsContainer.innerHTML = `<p style="color: #ff4757; text-align:center; width:100%;">❌ Error: ${error.message}</p>`;
            metricsDisplay.textContent = 'Fallo en la petición';
        }
    }

    function renderResults(shows) {
        resultsContainer.innerHTML = '';

        if (shows.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center; width:100%;">No se encontraron coincidencias.</p>';
            return;
        }

        shows.forEach(item => {
            const show = item.show;
            const imageUrl = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=Sin+Imagen';
            const rating = show.rating.average ? `⭐ ${show.rating.average}` : '⭐ N/A';
            const genres = show.genres.join(', ') || 'Desconocido';

            const card = document.createElement('article');
            card.className = 'glass-panel card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="Póster de ${show.name}" loading="lazy">
                <div class="card-info">
                    <h3>${show.name}</h3>
                    <span class="rating">${rating}</span>
                    <p class="genres">${genres}</p>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
});