document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('galaxyCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasDimensions();
    
    // Detect device type for performance optimizations
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    // Adjust star count based on device
    const getStarCount = () => {
        if (isMobile) return 400; // Fewer stars on mobile
        if (isTablet) return 600; // Medium amount on tablets
        return 800; // Full amount on desktop
    };
    
    // Variables for stars and their properties
    const stars = [];
    const numStars = getStarCount();
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let mouseX = centerX;
    let mouseY = centerY;
    
    // Create stars
    function createStars() {
        stars.length = 0; // Clear any existing stars
        
        for (let i = 0; i < numStars; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.4;
            const spiral = Math.random() * Math.PI * 4;
            
            stars.push({
                x: centerX + Math.cos(angle + spiral) * distance,
                y: centerY + Math.sin(angle + spiral) * distance,
                radius: Math.random() * (isMobile ? 1.2 : 1.5) + 0.5,
                originalX: centerX + Math.cos(angle + spiral) * distance,
                originalY: centerY + Math.sin(angle + spiral) * distance,
                angle: angle,
                distance: distance,
                spiral: spiral,
                // Slower animation on mobile for performance
                speed: 0.002 + Math.random() * (isMobile ? 0.002 : 0.003),
                hue: Math.random() * 60 + 200, // Blue to purple range
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    createStars();
    
    // Track mouse movement (use touch events for mobile)
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Add touch support for mobile
    window.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            e.preventDefault(); // Prevent scrolling while touching
        }
    });
    
    // Mobile optimization: reduce animation frame rate
    let frameSkip = 0;
    const frameSkipRate = isMobile ? 3 : 1; // Skip frames on mobile
    
    // Animation loop
    function animate() {
        // Frame skipping for performance on mobile
        if (isMobile && frameSkip < frameSkipRate) {
            frameSkip++;
            requestAnimationFrame(animate);
            return;
        }
        frameSkip = 0;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mouse influence factor (reduced on mobile)
        const influenceFactor = isMobile ? 0.01 : 0.02;
        const mouseOffsetX = (mouseX - centerX) * influenceFactor;
        const mouseOffsetY = (mouseY - centerY) * influenceFactor;
        
        // Update and draw stars
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            
            // Update star position - create spiral motion
            star.angle += star.speed;
            star.x = star.originalX + mouseOffsetX * (star.distance / 100);
            star.y = star.originalY + mouseOffsetY * (star.distance / 100);
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            
            // Create gradient for star
            const gradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.radius * 2
            );
            gradient.addColorStop(0, `hsla(${star.hue}, 100%, 70%, ${star.opacity})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize properly
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize to prevent performance issues
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setCanvasDimensions();
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
            
            // Recreate stars for new dimensions
            createStars();
        }, 250);
    });
    
    // Handle device orientation changes for mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            setCanvasDimensions();
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
            createStars();
        }, 300);
    });
    
    animate();
});