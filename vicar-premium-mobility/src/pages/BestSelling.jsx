import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import AnimatedContent from '../animation/AnimatedContent';
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import './BestSelling.css';

// 3D Model Components
function ToyotaModel({ visible = true }) {
  const { scene } = useGLTF('/Toyota Alphard 2023.glb');
  const modelRef = useRef();

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={[1.5, 1.5, 1.5]}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
      visible={visible}
    />
  );
}

function PorscheModel({ visible = true }) {
  const { scene } = useGLTF('/porsche911.glb');
  const modelRef = useRef();

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={[1.2, 1.2, 1.2]}
      position={[0, -1, 0]}
      rotation={[0, Math.PI * 0.58, 0]}
      visible={visible}
    />
  );
}

function VellfireModel({ visible = true }) {
  const { scene } = useGLTF('/Toyota_Vellfire2015.glb');
  const modelRef = useRef();

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={[12.6, 12.6, 12.6]}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
      visible={visible}
    />
  );
}

// 3D Viewer Component
function CarViewer({ currentModel, porscheLoaded, vellfireLoaded }) {
  return (
    <div className="car-viewer">
      <Canvas
        camera={{ position: [8, 2, 8], fov: 30 }}
        style={{ height: '500px', width: '100%' }}
      >
        <Suspense fallback={null}>
          {/* Stronger ambient light */}
          <ambientLight intensity={1.2} />

          {/* Directional lights from multiple directions */}
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={1.2} />
          <directionalLight position={[0, 10, -10]} intensity={1.0} />
          <directionalLight position={[0, 10, 10]} intensity={1.0} />

          {/* Point lights around the car */}
          <pointLight position={[5, 5, 5]} intensity={0.7} />
          <pointLight position={[-5, 5, 5]} intensity={0.7} />
          <pointLight position={[5, 5, -5]} intensity={0.7} />
          <pointLight position={[-5, 5, -5]} intensity={0.7} />

          {/* Overhead spotlight */}
          <spotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={0.2}
            intensity={1}
            castShadow
          />

          {/* Render current model with lazy loading  */}  
        
          <ToyotaModel visible={currentModel === 'toyota'} />
          {vellfireLoaded && <VellfireModel visible={currentModel === 'vellfire'} />}
          {porscheLoaded && <PorscheModel visible={currentModel === 'porsche'} />}
         
          <Environment preset="city" /> 

          {/* Controls  */}
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[0, 0]}
            azimuth={[-Math.PI / 1.4, 0.7854]}
          >
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={4}
              maxDistance={12}
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
            />
          </PresentationControls>
   
        </Suspense>
      </Canvas>
    </div>
  );
}

function BestSelling() {
  const { t } = useTranslation();
  
  // 3D Model navigation state
  const [currentModel, setCurrentModel] = useState('toyota');
  const [porscheLoaded, setPorscheLoaded] = useState(false);
  const [vellfireLoaded, setVellfireLoaded] = useState(false);

  // Model navigation functions
  const goToNextModel = () => {
    if (currentModel === 'toyota') {
      setCurrentModel('vellfire');
      setVellfireLoaded(true);
    } else if (currentModel === 'vellfire') {
      setCurrentModel('porsche');
      setPorscheLoaded(true);
    } else {
      setCurrentModel('toyota');
    }
  };

  const goToPreviousModel = () => {
    if (currentModel === 'toyota') {
      setCurrentModel('porsche');
      setPorscheLoaded(true);
    } else if (currentModel === 'vellfire') {
      setCurrentModel('toyota');
    } else {
      setCurrentModel('vellfire');
      setVellfireLoaded(true);
    }
  };

  return (
    <div className="best-selling-page">
      {/* Header Component */}
      <VicarHeader currentPage="best-selling" />

      <main className="main-content">
        {/* Stage Section with Spotlight and 3D Model */}
        <section className="stage-section">
          <div className="spotlight-container">
            <img src="/spotlight.png" alt="Spotlight" className="spotlight-image" />
          </div>
          
          {/* Navigation Buttons */}
          <button className="stage-nav-btn stage-nav-left" onClick={goToPreviousModel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="stage-nav-btn stage-nav-right" onClick={goToNextModel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          
          <div className="stage-content">
            <h2 className="stage-title">{t('home.stageTitle')}</h2>
            <p className="stage-description">
              {t('home.stageDescription')}
            </p>
            <div className="stage-main-content">
              <div className="model-container">
                <CarViewer currentModel={currentModel} porscheLoaded={porscheLoaded} vellfireLoaded={vellfireLoaded} />
              </div>
            </div>
            
            {/* Car Details Bullet List - Below the 3D model */}
            <div className="car-details-bullet">
              <div className="bullet-header">
                <h3 className="bullet-title">
                  {currentModel === 'toyota' ? t('home.carModel') : 
                   currentModel === 'porsche' ? t('home.porscheModel') : 
                   t('home.vellfireModel')}
                </h3>
              </div>
              
              <div className="bullet-price">
                <span className="price-amount">
                  {currentModel === 'toyota' ? t('home.estimatedPrice') : 
                   currentModel === 'porsche' ? t('home.porschePrice') : 
                   t('home.vellfirePrice')}
                </span>
              </div>
              
              <div className="bullet-features">
                <h4>{t('home.keyFeatures')}</h4>
                <ul className="features-list">
                  {currentModel === 'toyota' ? (
                    <>
                      <li>{t('home.featureLeatherSeats')}</li>
                      <li>{t('home.featureNavigation')}</li>
                      <li>{t('home.featureBluetooth')}</li>
                      <li>{t('home.featureBackupCamera')}</li>
                      <li>{t('home.featureCruiseControl')}</li>
                      <li>{t('home.featureClimateControl')}</li>
                      <li>{t('home.featurePowerWindows')}</li>
                      <li>{t('home.featureABS')}</li>
                    </>
                  ) : currentModel === 'porsche' ? (
                    <>
                      <li>{t('home.porscheFeatureEngine')}</li>
                      <li>{t('home.porscheFeatureTransmission')}</li>
                      <li>{t('home.porscheFeaturePerformance')}</li>
                      <li>{t('home.porscheFeatureInterior')}</li>
                      <li>{t('home.porscheFeatureSafety')}</li>
                      <li>{t('home.porscheFeatureTechnology')}</li>
                      <li>{t('home.porscheFeatureHandling')}</li>
                      <li>{t('home.porscheFeatureDesign')}</li>
                    </>
                  ) : (
                    <>
                      <li>{t('home.vellfireFeatureSeating')}</li>
                      <li>{t('home.vellfireFeatureSpace')}</li>
                      <li>{t('home.vellfireFeatureComfort')}</li>
                      <li>{t('home.vellfireFeatureEntertainment')}</li>
                      <li>{t('home.vellfireFeatureSafety')}</li>
                      <li>{t('home.vellfireFeatureTechnology')}</li>
                      <li>{t('home.vellfireFeatureStorage')}</li>
                      <li>{t('home.vellfireFeatureDesign')}</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="bullet-actions">
                <button 
                  className="action-btn secondary"
                  onClick={() => window.open('https://api.whatsapp.com/send/?phone=601155572999&text&type=phone_number&app_absent=0', '_blank', 'noopener,noreferrer')}
                >
                  {t('home.scheduleTestDrive')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Helpful Tools */}
        <section className="tools-section">
          <div className="container">
            <h2 className="tools-title">{t('home.helpfulTools')}</h2>
            <div className="tools-container">
              <div className="tools-scroll-container">
                <div className="tools-row">
                  <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="power2.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0.3}
                    delay={0.1}
                  >
                    <Link 
                      to="/helpful-tools/insurance-estimate"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div 
                        className="tool-card"
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-8px) scale(1.02)';
                          e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                      >
                        <div className="tool-icon-btn">
                          <svg className="tool-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                        <h3>{t('home.insuranceEstimator')}</h3>
                      </div>
                    </Link>
                  </AnimatedContent>
                  <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="power2.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0.3}
                    delay={0.2}
                  >
                    <Link 
                      to="/helpful-tools/loan-checker"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div 
                        className="tool-card"
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-8px) scale(1.02)';
                          e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                      >
                        <div className="tool-icon-btn">
                          <svg className="tool-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                        <h3>{t('home.loanChecker')}</h3>
                      </div>
                    </Link>
                  </AnimatedContent>
                  <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="power2.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0.3}
                    delay={0.3}
                  >
                    <Link 
                      to="/helpful-tools/document-checklist"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div 
                        className="tool-card"
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-8px) scale(1.02)';
                          e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                      >
                        <div className="tool-icon-btn">
                          <svg className="tool-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                        <h3>{t('home.documentChecklist')}</h3>
                      </div>
                    </Link>
                  </AnimatedContent>
                  <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="power2.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0.3}
                    delay={0.4}
                  >
                    <div 
                      className="tool-card"
                      onClick={() => window.open('https://scrut.my/', '_blank', 'noopener,noreferrer')}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-8px) scale(1.02)';
                        e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                      }}
                    >
                      <div className="tool-icon-btn">
                        <svg className="tool-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      <h3>{t('home.checkCar')}</h3>
                    </div>
                  </AnimatedContent>
                  <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="power2.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0.3}
                    delay={0.5}
                  >
                    <Link 
                      to="/car-recommendation"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div 
                        className="tool-card"
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-8px) scale(1.02)';
                          e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                      >
                        <div className="tool-icon-btn">
                          <svg className="tool-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                        <h3>{t('home.findCarMatch')}</h3>
                      </div>
                    </Link>
                  </AnimatedContent>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <VicarFooter />

      {/* Floating Car Button */}
      <FloatingCarButton />
   
    </div>
  );
}

export default BestSelling;

