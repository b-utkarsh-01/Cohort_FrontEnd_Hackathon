// main.js

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Typing effect setup ---
    const typedTextSpan = document.getElementById("typed-text");
    const textArray = ["I am Ronak.", "a Full-Stack Developer.", "a UI/UX Designer.", "a Content Creator."];
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 1500);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, 500);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, 1000);
    }
    // --- End Typing effect setup ---


    // --- GSAP MatchMedia for Desktop Animations ---
    let mm = gsap.matchMedia();

    // Define elements for all sections
    const heroSection = document.getElementById('hero-section');
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroTextWrapper = document.querySelector('.hero-text-wrapper');
    const digitalProductsSection = document.getElementById('digital-products');
    const productsContainer = document.getElementById('Products'); // For digital products section's right column

    const blogsSection = document.getElementById('blogs-section'); // New blogs section
    const horizontalScrollWrapper = document.querySelector('.horizontal-scroll-wrapper'); // Added this selector back
    const videoCardsContainer = document.querySelector('.horizontal-scroll-container'); // Select by class now


    mm.add("(min-width: 1080px)", () => { // Target desktop screens (adjust breakpoint if needed)

        // ===========================================
        // GSAP CODE FOR HERO SECTION (Splitting & Scaling)
        // ===========================================

        gsap.set(digitalProductsSection, { scale: 0.8, yPercent: 20, opacity: 0 });

        let splitScreenTL = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                // markers: true, // Uncomment for debugging markers
            }
        });

        splitScreenTL.to(heroImageWrapper, { xPercent: 100, ease: "power2.in" }, 0)
        .to(heroTextWrapper, { xPercent: -100, ease: "power2.in" }, 0)
        .to(digitalProductsSection, { scale: 1, yPercent: 0, opacity: 1, ease: "power2.out" }, 0.2);


        // ===========================================
        // GSAP CODE FOR DIGITAL PRODUCTS SECTION (Pinning with Internal Scroll)
        // ===========================================

        // Ensure productsContainer has content to scroll
        if (productsContainer) {
            ScrollTrigger.create({
                trigger: digitalProductsSection,
                start: "top top", // When the digital products section hits the top of the viewport
                end: () => {
                    // Calculate the natural scroll height of the internal content
                    const scrollableContentHeight = productsContainer.scrollHeight - productsContainer.clientHeight;
                    // Pin for the duration of its content's scroll + a buffer
                    return `+=${scrollableContentHeight + 50}`; // Add a small buffer
                },
                pin: true,
                pinSpacing: true, // IMPORTANT: Creates space for the pinned section
                // markers: true, // UNCOMMENT THIS FOR DEBUGGING!
            });
        }


        // ===========================================
        // GSAP CODE FOR MY BLOGS SECTION (Horizontal Scroll)
        // ===========================================

        if (videoCardsContainer && horizontalScrollWrapper) { // Ensure containers exist
            // Calculate the total width of all cards + gaps
            let totalCardsWidth = videoCardsContainer.scrollWidth;
            let wrapperWidth = horizontalScrollWrapper.clientWidth; // Visible width of the wrapper

            let moveDistance = totalCardsWidth - wrapperWidth;

            // Only create the ScrollTrigger if there's actual content to scroll horizontally.
            if (moveDistance > 0) {
                let blogsScrollTL = gsap.timeline({
                    scrollTrigger: {
                        trigger: blogsSection,
                        start: "top top", // Pin the blogs section when its top hits the viewport top
                        end: "bottom top", // Pin until the bottom of the section hits the viewport top (covers 200vh height)
                        scrub: 1, // Smoothly link animation to scroll
                        pin: true, // Pin the entire blogs section
                        pinSpacing: true, // IMPORTANT: Keep spacing so next section doesn't jump up
                        // markers: true, // UNCOMMENT THIS FOR DEBUGGING!
                        onLeave: () => {
                            // Clear transform when unpinned to prevent conflicts
                            gsap.set(videoCardsContainer, { clearProps: "x" });
                        },
                        onEnterBack: () => {
                            // Clear transform when entering back to prevent conflicts
                            gsap.set(videoCardsContainer, { clearProps: "x" });
                        }
                    }
                });

                blogsScrollTL.to(videoCardsContainer, {
                    x: -moveDistance, // Move to the left by the calculated distance
                    ease: "none" // Linear movement
                });
            } else {
                console.log("Not enough cards for horizontal scroll animation or cards fit within wrapper.");
            }
        }
    }); // End of mm.add for desktop

    // ===========================================
    // GSAP MatchMedia for MOBILE Handling (Fixes for both issues)
    // ===========================================
    mm.add("(max-width: 1079px)", () => {
        // Kill ALL ScrollTriggers created on desktop
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        console.log("GSAP desktop animations killed for mobile viewport.");

        // Clear any GSAP-applied inline styles that might interfere with mobile layout
        // For hero section
        gsap.set([heroImageWrapper, heroTextWrapper], { clearProps: "xPercent, scale, yPercent, opacity" });
        // For digital products section
        gsap.set(digitalProductsSection, { clearProps: "scale, yPercent, opacity, position, top, bottom, left, right" });
        // For blogs section and its children
        gsap.set(blogsSection, { clearProps: "position, top, bottom, left, right" }); // Clear pin styles
        gsap.set(videoCardsContainer, { clearProps: "x, position, top, bottom, left, right" }); // Clear horizontal transform and absolute positioning


        // Re-enable native horizontal scrolling for the blogs section on mobile
        if (horizontalScrollWrapper) {
            horizontalScrollWrapper.style.overflowX = 'auto'; // Enable native horizontal scroll
            horizontalScrollWrapper.style.webkitOverflowScrolling = 'touch'; // For smoother iOS scrolling
            // Ensure content isn't trying to be absolute on mobile
            videoCardsContainer.style.position = 'static'; // Make sure it's back to normal flow
            videoCardsContainer.style.transform = 'translateX(0)'; // Reset any inline transforms
        }
        console.log("Mobile specific styles applied: Horizontal scroll enabled for blogs.");
    });
});