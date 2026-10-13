import HomeNavbar from '@/components/home-navbar';
import Cta from '@/components/home/cta';
import Features from '@/components/home/features';
import Footer from '@/components/home/footer';
import Hero from '@/components/home/hero';
import HowItWorks from '@/components/home/how-it-works';
import Security from '@/components/home/security';
import Stats from '@/components/home/stats';

export default function Home() {
  return (
    <main>
      <HomeNavbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Security />
      <Cta />
      <Footer />
    </main>
  );
}
