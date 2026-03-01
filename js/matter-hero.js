// matter-hero.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('matter-canvas');
    if (!container) return;

    // Words to drop
    const words = [
        { text: 'STUDIO', type: 'accent' },
        { text: 'WordPress', type: 'default' },
        { text: 'HTML', type: 'default' },
        { text: 'CSS', type: 'default' },
        { text: 'JavaScript', type: 'accent' },
        { text: 'Design', type: 'default' },
        { text: 'UI/UX', type: 'default' },
        { text: 'Responsive', type: 'default' },
        { text: 'Speed', type: 'default' }
    ];

    // Matter.js modules
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;

    // Create an invisible canvas for setup, though we render via DOM
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            background: 'transparent',
            wireframes: false,
            pixelRatio: window.devicePixelRatio
        }
    });

    // Track references linking DOM elements to Matter bodies
    const domBodies = [];

    // Create elements and bodies
    words.forEach((word) => {
        // 1. Create DOM element
        const el = document.createElement('div');
        el.classList.add('matter-el');
        if (word.type === 'accent') {
            el.setAttribute('data-type', 'accent');
        }
        el.textContent = word.text;
        container.appendChild(el);

        // Get true width/height from DOM
        const rect = el.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        // 2. Create Matter body
        // Randomize initial positions at the top
        const startX = Math.random() * (container.clientWidth - w - 40) + 20 + w / 2;
        const startY = -Math.random() * 500 - h;

        const body = Bodies.rectangle(startX, startY, w, h, {
            restitution: 0.6, // Bounciness
            friction: 0.1,
            density: 0.001,
            render: { visible: false } // Hide canvas render, we rely on DOM
        });

        // Give elements random slight rotation
        Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.5);

        domBodies.push({
            dom: el,
            body: body,
            w: w,
            h: h
        });

        Composite.add(world, body);
    });

    // Borders
    const wallOptions = {
        isStatic: true,
        render: { visible: false }
    };
    const thickness = 60;

    let floor, leftWall, rightWall, ceiling;

    function createBorders() {
        const w = container.clientWidth;
        const h = container.clientHeight;

        floor = Bodies.rectangle(w / 2, h + thickness / 2, w + 200, thickness, wallOptions);
        leftWall = Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 3, wallOptions);
        rightWall = Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 3, wallOptions);
        // Add slightly bouncy ceiling to keep them from flying away forever
        ceiling = Bodies.rectangle(w / 2, -h, w * 2, thickness, wallOptions);

        Composite.add(world, [floor, leftWall, rightWall, ceiling]);
    }

    createBorders();

    // Mouse interaction
    const mouse = Mouse.create(container); // attach to container instead of render.canvas to grab anywhere
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Sync DOM elements with bodies
    Events.on(engine, 'afterUpdate', function () {
        for (let i = 0; i < domBodies.length; i++) {
            const db = domBodies[i];
            const pos = db.body.position;
            const angle = db.body.angle;

            // Transform DOM element
            db.dom.style.transform = `translate(${pos.x - db.w / 2}px, ${pos.y - db.h / 2}px) rotate(${angle}rad)`;
        }
    });

    // Run the engine
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Responsive resize
    window.addEventListener('resize', () => {
        render.canvas.width = container.clientWidth;
        render.canvas.height = container.clientHeight;
        render.options.width = container.clientWidth;
        render.options.height = container.clientHeight;

        // Recreate walls
        Composite.remove(world, [floor, leftWall, rightWall, ceiling]);
        createBorders();
    });
});
