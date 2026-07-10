import { site } from "@/content/site";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import Typologies from "@/components/Typologies";
import Terminaciones from "@/components/Terminaciones";
import Location from "@/components/Location";
import Lifestyle from "@/components/Lifestyle";
import ContactCatalog from "@/components/ContactCatalog";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function Home() {
  return (
    <>
      <Preloader brand={site.brand} />
      <Header brand={site.brand} nav={site.nav} />
      <main>
        <Hero content={site.hero} brand={site.brand} whatsapp={site.whatsapp} />
        <Concept content={site.concept} brand={site.brand} />
        <Gallery content={site.gallery} />
        <Amenities content={site.amenities} />
        <Typologies content={site.typologies} />
        <Terminaciones content={site.terminaciones} />
        <Lifestyle content={site.lifestyle} />
        <Location content={site.location} />
        <ContactCatalog
          contact={site.contact}
          catalog={site.catalog}
          whatsapp={site.whatsapp}
        />
      </main>
      <Footer content={site.footer} brand={site.brand} />
      <WhatsAppFab config={site.whatsapp} />
    </>
  );
}
