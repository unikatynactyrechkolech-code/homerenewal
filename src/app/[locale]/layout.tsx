import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import PageTransition from "@/components/PageTransition";
import EditorProvider from "@/components/admin/EditorProvider";
import AdminBar from "@/components/admin/AdminBar";
import { loadAllContent } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const initialContent = await loadAllContent();

  // Serializuj overrides pro inline script — aplikuje se synchronně před 1. paintem
  const contentJson = JSON.stringify(initialContent);

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Aplikuj overrides synchronně před prvním React renderem — zabrání blikání */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try{
    var data=${contentJson};
    var pn=window.location.pathname;
    function applyAll(){
      var tags=['h1','h2','h3','h4','h5','h6','p','li','button','a','span','label','blockquote','[data-editable]'];
      var els=document.querySelectorAll(tags.join(','));
      els.forEach(function(el){
        var text=(el.textContent||'').trim();
        if(!text)return;
        var hasChildText=false;
        for(var i=0;i<el.children.length;i++){if((el.children[i].textContent||'').trim())hasChildText=true;}
        if(hasChildText)return;
        var tag=el.tagName.toLowerCase();
        var all=document.querySelectorAll(tag);
        var idx=Array.prototype.indexOf.call(all,el);
        var key=el.getAttribute('data-edit-key')||(pn+'::'+tag+':'+idx);
        if(data[key]){
          el.textContent=data[key].text;
          // Inline styly záměrně NEAPLIKUJEME — design řídí CSS/Tailwind.
        }
      });
    }
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',applyAll);}else{applyAll();}
  }catch(e){}
})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <EditorProvider initialContent={initialContent}>
            <LoadingScreen />
            <Header />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer />
            <AdminBar />
          </EditorProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
