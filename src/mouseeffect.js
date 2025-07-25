// Get a reference to the image you want to move (the one with z-index 10)
const mainImage = document.querySelector('img.relative.z-10'); // Targeting the image with z-index 10

// Get a reference to the section (or the parent container you want to track mouse movement within)
const heroSection = document.querySelector('section');

// Adjust these values to control the intensity of the movement
const movementIntensityX = 20; // Max pixels to move horizontally
const movementIntensityY = 20; // Max pixels to move vertically

// Check if both elements exist before adding event listeners
if (mainImage && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        // Get the center of the hero section
        const sectionRect = heroSection.getBoundingClientRect();
        const centerX = sectionRect.left + sectionRect.width / 2;
        const centerY = sectionRect.top + sectionRect.height / 2;

        // Calculate mouse position relative to the center of the section
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate the translation values
        // Divide by (sectionRect.width / 2) to normalize mouseX to a range of -1 to 1
        // Then multiply by intensity to get the desired pixel movement
        const translateX = (mouseX / (sectionRect.width / 2)) * movementIntensityX;
        const translateY = (mouseY / (sectionRect.height / 2)) * movementIntensityY;

        // Apply the transform to the main image
        // Using translate3d helps with performance by leveraging GPU acceleration
        mainImage.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });

    // Optional: Reset image position when mouse leaves the section
    heroSection.addEventListener('mouseleave', () => {
        mainImage.style.transform = `translate3d(0, 0, 0)`;
    });
} else {
    console.warn("Could not find required elements for mouse effect. Ensure 'img.relative.z-10' and 'section' exist.");
}