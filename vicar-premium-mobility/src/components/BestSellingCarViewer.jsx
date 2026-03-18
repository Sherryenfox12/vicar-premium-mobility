import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import './BestSellingCarViewer.css';

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
    <div className="best-selling-car-viewer__canvas">
      <Canvas
        camera={{ position: [8, 2, 8], fov: 30 }}
        style={{ height: '500px', width: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={1.2} />
          <directionalLight position={[0, 10, -10]} intensity={1.0} />
          <directionalLight position={[0, 10, 10]} intensity={1.0} />
          <pointLight position={[5, 5, 5]} intensity={0.7} />
          <pointLight position={[-5, 5, 5]} intensity={0.7} />
          <pointLight position={[5, 5, -5]} intensity={0.7} />
          <pointLight position={[-5, 5, -5]} intensity={0.7} />
          <spotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={0.2}
            intensity={1}
            castShadow
          />

          <ToyotaModel visible={currentModel === 'toyota'} />
          {vellfireLoaded && <VellfireModel visible={currentModel === 'vellfire'} />}
          {porscheLoaded && <PorscheModel visible={currentModel === 'porsche'} />}

          <Environment preset="city" />

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

/**
 * Shared 3D best-selling car viewer. Use on recon-car service details or best-selling page.
 * @param {string} title - Section title (e.g. "Our Best Selling Car Models")
 * @param {string} description - Optional section description
 * @param {boolean} showDetails - Whether to show model details (price, features, CTA)
 */
function BestSellingCarViewer({ title, description, showDetails = false }) {
  const { t } = useTranslation();
  const [currentModel, setCurrentModel] = useState('toyota');
  const [porscheLoaded, setPorscheLoaded] = useState(false);
  const [vellfireLoaded, setVellfireLoaded] = useState(false);

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
    <section className="best-selling-car-viewer">
      <button
        type="button"
        className="best-selling-car-viewer__nav best-selling-car-viewer__nav--left"
        onClick={goToPreviousModel}
        aria-label="Previous model"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        className="best-selling-car-viewer__nav best-selling-car-viewer__nav--right"
        onClick={goToNextModel}
        aria-label="Next model"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="best-selling-car-viewer__content">
        {title && <h2 className="best-selling-car-viewer__title">{title}</h2>}
        {description && <p className="best-selling-car-viewer__description">{description}</p>}
        <div className="best-selling-car-viewer__main">
          <div className="best-selling-car-viewer__model-container">
            <CarViewer
              currentModel={currentModel}
              porscheLoaded={porscheLoaded}
              vellfireLoaded={vellfireLoaded}
            />
          </div>
        </div>

        {showDetails && (
          <div className="best-selling-car-viewer__details">
            <div className="best-selling-car-viewer__details-header">
              <h3 className="best-selling-car-viewer__details-title">
                {currentModel === 'toyota'
                  ? t('home.carModel')
                  : currentModel === 'porsche'
                    ? t('home.porscheModel')
                    : t('home.vellfireModel')}
              </h3>
            </div>
            <div className="best-selling-car-viewer__details-price">
              <span className="best-selling-car-viewer__price-amount">
                {currentModel === 'toyota'
                  ? t('home.estimatedPrice')
                  : currentModel === 'porsche'
                    ? t('home.porschePrice')
                    : t('home.vellfirePrice')}
              </span>
            </div>
            <div className="best-selling-car-viewer__details-features">
              <h4>{t('home.keyFeatures')}</h4>
              <ul className="best-selling-car-viewer__features-list">
                {currentModel === 'toyota' && (
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
                )}
                {currentModel === 'porsche' && (
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
                )}
                {currentModel === 'vellfire' && (
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
            <div className="best-selling-car-viewer__details-actions">
              <button
                type="button"
                className="best-selling-car-viewer__action-btn"
                onClick={() =>
                  window.open(
                    'https://api.whatsapp.com/send/?phone=601155532999&text&type=phone_number&app_absent=0',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                {t('home.scheduleTestDrive')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BestSellingCarViewer;
