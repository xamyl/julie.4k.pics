document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('photoGallery');
    
    // Function to get all image files from the /photo directory
    async function loadPhotos() {
        try {
            const response = await fetch('/photo');
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'))
                .filter(a => a.href.match(/\.(jpg|jpeg|png|gif)$/i));

            links.forEach(link => {
                const photoPath = link.href;
                const container = document.createElement('div');
                container.className = 'photo-container';
                
                const img = document.createElement('img');
                img.src = photoPath;
                img.alt = 'julie';
                img.loading = 'lazy'; // Enable lazy loading for better performance
                
                container.appendChild(img);
                gallery.appendChild(container);
            });
        } catch (error) {
            console.error('Error loading photos:', error);
            gallery.innerHTML = '<p>Error loading photos. Please make sure your photos are in the /photo directory.</p>';
        }
    }

    loadPhotos();
});
