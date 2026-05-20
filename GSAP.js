
        // Initialize GSAP Animations after content loads
     window.addEventListener('load', () => {
            gsap.registerPlugin(ScrollTrigger);
            
            // Animation for cards appearing as you scroll
            gsap.from(".product-card", {
                duration: 1,
                y: 100,
                opacity: 0,
                rotationX: -15,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: ".marketplace-grid",
                    start: "top 80%",
                }
            });
        });
