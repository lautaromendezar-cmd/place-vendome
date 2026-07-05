import { site } from "@/content/site";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import Typologies from "@/components/Typologies";
import Location from "@/components/Location";
import Lifestyle from "@/components/Lifestyle";
import Contact from "@/components/Contact";
import CatalogCta from "@/components/CatalogCta";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function Home() {
  return (
    <>
      <Header brand={site.brand} nav={site.nav} />
      <main>
        <Hero content={site.hero} brand={site.brand} whatsapp={site.whatsapp} />
        <Concept content={site.concept} brand={site.brand} />
        <Gallery content={site.gallery} />
        <Amenities content={site.amenities} />
        <Typologies content={site.typologies} />
        <Location content={site.location} />
        <Lifestyle content={site.lifestyle} />
        <Contact content={site.contact} whatsapp={site.whatsapp} />
        <CatalogCta content={site.catalog} />
      </main>
      <Footer content={site.footer} brand={site.brand} />
      <WhatsAppFab config={site.whatsapp} />
    </>
  );
}
