import Hero from '../components/sections/Hero';
import ConceptHistory from '../components/sections/ConceptHistory';
import Vision from '../components/sections/Vision';
import Packages from '../components/sections/Packages';
import ProblemBank from '../components/sections/ProblemBank';
import LayerModel from '../components/sections/LayerModel';
import CasesSection from '../components/sections/CasesSection';
import ConceptMap from '../components/sections/ConceptMap';
import Stats from '../components/sections/Stats';
import CTA from '../components/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <ConceptHistory />
      <Vision />
      <Packages />
      <ProblemBank />
      <LayerModel />
      <CasesSection />
      <ConceptMap />
      <Stats />
      <CTA />
    </>
  );
}
