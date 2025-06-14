document.addEventListener('DOMContentLoaded', () => {
    const currentPhoto = document.getElementById('currentPhoto');
    const prevButton = document.getElementById('prevPhoto');
    const nextButton = document.getElementById('nextPhoto');
    const photoCounter = document.getElementById('photoCounter');
    
    let photos = [];
    let currentIndex = 0;    // Function to update the displayed photo
    function updatePhoto() {
        if (photos.length === 0) return;
        
        const photo = photos[currentIndex];
        const photoUrl = photo.startsWith('/photo/') ? photo : `/photo/${photo}`;
        currentPhoto.src = photoUrl;
        document.getElementById('fullImageLink').href = photoUrl;
        photoCounter.textContent = `Photo ${currentIndex + 1} of ${photos.length}`;
    }

    // Event listeners for navigation
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        updatePhoto();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % photos.length;
        updatePhoto();
    });

    // Function to get all image files from the /photo directory
    async function loadPhotos() {
        try {
            const response = await fetch('/photo');
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');            photos = Array.from(doc.querySelectorAll('a'))
                .filter(a => a.href.match(/\.(jpg|jpeg|png|gif|heic)$/i))
                .map(a => {
                    const fullPath = new URL(a.href).pathname;
                    return fullPath.startsWith('/photo/') ? fullPath : `/photo/${a.textContent.trim()}`;
                });

            if (photos.length > 0) {
                updatePhoto();
            } else {
                photoCounter.textContent = 'No photos found';
            }
        } catch (error) {
            console.error('Error loading photos:', error);
            photoCounter.textContent = 'Error loading photos';
        }
    }

    loadPhotos();
});
