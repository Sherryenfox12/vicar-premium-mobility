import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import VicarFooter from './components/VicarFooter';
import './RenderPage.css';

// 3D Model Component with Door Animation
function ToyotaModel({ isDoorOpen, onDoorToggle }) {
  const { scene } = useGLTF('/Toyota Alphard 2023.glb');
  const modelRef = useRef();
  const doorRef = useRef();
  
  // Find the door mesh in the model
  React.useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Look for door-related meshes (common names for car doors)
          const meshName = child.name.toLowerCase();
          if (meshName.includes('door') || meshName.includes('front_door') || 
              meshName.includes('door_front') || meshName.includes('door_l') || 
              meshName.includes('door_r') || meshName.includes('door_fl') || 
              meshName.includes('door_fr')) {
            doorRef.current = child;
            console.log('Found door mesh:', child.name);
          }
        }
      });
    }
  }, [scene]);

  // Animate door opening/closing
  useFrame(() => {
    if (doorRef.current) {
      const targetRotation = isDoorOpen ? Math.PI / 2 : 0; // 90 degrees when open
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.1
      );
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={[1, 1, 1]}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// 3D Viewer Component
function CarViewer({ isDoorOpen, onDoorToggle }) {
  return (
    <div className="car-viewer">
      <Canvas
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ height: '400px', width: '100%' }}
      >
        <Suspense fallback={null}>
          <ToyotaModel isDoorOpen={isDoorOpen} onDoorToggle={onDoorToggle} />
          <Environment preset="city" />
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, 0.7854]}
          >
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={10}
            />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

function RenderPage() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  const handleDoorToggle = () => {
    setIsDoorOpen(!isDoorOpen);
  };

  return (
    <div className="render-page">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h1>Vicar Best Recond Car Dealer</h1>
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#vehicles">Vehicles</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Find Your Perfect Reconditioned Car</h2>
            <p>Quality vehicles at competitive prices with full warranty</p>
            <button className="cta-button">Browse Vehicles</button>
          </div>
        </section>

        {/* 3D Car Viewer Section */}
        <section className="car-viewer-section">
          <div className="container">
            <h3>Interactive 3D Car Viewer</h3>
            <p className="viewer-description">
              Explore our Toyota Alphard 2023 in stunning 3D detail. 
              Use your mouse to rotate, zoom, and examine every angle.
            </p>
            <div className="viewer-container">
              <CarViewer isDoorOpen={isDoorOpen} onDoorToggle={handleDoorToggle} />
            </div>
            <div className="car-controls">
              <button 
                className={`door-toggle-btn ${isDoorOpen ? 'door-open' : 'door-closed'}`}
                onClick={handleDoorToggle}
              >
                {isDoorOpen ? 'Close Door' : 'Open Door'}
              </button>
            </div>
            <div className="car-info">
              <h4>Toyota Alphard 2023</h4>
              <p className="car-price">$45,000</p>
              <p className="car-specs">
                <strong>Specifications:</strong><br/>
                • Engine: 2.5L Hybrid<br/>
                • Transmission: CVT<br/>
                • Mileage: 15,000 km<br/>
                • Fuel Type: Hybrid<br/>
                • Seating: 7 passengers<br/>
                • Condition: Excellent
              </p>
              <button className="view-details-btn">View Full Details</button>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h3>Why Choose Vicar?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚗</div>
                <h4>Quality Assurance</h4>
                <p>All vehicles undergo thorough inspection and reconditioning</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h4>Full Warranty</h4>
                <p>Comprehensive warranty coverage on all our vehicles</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h4>Best Prices</h4>
                <p>Competitive pricing with flexible financing options</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔧</div>
                <h4>Expert Service</h4>
                <p>Professional maintenance and support team</p>
              </div>
            </div>
          </div>
        </section>

        <section className="vehicles-section">
          <div className="container">
            <h3>Featured Vehicles</h3>
            <div className="vehicles-grid">
              <div className="vehicle-card">
                <div className="vehicle-image">
                  <img src="https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Car+1" alt="Vehicle 1" />
                </div>
                <div className="vehicle-info">
                  <h4>Toyota Camry 2020</h4>
                  <p className="vehicle-price">$18,500</p>
                  <p className="vehicle-details">Mileage: 45,000 km | Fuel: Petrol</p>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
              <div className="vehicle-card">
                <div className="vehicle-image">
                  <img src="https://via.placeholder.com/300x200/50C878/FFFFFF?text=Car+2" alt="Vehicle 2" />
                </div>
                <div className="vehicle-info">
                  <h4>Honda Civic 2019</h4>
                  <p className="vehicle-price">$16,800</p>
                  <p className="vehicle-details">Mileage: 52,000 km | Fuel: Petrol</p>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
              <div className="vehicle-card">
                <div className="vehicle-image">
                  <img src="https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Car+3" alt="Vehicle 3" />
                </div>
                <div className="vehicle-info">
                  <h4>Nissan Altima 2021</h4>
                  <p className="vehicle-price">$22,300</p>
                  <p className="vehicle-details">Mileage: 38,000 km | Fuel: Petrol</p>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <VicarFooter />
    </div>
  );
}

export default RenderPage; 