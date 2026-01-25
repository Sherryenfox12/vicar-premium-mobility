import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import AnimatedContent from '../animation/AnimatedContent';
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import ContactUsButton from '../components/ContactUsButton';
import './HelpfulTools.css';

// Insurance Calculator Component
function InsuranceCalculator() {
  const { t } = useTranslation();
  const [marketValue, setMarketValue] = useState("");
  const [coverageType, setCoverageType] = useState("");
  const [region, setRegion] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [noClaimDiscount, setNoClaimDiscount] = useState("");
  const [estimatedPremium, setEstimatedPremium] = useState(null);

  // Function to format numbers with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === "") return "";
    
    // Convert to number and handle decimal places
    const number = parseFloat(num);
    if (isNaN(number)) return "";
    
    // Split into integer and decimal parts
    const parts = number.toFixed(2).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Return with decimal part
    return `${formattedInteger}.${decimalPart}`;
  };

  // Function to format input numbers with commas (for display)
  const formatInputNumber = (num) => {
    if (num === null || num === undefined || num === "") return "";
    
    // Remove any existing commas and convert to number
    const cleanNum = num.toString().replace(/,/g, '');
    const number = parseFloat(cleanNum);
    
    if (isNaN(number)) return cleanNum;
    
    // Add commas to the number
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to handle input changes and format numbers
  const handleInputChange = (setter, value) => {
    // Remove commas for calculation
    const cleanValue = value.replace(/,/g, '');
    setter(cleanValue);
  };

  const calculateInsurance = () => {
    const value = parseFloat(marketValue) || 0;
    
    if (value <= 0 || !coverageType || !region || !engineCapacity || !noClaimDiscount) {
      alert(t('tools.fillAllFields'));
      return;
    }

    // Base premium table (simplified PIAM reference)
    const basePremiumTable = {
      "0-1400 cc": 437.10,
      "1401-1650cc": 747.10,
      "1651-2200cc": 972.10,
      "2201-3050cc": 1302.10,
      "3051-4100cc": 2147.10,
      "4101-4250cc": 2487.10,
      "4251-4400cc": 2702.10,
      "Over 4400cc": 2902.10,
    };

    // NCD mapping
    const ncdRates = {
      "None - 0%": 0,
      "First Year - 25%": 0.25,
      "Second Year - 30%": 0.30,
      "Third year - 38.33%": 0.3833,
      "Fourth year - 45%": 0.45,
      "fifth or more year - 55%": 0.55,
    };

    let basePremium = basePremiumTable[engineCapacity] || 0;

    // Loading for Sum Insured (rough 1-3%)
    let loading = (value * 0.025); // assume 2.5% of market value

    let grossPremium = basePremium + loading;

    // Region adjustment (Sabah/Sarawak slightly cheaper in old tariff, we simulate -5%)
    if (region !== "Peninsular Malaysia") {
      grossPremium *= 0.95;
    }

    // Third party is usually cheaper (~60% of comprehensive)
    if (coverageType === "Third party") {
      grossPremium *= 0.6;
    }

    // Apply NCD discount
    let discountRate = ncdRates[noClaimDiscount] || 0;
    let discounted = grossPremium * (1 - discountRate);

    // Add RM10 stamp duty + 6% SST
    let total = discounted + 10;
    total *= 1.06;

    setEstimatedPremium(total.toFixed(2));
  };

  const resetCalculator = () => {
    setMarketValue("");
    setCoverageType("");
    setRegion("");
    setEngineCapacity("");
    setNoClaimDiscount("");
    setEstimatedPremium(null);
  };

  return (
    <div className="loan-calculator">
      <div className="calculator-container">
        <h3 className="calculator-title">{t('tools.insurancePremiumEstimator')}</h3>
        
        <div className="input-group">
          <label className="input-label">{t('tools.marketValue')}</label>
          <input
            type="text"
            value={formatInputNumber(marketValue)}
            onChange={(e) => handleInputChange(setMarketValue, e.target.value)}
            className="calculator-input"
            placeholder={t('tools.marketValuePlaceholder')}
            min="0"
          />
        </div>

        <div className="input-group">
          <label className="input-label">{t('tools.coverageType')}</label>
          <select
            value={coverageType}
            onChange={(e) => setCoverageType(e.target.value)}
            className="calculator-input"
          >
            <option value="">{t('tools.selectCoverageType')}</option>
            <option value="Comprehensive">{t('tools.comprehensive')}</option>
            <option value="Third party">{t('tools.thirdParty')}</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">{t('tools.region')}</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="calculator-input"
          >
            <option value="">{t('tools.selectRegion')}</option>
            <option value="Peninsular Malaysia">{t('tools.peninsularMalaysia')}</option>
            <option value="Sabah/Sarawak/Labuan">{t('tools.sabahSarawakLabuan')}</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">{t('tools.engineCapacity')}</label>
          <select
            value={engineCapacity}
            onChange={(e) => setEngineCapacity(e.target.value)}
            className="calculator-input"
          >
            <option value="">{t('tools.selectEngineCapacity')}</option>
            <option value="0-1400 cc">0-1400 cc</option>
            <option value="1401-1650cc">1401-1650cc</option>
            <option value="1651-2200cc">1651-2200cc</option>
            <option value="2201-3050cc">2201-3050cc</option>
            <option value="3051-4100cc">3051-4100cc</option>
            <option value="4101-4250cc">4101-4250cc</option>
            <option value="4251-4400cc">4251-4400cc</option>
            <option value="Over 4400cc">Over 4400cc</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">{t('tools.noClaimDiscount')}</label>
          <select
            value={noClaimDiscount}
            onChange={(e) => setNoClaimDiscount(e.target.value)}
            className="calculator-input"
          >
            <option value="">{t('tools.selectNCD')}</option>
            <option value="None - 0%">{t('tools.noneZeroPercent')}</option>
            <option value="First Year - 25%">{t('tools.firstYear25Percent')}</option>
            <option value="Second Year - 30%">{t('tools.secondYear30Percent')}</option>
            <option value="Third year - 38.33%">{t('tools.thirdYear38Percent')}</option>
            <option value="Fourth year - 45%">{t('tools.fourthYear45Percent')}</option>
            <option value="fifth or more year - 55%">{t('tools.fifthYearPlus55Percent')}</option>
          </select>
        </div>

        <div className="button-group">
          <button
            onClick={calculateInsurance}
            className="calculate-btn"
          >
            {t('tools.calculatePremium')}
          </button>
          <button
            onClick={resetCalculator}
            className="reset-btn"
          >
            {t('tools.reset')}
          </button>
        </div>

        {estimatedPremium && (
          <div className="results-container">
            <h4 className="results-title">{t('tools.estimatedPremium')}</h4>
            
            <div className="result-item">
              <span className="result-label">{t('tools.annualPremium')}</span>
              <span className="result-value">RM {formatNumber(estimatedPremium)}</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">{t('tools.monthlyPremium')}</span>
              <span className="result-value">RM {formatNumber((parseFloat(estimatedPremium) / 12).toFixed(2))}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loan Calculator Component
function LoanCalculator() {
  const { t } = useTranslation();
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [monthlyInstallment, setMonthlyInstallment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  // Function to format numbers with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === "") return "";
    
    // Convert to number and handle decimal places
    const number = parseFloat(num);
    if (isNaN(number)) return "";
    
    // Split into integer and decimal parts
    const parts = number.toFixed(2).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Return with decimal part
    return `${formattedInteger}.${decimalPart}`;
  };

  // Function to format input numbers with commas (for display)
  const formatInputNumber = (num) => {
    if (num === null || num === undefined || num === "") return "";
    
    // Remove any existing commas and convert to number
    const cleanNum = num.toString().replace(/,/g, '');
    const number = parseFloat(cleanNum);
    
    if (isNaN(number)) return cleanNum;
    
    // Add commas to the number
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to handle input changes and format numbers
  const handleInputChange = (setter, value) => {
    // Remove commas for calculation
    const cleanValue = value.replace(/,/g, '');
    setter(cleanValue);
  };

  const calculateLoan = () => {
    const price = parseFloat(carPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) / 100 || 0;
    const years = parseInt(loanPeriod) || 0;

    if (price <= 0 || down < 0 || rate <= 0 || years <= 0) {
      alert("Please enter valid values for all fields");
      return;
    }

    if (down >= price) {
      alert("Down payment cannot be greater than or equal to car price");
      return;
    }

    const loanAmount = price - down;
    const totalInterestAmount = loanAmount * rate * years;
    const totalPaymentAmount = loanAmount + totalInterestAmount;
    const monthly = totalPaymentAmount / (years * 12);

    setMonthlyInstallment(monthly.toFixed(2));
    setTotalInterest(totalInterestAmount.toFixed(2));
    setTotalPayment(totalPaymentAmount.toFixed(2));
  };

  const resetCalculator = () => {
    setCarPrice("");
    setDownPayment("");
    setInterestRate("");
    setLoanPeriod("");
    setMonthlyInstallment(null);
    setTotalInterest(null);
    setTotalPayment(null);
  };

  return (
    <div className="loan-calculator">
      <div className="calculator-container">
        <h3 className="calculator-title">{t('tools.loanCalculatorTitle')}</h3>
        
        <div className="input-group">
          <label className="input-label">{t('tools.totalCarPrice')}</label>
          <input
            type="text"
            value={formatInputNumber(carPrice)}
            onChange={(e) => handleInputChange(setCarPrice, e.target.value)}
            className="calculator-input"
            placeholder="e.g. 200,000"
            min="0"
          />
        </div>

        <div className="input-group">
          <label className="input-label">{t('tools.downPayment')}</label>
          <input
            type="text"
            value={formatInputNumber(downPayment)}
            onChange={(e) => handleInputChange(setDownPayment, e.target.value)}
            className="calculator-input"
            placeholder="e.g. 40,000"
            min="0"
          />
        </div>

        <div className="input-group">
          <label className="input-label">{t('tools.interestRate')}</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="calculator-input"
            placeholder="e.g. 3.5"
            min="0"
            step="0.1"
          />
        </div>

        <div className="input-group">
          <label className="input-label">{t('tools.loanPeriod')}</label>
          <input
            type="number"
            value={loanPeriod}
            onChange={(e) => setLoanPeriod(e.target.value)}
            className="calculator-input"
            placeholder="e.g. 7"
            min="1"
            max="10"
          />
        </div>

        <div className="button-group">
          <button
            onClick={calculateLoan}
            className="calculate-btn"
          >
            {t('tools.calculateLoan')}
          </button>
          <button
            onClick={resetCalculator}
            className="reset-btn"
          >
            {t('tools.reset')}
          </button>
        </div>

        {monthlyInstallment && (
          <div className="results-container">
            <h4 className="results-title">{t('tools.loanResults')}</h4>
            
            <div className="result-item">
              <span className="result-label">{t('tools.monthlyInstallment')}</span>
              <span className="result-value">RM {formatNumber(monthlyInstallment)}</span>
            </div>
            

            
            <div className="result-item">
              <span className="result-label">{t('tools.loanAmount')}</span>
              <span className="result-value">RM {formatNumber(parseFloat(carPrice) - parseFloat(downPayment))}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HelpfulTools() {
  console.log('HelpfulTools component rendering');
  const { tools } = useParams();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    // Use the tools parameter from useParams
    console.log('useEffect triggered - tools:', tools);
    setCurrentSection(tools || '');
    
    // Scroll to top with smooth animation when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [tools]);

  // Calculate total progress
  const calculateProgress = () => {
    const allItems = [
      ...checklistProgress.personal,
      ...checklistProgress.financial,
      ...checklistProgress.address,
      ...checklistProgress.payment
    ];
    const completedItems = allItems.filter(item => item).length;
    return Math.round((completedItems / allItems.length) * 100);
  };

  // Handle checklist item toggle
  const handleChecklistToggle = (category, index) => {
    setChecklistProgress(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? !item : item
      )
    }));
  };

  // Get category completion count
  const getCategoryCount = (category) => {
    const completed = checklistProgress[category].filter(item => item).length;
    const total = checklistProgress[category].length;
    return `${completed}/${total}`;
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'insurance-estimate':
        return (
          <div className="section-content">
            <h1 className="section-title">{t('tools.insuranceEstimator')}</h1>
            <p className="section-description">
              {t('tools.insuranceEstimatorDesc')}
            </p>
            <InsuranceCalculator />
          </div>
        );

             case 'loan-checker':
         return (
           <div className="section-content">
             <h1 className="section-title">{t('tools.loanChecker')}</h1>
             <p className="section-description">
               {t('tools.loanCheckerDesc')}
             </p>
             <LoanCalculator />
           </div>
         );

             case 'document-checklist':
         return (
           <div className="section-content">
             <h1 className="section-title">{t('tools.documentChecklist')}</h1>
             <p className="section-description">
               {t('tools.documentChecklistDesc')}
             </p>
             
             <div className="document-checklist">
               <div style={{ height: '40px' }}></div>
               <h2 className="checklist-title">{t('tools.checklistTitle')}</h2>
               
               <div style={{ height: '30px' }}></div>
               
               <div className="checklist-category">
                 <h3 className="category-title">{t('tools.essentialDocuments')}</h3>
                 <ul className="checklist-items">
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.nric')}</span>
                   </li>
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.drivingLicense')}</span>
                   </li>
                 </ul>
               </div>

               <div className="checklist-category">
                 <h3 className="category-title">{t('tools.financialDocuments')}</h3>
                 <ul className="checklist-items">
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.payslips')}</span>
                   </li>
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.bankStatements')}</span>
                   </li>
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.epfStatement')}</span>
                   </li>
                 </ul>
               </div>

               <div className="checklist-category">
                 <h3 className="category-title">{t('tools.addressVerification')}</h3>
                 <ul className="checklist-items">
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.proofOfAddress')}</span>
                   </li>
                 </ul>
               </div>

               <div className="checklist-category">
                 <h3 className="category-title">{t('tools.paymentRequirements')}</h3>
                 <ul className="checklist-items">
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.loanDownpayment')}</span>
                   </li>
                   <li className="checklist-item">
                     <span className="item-text">{t('tools.insurancePayment')}</span>
                   </li>
                 </ul>
               </div>

               <div className="processing-fee-highlight">
                 <div className="fee-icon">💡</div>
                 <div className="fee-content">
                   <h3 className="fee-title">{t('tools.processingFeeTitle')}</h3>
                   <p className="fee-description">
                     {t('tools.processingFeeDesc')}
                   </p>
                 </div>
               </div>
             </div>
           </div>
         );

      case 'car-recommendation':
        return (
          <div className="section-content">
            <h1 className="section-title">{t('tools.carRecommendation')}</h1>
            <p className="section-description">
              {t('tools.carRecommendationDesc')}
            </p>
            <div className="section-placeholder">
              <h3>{t('tools.carRecommendationComingSoon')}</h3>
              <p>{t('tools.carRecommendationComingSoonDesc')}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="section-content">
            <h1 className="section-title">{t('tools.heroTitle')}</h1>
            <p className="section-description">
              {t('tools.heroDescription')}
            </p>
            <div className="tools-overview">
              <Link to="/helpful-tools/insurance-estimate" className="tool-overview-card">
                <h3>{t('tools.insuranceEstimator')}</h3>
                <p>{t('tools.insuranceEstimatorOverview')}</p>
              </Link>
              <Link to="/helpful-tools/loan-checker" className="tool-overview-card">
                <h3>{t('tools.loanChecker')}</h3>
                <p>{t('tools.loanCheckerOverview')}</p>
              </Link>
              <Link to="/helpful-tools/document-checklist" className="tool-overview-card">
                <h3>{t('tools.documentChecklist')}</h3>
                <p>{t('tools.documentChecklistOverview')}</p>
              </Link>
              <Link to="/helpful-tools/car-recommendation" className="tool-overview-card">
                <h3>{t('tools.carRecommendation')}</h3>
                <p>{t('tools.carRecommendationOverview')}</p>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="helpful-tools-page">
      {/* Header */}
      <VicarHeader />



      {/* Main Content */}
      <main className="main-content">
        <section className="tools-hero-section">
          <div className="container">
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
              {renderSectionContent()}
            </AnimatedContent>
          </div>
        </section>

        {/* Mobile App Promotion 
        <section className="mobile-app-section">
          <div className="container">
            <div className="app-promotion-content">
              <div className="app-info">
                <h2 className="app-title">NEED CAR ADVICE?</h2>
                <p className="app-subtitle">Contact Us or Download Vicar App Now!</p>
                <p className="app-description">
                  Whether you're inquiring about our latest inventory, seeking expert advice, or have a general question, our dedicated team is ready to assist you.
                </p>
                <button className="appointment-btn">SCHEDULE AN APPOINTMENT</button>
                <div className="store-buttons">
                  <button className="store-btn google-play">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="btn-text">
                      <span className="btn-label">ANDROID APP ON</span>
                      <span className="btn-title">Google Play</span>
                    </div>
                  </button>
                  <button className="store-btn app-store">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="btn-text">
                      <span className="btn-label">Download on the</span>
                      <span className="btn-title">App Store</span>
                    </div>
                  </button>
                  <button className="store-btn huawei-store">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                    </svg>
                    <div className="btn-text">
                      <span className="btn-label">EXPLORE IT ON</span>
                      <span className="btn-title">AppGallery</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="app-image">
                <img src="/mob-app.png" alt="Vicar Mobile App" className="mobile-app-img" />
              </div>
            </div>
          </div>
        </section>
        */}
      </main>

      {/* Footer Component */}
      <VicarFooter />
    </div>
  );
}

export default HelpfulTools;

