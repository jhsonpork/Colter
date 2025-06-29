import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AdGenerator from './components/AdGenerator';
import CampaignGenerator from './components/CampaignGenerator';
import AdRewriter from './components/AdRewriter';
import SavedCampaigns from './components/SavedCampaigns';
import ColdEmailGenerator from './components/ColdEmailGenerator';
import SocialBlitzGenerator from './components/SocialBlitzGenerator';
import InfluencerPitchGenerator from './components/InfluencerPitchGenerator';
import CampaignExporter from './components/CampaignExporter';
import AdComparator from './components/AdComparator';
import PersonaProfiler from './components/PersonaProfiler';
import ContentAngleGenerator from './components/ContentAngleGenerator';
import TrendRewriter from './components/TrendRewriter';
import ABVariationGenerator from './components/ABVariationGenerator';
import TonePolisher from './components/TonePolisher';
import CampaignPackExporter from './components/CampaignPackExporter';
import HookAnalyzer from './components/HookAnalyzer';
import HeadlineSplitTester from './components/HeadlineSplitTester';
import AudienceResonanceAnalyzer from './components/AudienceResonanceAnalyzer';
import PainPointExtractor from './components/PainPointExtractor';
import OfferOptimizer from './components/OfferOptimizer';
import ScriptToSkitConverter from './components/ScriptToSkitConverter';
import StoryboardBuilder from './components/StoryboardBuilder';
import EmotionalTriggerMapper from './components/EmotionalTriggerMapper';
import ControversialTakeGenerator from './components/ControversialTakeGenerator';
import FlipScriptReverser from './components/FlipScriptReverser';
import PersonaCTAGenerator from './components/PersonaCTAGenerator';
import BeforeAfterAdGenerator from './components/BeforeAfterAdGenerator';
import MetaphorMagicTool from './components/MetaphorMagicTool';
import CommentBaitGenerator from './components/CommentBaitGenerator';
import AdBuildingBlockAssembler from './components/AdBuildingBlockAssembler';
// NEW FINAL 12 FEATURES
import AdVersionExplainer from './components/AdVersionExplainer';
import ModularAdAssembler from './components/ModularAdAssembler';
import AdGoalMatcher from './components/AdGoalMatcher';
import Deviralizer from './components/Deviralizer';
import FirstThreeSecondsOptimizer from './components/FirstThreeSecondsOptimizer';
import CTAPersonalizer from './components/CTAPersonalizer';
import PsychTestForCopy from './components/PsychTestForCopy';
import VisualAdBuilder from './components/VisualAdBuilder';
import AdStyleRoulette from './components/AdStyleRoulette';
import AdMagnetBreakdown from './components/AdMagnetBreakdown';
import ViralPerformancePredictor from './components/ViralPerformancePredictor';
import HookMemoryTest from './components/HookMemoryTest';
// MORE FEATURES (12 NEW)
import OfferAngleMatcher from './components/OfferAngleMatcher';
import HookFrameTester from './components/HookFrameTester';
import CreatorFunnelBuilder from './components/CreatorFunnelBuilder';
import CourseSummaryGenerator from './components/CourseSummaryGenerator';
import CommentExploder from './components/CommentExploder';
import ViralCTASequencer from './components/ViralCTASequencer';
import PlatformTimingForecaster from './components/PlatformTimingForecaster';
import ContentEthicsSanitizer from './components/ContentEthicsSanitizer';
import ValueLadderBuilder from './components/ValueLadderBuilder';
import MonetizationGenerator from './components/MonetizationGenerator';
import ContentFrameworkBuilder from './components/ContentFrameworkBuilder';
import CourseCurriculumBuilder from './components/CourseCurriculumBuilder';
// 10 NEW ADDITIONAL FEATURES
import ZeroToStartupEngine from './components/ZeroToStartupEngine';
import ContentCalendarGenerator from './components/ContentCalendarGenerator';
import PromptDebugger from './components/PromptDebugger';
import OnePersonAgencyAutomator from './components/OnePersonAgencyAutomator';
import ProductLaunchFlow from './components/ProductLaunchFlow';
import FailureAnalyzer from './components/FailureAnalyzer';
import IncomeStreamGenerator from './components/IncomeStreamGenerator';
import InfographicWizard from './components/InfographicWizard';
import DigitalProductGenerator from './components/DigitalProductGenerator';
import CreatorCollabConnector from './components/CreatorCollabConnector';
// 10 NEW BUSINESS FEATURES
import ContractClauseNegotiator from './components/ContractClauseNegotiator';
import RegulationGapScanner from './components/RegulationGapScanner';
import MonetizationMultiplier from './components/MonetizationMultiplier';
import CrisisCommsGenerator from './components/CrisisCommsGenerator';
import AcquisitionLanguageTranslator from './components/AcquisitionLanguageTranslator';
import ChurnAutopsyReport from './components/ChurnAutopsyReport';
import GlobalPayrollArchitect from './components/GlobalPayrollArchitect';
import IPStrategySimulator from './components/IPStrategySimulator';
import BoardMeetingAlchemist from './components/BoardMeetingAlchemist';
import ExitMultiplierEngine from './components/ExitMultiplierEngine';
// NEW BLUE FEATURES
import IdeaToCompany from './components/IdeaToCompany';
import AutoGhostwriter from './components/AutoGhostwriter';
import DecisionClarity from './components/DecisionClarity';
import BreakpointFixer from './components/BreakpointFixer';
import HyperPersona from './components/HyperPersona';
import PerfectPricing from './components/PerfectPricing';
import AudienceTrigger from './components/AudienceTrigger';
import StartupStrategy from './components/StartupStrategy';
import MiniSaaS from './components/MiniSaaS';
import DistributionStack from './components/DistributionStack';

import PricingModal from './components/PricingModal';
import Navigation from './components/Navigation';
import { AdResult, SavedCampaign } from './types/ad';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './components/auth/AuthPage';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedFeature from './components/ProtectedFeature';
import { supabase } from './lib/supabase';
import SuccessPage from './components/SuccessPage';
import AuthModal from './components/auth/AuthModal';

type ActivePage = 'generator' | 'campaign' | 'rewriter' | 'saved' | 'email' | 'social' | 'influencer' | 'export' |
  'comparator' | 'personas' | 'angles' | 'trend-rewriter' | 'ab-variations' | 'tone-polisher' | 'campaign-pack' | 'hook-analyzer' |
  'headline-tester' | 'audience-analyzer' | 'pain-extractor' | 'offer-optimizer' | 'script-skit' | 'storyboard' | 
  'emotion-mapper' | 'controversial' | 'flip-script' | 'persona-cta' | 'before-after' | 'metaphor' | 'comment-bait' | 'ad-blocks' |
  // NEW FINAL 12 FEATURES
  'ad-explainer' | 'modular-assembler' | 'goal-matcher' | 'deviralizer' | 'first-3-seconds' | 'cta-personalizer' |
  'psych-test' | 'visual-builder' | 'style-roulette' | 'magnet-breakdown' | 'performance-predictor' | 'memory-test' |
  // MORE FEATURES
  'offer-angle-matcher' | 'hook-frame-tester' | 'creator-funnel-builder' | 'course-summary-generator' |
  'comment-exploder' | 'viral-cta-sequencer' | 'platform-timing-forecaster' | 'content-ethics-sanitizer' |
  'value-ladder-builder' | 'monetization-generator' | 'content-framework-builder' | 'course-curriculum-builder' |
  // 10 NEW ADDITIONAL FEATURES
  'startup-engine' | 'content-calendar' | 'prompt-debugger' | 'agency-automator' | 'product-launch' |
  'failure-analyzer' | 'income-streams' | 'infographic-wizard' | 'digital-product' | 'collab-connector' |
  // NEW BUSINESS FEATURES
  'contract-negotiator' | 'regulation-scanner' | 'monetization-multiplier' | 'crisis-comms' | 'acquisition-translator' |
  'churn-autopsy' | 'global-payroll' | 'ip-strategy' | 'board-meeting' | 'exit-multiplier' |
  // NEW BLUE FEATURES
  'idea-to-company' | 'auto-ghostwriter' | 'decision-clarity' | 'breakpoint-fixer' | 'hyperpersona' |
  'perfect-pricing' | 'audience-trigger' | 'startup-strategy' | 'mini-saas' | 'distribution-stack';

function App() {
  const [activePage, setActivePage] = useState<ActivePage>('generator');
  const [generatedAd, setGeneratedAd] = useState<AdResult | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Define which features require Pro subscription
  const proFeatures: ActivePage[] = [
    // Advanced Features
    'emotion-mapper', 'controversial', 'flip-script', 'persona-cta', 'before-after', 
    'metaphor', 'comment-bait', 'ad-blocks', 'pain-extractor', 'offer-optimizer', 
    'script-skit', 'storyboard',
    
    // Premium Features
    'ad-explainer', 'modular-assembler', 'goal-matcher', 'deviralizer', 'first-3-seconds', 
    'cta-personalizer', 'psych-test', 'visual-builder', 'style-roulette', 'magnet-breakdown', 
    'performance-predictor', 'memory-test',
    
    // More Features
    'offer-angle-matcher', 'hook-frame-tester', 'creator-funnel-builder', 'course-summary-generator',
    'comment-exploder', 'viral-cta-sequencer', 'platform-timing-forecaster', 'content-ethics-sanitizer',
    'value-ladder-builder', 'monetization-generator', 'content-framework-builder', 'course-curriculum-builder',
    
    // Additional Features
    'startup-engine', 'content-calendar', 'prompt-debugger', 'agency-automator', 'product-launch',
    'failure-analyzer', 'income-streams', 'infographic-wizard', 'digital-product', 'collab-connector',
    
    // Business Features
    'contract-negotiator', 'regulation-scanner', 'monetization-multiplier', 'crisis-comms', 'acquisition-translator',
    'churn-autopsy', 'global-payroll', 'ip-strategy', 'board-meeting', 'exit-multiplier',
    
    // Blue Features
    'idea-to-company', 'auto-ghostwriter', 'decision-clarity', 'breakpoint-fixer', 'hyperpersona',
    'perfect-pricing', 'audience-trigger', 'startup-strategy', 'mini-saas', 'distribution-stack'
  ];

  // Load saved campaigns from localStorage or Supabase if logged in
  useEffect(() => {
    const loadCampaigns = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is logged in, load from Supabase
        try {
          const { data, error } = await supabase
            .from('saved_campaigns')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            throw error;
          }
          
          if (data) {
            const formattedCampaigns: SavedCampaign[] = data.map(item => ({
              id: item.id,
              name: item.name,
              createdAt: item.created_at,
              type: item.type,
              ...(item.type === 'single' ? { ad: item.data as any } : { campaign: item.data as any })
            }));
            
            setSavedCampaigns(formattedCampaigns);
          }
        } catch (error) {
          console.error('Error loading campaigns from Supabase:', error);
          // Fallback to localStorage
          const saved = localStorage.getItem('adrocket-campaigns');
          if (saved) {
            setSavedCampaigns(JSON.parse(saved));
          }
        }
      } else {
        // User is not logged in, load from localStorage
        const saved = localStorage.getItem('adrocket-campaigns');
        if (saved) {
          setSavedCampaigns(JSON.parse(saved));
        }
      }
    };
    
    loadCampaigns();
  }, []);

  const handleAdGenerated = async (ad: AdResult) => {
    setGeneratedAd(ad);
    // Disable this for now to make all features fully functional
    // setHasUsedFreeTrial(true);
    
    // Save to campaigns
    const newCampaign: SavedCampaign = {
      id: Date.now().toString(),
      name: `${ad.businessType} Campaign`,
      ad,
      createdAt: new Date().toISOString(),
      type: 'single'
    };
    
    const updatedCampaigns = [newCampaign, ...savedCampaigns];
    setSavedCampaigns(updatedCampaigns);
    
    // Save to localStorage for non-logged in users
    localStorage.setItem('adrocket-campaigns', JSON.stringify(updatedCampaigns));
    
    // If user is logged in, save to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        await supabase.from('saved_campaigns').insert({
          user_id: session.user.id,
          name: newCampaign.name,
          data: ad,
          type: 'single'
        });
      } catch (error) {
        console.error('Error saving campaign to Supabase:', error);
      }
    }
  };

  const handleCampaignGenerated = async (campaign: SavedCampaign) => {
    const updatedCampaigns = [campaign, ...savedCampaigns];
    setSavedCampaigns(updatedCampaigns);
    
    // Save to localStorage for non-logged in users
    localStorage.setItem('adrocket-campaigns', JSON.stringify(updatedCampaigns));
    
    // If user is logged in, save to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        await supabase.from('saved_campaigns').insert({
          user_id: session.user.id,
          name: campaign.name,
          data: campaign.campaign,
          type: 'campaign'
        });
      } catch (error) {
        console.error('Error saving campaign to Supabase:', error);
      }
    }
  };

  const handleUpgradeClick = () => {
    setShowPricing(true);
  };

  const handleDeleteCampaign = async (id: string) => {
    const updatedCampaigns = savedCampaigns.filter(c => c.id !== id);
    setSavedCampaigns(updatedCampaigns);
    
    // Update localStorage
    localStorage.setItem('adrocket-campaigns', JSON.stringify(updatedCampaigns));
    
    // If user is logged in, delete from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        await supabase.from('saved_campaigns').delete().eq('id', id);
      } catch (error) {
        console.error('Error deleting campaign from Supabase:', error);
      }
    }
  };

  const handleAuthModalOpen = () => {
    setShowAuthModal(true);
  };

  const MainContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Header onUpgradeClick={handleUpgradeClick} onAuthClick={handleAuthModalOpen} />
        
        {activePage === 'generator' && !generatedAd && (
          <HeroSection />
        )}
        
        <Navigation activePage={activePage} onPageChange={setActivePage} />
        
        <div className="transition-all duration-500 ease-in-out">
          {activePage === 'generator' && (
            <AdGenerator 
              onAdGenerated={handleAdGenerated}
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              generatedAd={generatedAd}
              onAuthRequired={handleAuthModalOpen}
            />
          )}
          
          {activePage === 'campaign' && (
            <CampaignGenerator 
              onCampaignGenerated={handleCampaignGenerated}
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}
          
          {activePage === 'rewriter' && (
            <AdRewriter 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'email' && (
            <ColdEmailGenerator 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'social' && (
            <SocialBlitzGenerator 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'influencer' && (
            <InfluencerPitchGenerator 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'export' && (
            <CampaignExporter 
              campaigns={savedCampaigns}
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'comparator' && (
            <AdComparator 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'personas' && (
            <PersonaProfiler 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'angles' && (
            <ContentAngleGenerator 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'trend-rewriter' && (
            <TrendRewriter 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'ab-variations' && (
            <ABVariationGenerator 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'tone-polisher' && (
            <TonePolisher 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'campaign-pack' && (
            <CampaignPackExporter 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'hook-analyzer' && (
            <HookAnalyzer 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'headline-tester' && (
            <HeadlineSplitTester 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {activePage === 'audience-analyzer' && (
            <AudienceResonanceAnalyzer 
              onUpgradeClick={handleUpgradeClick}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onAuthRequired={handleAuthModalOpen}
            />
          )}

          {/* ALL 12 ADVANCED FEATURES - FULLY FUNCTIONAL */}
          {activePage === 'pain-extractor' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <PainPointExtractor 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'offer-optimizer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <OfferOptimizer 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'script-skit' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ScriptToSkitConverter 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'storyboard' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <StoryboardBuilder 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'emotion-mapper' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <EmotionalTriggerMapper 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'controversial' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ControversialTakeGenerator 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'flip-script' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <FlipScriptReverser 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'persona-cta' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <PersonaCTAGenerator 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'before-after' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <BeforeAfterAdGenerator 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'metaphor' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <MetaphorMagicTool 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'comment-bait' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CommentBaitGenerator 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'ad-blocks' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AdBuildingBlockAssembler 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {/* NEW FINAL 12 FEATURES - ALL FULLY FUNCTIONAL */}
          {activePage === 'ad-explainer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AdVersionExplainer 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'modular-assembler' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ModularAdAssembler 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'goal-matcher' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AdGoalMatcher 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'deviralizer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <Deviralizer 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'first-3-seconds' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <FirstThreeSecondsOptimizer 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'cta-personalizer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CTAPersonalizer 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'psych-test' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <PsychTestForCopy 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'visual-builder' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <VisualAdBuilder 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'style-roulette' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AdStyleRoulette 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'magnet-breakdown' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AdMagnetBreakdown 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'performance-predictor' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ViralPerformancePredictor 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'memory-test' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <HookMemoryTest 
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {/* MORE FEATURES (12 NEW) - ALL FULLY FUNCTIONAL */}
          {activePage === 'offer-angle-matcher' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <OfferAngleMatcher
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'hook-frame-tester' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <HookFrameTester
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'creator-funnel-builder' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CreatorFunnelBuilder
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'course-summary-generator' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CourseSummaryGenerator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'comment-exploder' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CommentExploder
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'viral-cta-sequencer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ViralCTASequencer
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'platform-timing-forecaster' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <PlatformTimingForecaster
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'content-ethics-sanitizer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ContentEthicsSanitizer
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'value-ladder-builder' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ValueLadderBuilder
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'monetization-generator' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <MonetizationGenerator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'content-framework-builder' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ContentFrameworkBuilder
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'course-curriculum-builder' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CourseCurriculumBuilder
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {/* 10 NEW ADDITIONAL FEATURES - ALL FULLY FUNCTIONAL */}
          {activePage === 'startup-engine' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ZeroToStartupEngine
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'content-calendar' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ContentCalendarGenerator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'prompt-debugger' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <PromptDebugger
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'agency-automator' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <OnePersonAgencyAutomator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'product-launch' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ProductLaunchFlow
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'failure-analyzer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <FailureAnalyzer
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'income-streams' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <IncomeStreamGenerator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'infographic-wizard' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <InfographicWizard
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'digital-product' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <DigitalProductGenerator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'collab-connector' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CreatorCollabConnector
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {/* 10 NEW BUSINESS FEATURES - ALL FULLY FUNCTIONAL */}
          {activePage === 'contract-negotiator' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ContractClauseNegotiator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'regulation-scanner' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <RegulationGapScanner
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'monetization-multiplier' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <MonetizationMultiplier
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'crisis-comms' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <CrisisCommsGenerator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'acquisition-translator' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AcquisitionLanguageTranslator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'churn-autopsy' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ChurnAutopsyReport
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'global-payroll' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <GlobalPayrollArchitect
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'ip-strategy' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <IPStrategySimulator
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'board-meeting' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <BoardMeetingAlchemist
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'exit-multiplier' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <ExitMultiplierEngine
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {/* NEW BLUE FEATURES - ALL FULLY FUNCTIONAL */}
          {activePage === 'idea-to-company' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <IdeaToCompany
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'auto-ghostwriter' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AutoGhostwriter
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'decision-clarity' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <DecisionClarity
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'breakpoint-fixer' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <BreakpointFixer
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'hyperpersona' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <HyperPersona
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'perfect-pricing' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <PerfectPricing
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'audience-trigger' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <AudienceTrigger
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'startup-strategy' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <StartupStrategy
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'mini-saas' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <MiniSaaS
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}

          {activePage === 'distribution-stack' && (
            <ProtectedFeature onUpgradeClick={handleUpgradeClick}>
              <DistributionStack
                onUpgradeClick={handleUpgradeClick}
                hasUsedFreeTrial={hasUsedFreeTrial}
                onAuthRequired={handleAuthModalOpen}
              />
            </ProtectedFeature>
          )}
          
          {activePage === 'saved' && (
            <SavedCampaigns 
              campaigns={savedCampaigns}
              onDeleteCampaign={handleDeleteCampaign}
              onAuthRequired={handleAuthModalOpen}
            />
          )}
        </div>
        
        {showPricing && (
          <PricingModal onClose={() => setShowPricing(false)} />
        )}
        
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)}
            redirectPath={window.location.pathname}
          />
        )}
      </div>
    </div>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route 
            path="/" 
            element={<MainContent />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}

export default App;