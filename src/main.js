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

        ScrollTrigger.create({
            trigger: digitalProductsSection,
            start: "top top",
            end: () => {
                const scrollableContentHeight = productsContainer.scrollHeight - productsContainer.clientHeight;
                return `+=${scrollableContentHeight + 20}`; // Add a small buffer
            },
            pin: true,
            pinSpacing: true,
            // markers: true, // UNCOMMENT FOR DEBUGGING
            onLeave: () => { /* optional cleanup */ },
            onEnterBack: () => { /* optional cleanup */ }
        });


        // ===========================================
        // GSAP CODE FOR MY BLOGS SECTION (Horizontal Scroll)
        // ===========================================

        if (videoCardsContainer) { // Ensure the container exists
            // Calculate the total width of all cards + gaps
            let totalCardsWidth = videoCardsContainer.scrollWidth;
            let wrapperWidth = videoCardsContainer.parentElement.clientWidth; // Width of the visible wrapper

            // The distance to translate the cards container
            // We want to move it left by the amount that extends beyond the wrapper
            // minus the wrapper's width, plus any gap to ensure the last card aligns.
            let moveDistance = totalCardsWidth - wrapperWidth;

            // Get the computed gap value
            const style = window.getComputedStyle(videoCardsContainer);
            const gap = parseFloat(style.gap) || 0;

            // Adjust moveDistance to account for the gap and ensure the last card is fully visible
            // If there are N cards and N-1 gaps, the last gap might be partially off-screen.
            // A common approach is to move by (total content width - viewport width)
            // You might need to fine-tune this 'buffer' based on your exact card widths and gaps.
            // For example, if you want the last card to align perfectly to the right edge.
            // Let's try to align the start of the first card to the left and the end of the last card to the right.
            // The animation will be from x: 0 to x: -moveDistance.

            // If you want the *last* card to perfectly align to the right edge of the wrapper,
            // the `x` value should be `-(totalCardsWidth - wrapperWidth)`.
            // If there's a gap after the last card, you might need to subtract that.
            // Let's use a simple calculation first and then debug with markers.

            let blogsScrollTL = gsap.timeline({
                scrollTrigger: {
                    trigger: blogsSection,
                    start: "top top", // Pin the blogs section when its top hits the viewport top
                    end: () => `+=${moveDistance + gap * 2}`, // Pin for the duration of the horizontal scroll. Add buffer.
                    scrub: 1, // Smoothly link animation to scroll
                    pin: true, // Pin the entire blogs section
                    pinSpacing: true, // Keep spacing so next section doesn't jump up
                    // markers: true, // UNCOMMENT THIS FOR DEBUGGING!
                    onLeave: () => {
                        gsap.set(videoCardsContainer, { clearProps: "x" }); // Clear transform when unpinned
                    },
                    onEnterBack: () => {
                        gsap.set(videoCardsContainer, { clearProps: "x" }); // Clear transform when entering back
                    }
                }
            });

            blogsScrollTL.to(videoCardsContainer, {
                x: -moveDistance, // Move to the left by the calculated distance
                ease: "none" // Linear movement
            });
        }

    }); // End of mm.add for desktop

    // Optional: Mobile/Tablet handling (uncomment and adjust if needed)
    /*
    mm.add("(max-width: 1079px)", () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.set([heroImageWrapper, heroTextWrapper, digitalProductsSection, videoCardsContainer], { clearProps: "all" });
        // Ensure mobile-specific CSS rules are active and desktop overrides are cleared for relevant sections
    });
    */
});