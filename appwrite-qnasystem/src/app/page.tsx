import Image from "next/image";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LatestQuestions />
        <TopContributers />
      </main>
      <Footer />
    </>
  );
}
