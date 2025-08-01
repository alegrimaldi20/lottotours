import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Booking from "@/components/booking";
import Reviews from "@/components/reviews";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <Services />
      <Booking />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}
