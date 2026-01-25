import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { FaCar, FaCarSide, FaTools, FaThumbsUp, FaUserCheck, FaUsers, FaHeadset, FaArrowRight, FaHome } from 'react-icons/fa';
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import './CarRecommendation.css';

function CarRecommendation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [userTags, setUserTags] = useState([]);
  const { t } = useTranslation();

  // Quiz questions data with translations
  const getQuizData = () => [
    {
      id: 'intro',
      type: 'intro',
      title: t('carRec.introTitle'),
      subtitle: t('carRec.introSubtitle')
    },
    {
      id: 'weekend',
      type: 'question',
      question: t('carRec.questionWeekend'),
      options: [
        { text: t('carRec.weekendBeach'), tags: ['comfort', 'spacious', 'luxury'] },
        { text: t('carRec.weekendCity'), tags: ['compact', 'city'] },
        { text: t('carRec.weekendTrack'), tags: ['sporty', 'performance'] },
        { text: t('carRec.weekendCamping'), tags: ['suv', 'rugged', 'offroad'] }
      ]
    },
    {
      id: 'crew',
      type: 'question',
      question: t('carRec.questionCrew'),
      options: [
        { text: t('carRec.crewJustMe'), tags: ['2seater', 'compact'] },
        { text: t('carRec.crewMePlusOne'), tags: ['2seater', 'coupe', 'compact'] },
        { text: t('carRec.crewSmallFamily'), tags: ['sedan', 'suv', '3to5seater'] },
        { text: t('carRec.crewBigFamily'), tags: ['mpv', '6to8seater'] }
      ]
    },
    {
      id: 'budget',
      type: 'question',
      question: t('carRec.questionBudget'),
      options: [
        { text: t('carRec.budgetBelow100k'), tags: ['budget0to100k'] },
        { text: t('carRec.budget100kto200k'), tags: ['budget100kto200k'] },
        { text: t('carRec.budget200kto300k'), tags: ['budget200kto300k'] },
        { text: t('carRec.budget300kPlus'), tags: ['budget300kplus'] }
      ]
    },
    {
      id: 'personality',
      type: 'question',
      question: t('carRec.questionPersonality'),
      options: [
        { text: t('carRec.personalityRelaxed'), tags: ['comfort', 'luxury'] },
        { text: t('carRec.personalitySpeed'), tags: ['sporty', 'performance'] },
        { text: t('carRec.personalityPractical'), tags: ['fuel-efficient', 'compact'] },
        { text: t('carRec.personalityAdventure'), tags: ['suv', 'rugged', 'offroad'] }
      ]
    },
    {
      id: 'bodyStyle',
      type: 'question',
      question: t('carRec.questionBodyStyle'),
      options: [
        { text: t('carRec.bodyStyleSedan'), tags: ['sedan'] },
        { text: t('carRec.bodyStyleSUV'), tags: ['suv'] },
        { text: t('carRec.bodyStyleMPV'), tags: ['mpv'] },
        { text: t('carRec.bodyStyleHatchback'), tags: ['hatchback'] },
        { text: t('carRec.bodyStyleSports'), tags: ['coupe', 'convertible'] }
      ]
    },
    {
      id: 'features',
      type: 'question',
      question: t('carRec.questionFeatures'),
      options: [
        { text: t('carRec.featureSpacious'), tags: ['spacious'] },
        { text: t('carRec.featureTech'), tags: ['technology', 'safety'] },
        { text: t('carRec.featureSpeed'), tags: ['performance'] },
        { text: t('carRec.featureFuel'), tags: ['fuel-efficient'] }
      ]
    },
    {
      id: 'environment',
      type: 'question',
      question: t('carRec.questionEnvironment'),
      options: [
        { text: t('carRec.envCity'), tags: ['city'] },
        { text: t('carRec.envHighway'), tags: ['comfort', 'spacious'] },
        { text: t('carRec.envMountain'), tags: ['rugged', 'offroad'] },
        { text: t('carRec.envMixed'), tags: ['versatile'] }
      ]
    },
    {
      id: 'brandOrigin',
      type: 'question',
      question: t('carRec.questionBrandOrigin'),
      options: [
        { text: t('carRec.brandJapan'), tags: ['japan'] },
        { text: t('carRec.brandGermany'), tags: ['germany'] },
        { text: t('carRec.brandMalaysia'), tags: ['malaysia'] },
        { text: t('carRec.brandAnything'), tags: [] }
      ]
    },
    {
      id: 'status',
      type: 'question',
      question: t('carRec.questionStatus'),
      options: [
        { text: t('carRec.statusLuxury'), tags: ['luxury', 'stylish'] },
        { text: t('carRec.statusReliable'), tags: ['practical', 'fuel-efficient'] },
        { text: t('carRec.statusHeads'), tags: ['sporty', 'performance'] }
      ]
    }
  ];

  const quizData = getQuizData();

  // Reset to first question on refresh
  useEffect(() => {
    setCurrentStep(0);
    setUserAnswers({});
    setUserTags([]);
  }, []);

  const handleAnswer = (questionId, selectedTags) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedTags
    }));
    
    // Add tags to userTags array
    setUserTags(prev => [...prev, ...selectedTags]);
    
    // Move to next question
    if (currentStep < quizData.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStartQuiz = () => {
    setCurrentStep(1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getCurrentQuestion = () => {
    return quizData[currentStep];
  };

  const renderIntroScreen = () => (
    <div className="quiz-intro">
      <div className="intro-content">
        <h1 className="intro-title">{quizData[0].title}</h1>
        <p className="intro-subtitle">{quizData[0].subtitle}</p>
        <button className="start-quiz-btn" onClick={handleStartQuiz}>
          {t('carRec.startQuiz')}
        </button>
      </div>
    </div>
  );

  const renderQuestion = (question) => (
    <div className="quiz-question">
      <div className="question-header">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep) / (quizData.length - 1)) * 100}%` }}
          ></div>
        </div>
        <span className="question-number">{t('carRec.questionNumber')} {currentStep} {t('carRec.of')} {quizData.length - 1}</span>
      </div>
      
      <h2 className="question-title">{question.question}</h2>
      
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleAnswer(question.id, option.tags)}
          >
            <span className="option-text">{option.text}</span>
          </button>
        ))}
      </div>
      
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button className="nav-btn prev-btn" onClick={handlePrevious}>
            {t('carRec.previous')}
          </button>
        )}
        <div className="step-indicators">
          {quizData.slice(1).map((_, index) => (
            <div
              key={index}
              className={`step-dot ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    // Car database with tags
    const carDatabase = [
      { model: "Toyota Alphard", tags: ["mpv", "luxury", "spacious", "comfort", "japan", "6to8seater", "budget300kplus"] },
      { model: "Toyota Vellfire", tags: ["mpv", "luxury", "spacious", "comfort", "japan", "6to8seater", "budget300kplus"] },
      { model: "Toyota Corolla", tags: ["sedan", "practical", "fuel-efficient", "japan", "3to5seater", "budget100kto200k"] },
      { model: "Lexus RX350", tags: ["suv", "luxury", "comfort", "japan", "3to5seater", "budget300kplus"] },
      { model: "Suzuki Swift", tags: ["hatchback", "compact", "city", "japan", "sporty", "budget100kto200k"] },
      { model: "Suzuki Jimny", tags: ["suv", "compact", "offroad", "japan", "budget100kto200k"] },
      { model: "Toyota Supra", tags: ["coupe", "sporty", "performance", "japan", "budget300kplus"] },
      { model: "Benz A35", tags: ["hatchback", "sporty", "germany", "performance", "budget300kplus"] },
      { model: "Lexus UX200", tags: ["suv", "luxury", "compact", "japan", "budget300kplus"] },
      { model: "Toyota Land Cruiser", tags: ["suv", "rugged", "offroad", "japan", "luxury", "6to8seater", "budget300kplus"] },
      { model: "Toyota Harrier", tags: ["suv", "luxury", "comfort", "japan", "budget300kplus"] },
      { model: "Mazda Roadster (MX-5)", tags: ["convertible", "sporty", "compact", "japan", "2seater", "budget300kplus"] },
      { model: "Honda Jazz", tags: ["hatchback", "compact", "city", "japan", "fuel-efficient", "budget100kto200k"] },
      { model: "Toyota GR Yaris", tags: ["hatchback", "sporty", "japan", "performance", "budget300kplus"] },
      { model: "Mini Cooper S 2.0 JCW", tags: ["hatchback", "sporty", "germany", "compact", "budget300kplus"] },
      { model: "Perodua Axia", tags: ["hatchback", "compact", "malaysia", "budget0to100k", "fuel-efficient"] },
      { model: "Porsche Macan", tags: ["suv", "luxury", "germany", "sporty", "budget300kplus"] },
      { model: "Lexus NX250", tags: ["suv", "luxury", "comfort", "japan", "budget300kplus"] },
      { model: "Benz A180", tags: ["hatchback", "germany", "compact", "luxury", "budget300kplus"] },
      { model: "Honda N-Box 660", tags: ["kei", "compact", "japan", "city", "budget100kto200k"] },
      { model: "Benz GLE53", tags: ["suv", "germany", "luxury", "performance", "budget300kplus"] },
      { model: "Toyota GR86", tags: ["coupe", "sporty", "japan", "performance", "budget300kplus"] },
      { model: "Toyota Voxy", tags: ["mpv", "comfort", "japan", "spacious", "6to8seater", "budget300kplus"] },
      { model: "Honda Civic FK8", tags: ["sedan", "sporty", "japan", "performance", "budget300kplus"] },
      { model: "BMW 318i", tags: ["sedan", "germany", "compact", "luxury", "budget300kplus"] },
      { model: "BMW X5", tags: ["suv", "germany", "luxury", "spacious", "budget300kplus"] }
    ];

    // Calculate match scores for each car
    const carScores = carDatabase.map(car => {
      let score = 0;
      let matchedTags = [];
      
      userTags.forEach(userTag => {
        if (car.tags.includes(userTag)) {
          score += 1;
          if (!matchedTags.includes(userTag)) {
            matchedTags.push(userTag);
          }
        }
      });
      
      return {
        model: car.model,
        score: score,
        matchedTags: matchedTags,
        totalTags: car.tags.length
      };
    });

    // Sort cars by score (highest first) and get top matches
    carScores.sort((a, b) => b.score - a.score);
    
    const topMatch = carScores[0];
    const secondMatch = carScores[1];
    const thirdMatch = carScores[2];

    // Generate car description based on matched tags
    const getCarDescription = (car) => {
      if (car.matchedTags.includes('luxury') && car.matchedTags.includes('mpv')) {
        return t('carRec.descriptionLuxuryMPV');
      } else if (car.matchedTags.includes('sporty') && car.matchedTags.includes('performance')) {
        return t('carRec.descriptionSports');
      } else if (car.matchedTags.includes('suv') && car.matchedTags.includes('offroad')) {
        return t('carRec.descriptionSUV');
      } else if (car.matchedTags.includes('compact') && car.matchedTags.includes('city')) {
        return t('carRec.descriptionCompact');
      } else if (car.matchedTags.includes('sedan') && car.matchedTags.includes('practical')) {
        return t('carRec.descriptionSedan');
      } else if (car.matchedTags.includes('hatchback') && car.matchedTags.includes('fuel-efficient')) {
        return t('carRec.descriptionHatchback');
      } else {
        return t('carRec.descriptionDefault');
      }
    };

    return (
      <div className="quiz-results">
        <div className="results-content">
          <h1 className="results-title">{t('carRec.resultsTitle')}</h1>
          
          {/* Top Match */}
          <div className="top-match">
            <h2 className="car-model">{t('carRec.carModelQuestion')} {topMatch.model}?</h2>
            <p className="car-description">{getCarDescription(topMatch)}</p>
            <div className="browse-action">
              <button 
                className="browse-btn"
                onClick={() => {
                  const [brand, ...modelParts] = topMatch.model.split(' ');
                  const model = modelParts.join(' ').toLowerCase();
                 // const url = `https://app.kw99.com.my/app-browse?brand=${brand.toLowerCase()}&model=${model}`;
                 const url = `https://api.whatsapp.com/send/?phone=601155572999&text&type=phone_number&app_absent=0`;
                  
                 window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                {t('carRec.browseCar')} {topMatch.model}
              </button>
            </div>
          </div>

          {/* Alternative Matches */}
          {secondMatch && secondMatch.score > 0 && (
            <div className="alternative-matches">
              <h3>{t('carRec.alternativeOptions')}</h3>
              <div className="alternative-cars">
                {secondMatch && (
                  <div className="alt-car">
                    <h4>{secondMatch.model}</h4>
                    <p>{getCarDescription(secondMatch)}</p>
                    <span className="score-badge small">{t('carRec.score')} {secondMatch.score}/{secondMatch.totalTags}</span>
                  </div>
                )}
                {thirdMatch && thirdMatch.score > 0 && (
                  <div className="alt-car">
                    <h4>{thirdMatch.model}</h4>
                    <p>{getCarDescription(thirdMatch)}</p>
                    <span className="score-badge small">{t('carRec.score')} {thirdMatch.score}/{thirdMatch.totalTags}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="results-summary">
            <h3>{t('carRec.preferencesSummary')}</h3>
            <div className="tags-display">
              {userTags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="results-actions">
            <button className="action-btn primary" onClick={() => navigate('/')}>
              <FaHome /> {t('carRec.backToHome')}
            </button>
            <button className="action-btn secondary" onClick={() => {
              setCurrentStep(0);
              setUserAnswers({});
              setUserTags([]);
            }}>
              {t('carRec.takeQuizAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const currentQuestion = getCurrentQuestion();
    
    if (currentStep === 0) {
      return renderIntroScreen();
    } else if (currentStep === quizData.length - 1) {
      return renderResults();
    } else {
      return renderQuestion(currentQuestion);
    }
  };

  return (
    <div className="car-recommendation-page">
      <VicarHeader currentPage="car-recommendation" />
      
      <main className="quiz-container">
        {renderContent()}
      </main>
      
      {/* Footer Component */}
      <VicarFooter />
    </div>
  );
}

export default CarRecommendation;

