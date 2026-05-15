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
          // Inline styly jen mimo header (tam jsou barvy dynamicke dle scroll stavu).
          if(!el.closest('header')){
            if(data[key].font_family)el.style.fontFamily=data[key].font_family;
            if(data[key].font_size)el.style.fontSize=data[key].font_size;
            if(data[key].font_weight)el.style.fontWeight=data[key].font_weight;
            if(data[key].color)el.style.color=data[key].color;
          }
        }
      });
    }
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',applyAll);}else{applyAll();}
  }catch(e){}
})();`,
          }}
        />
        {/* Scroll restoration — zachovej pozici p\u0159i reloadu i p\u0159i client-side nav (zm\u011bna jazyka). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try{
    if('scrollRestoration' in history){history.scrollRestoration='manual';}
    var KEY='hr_scroll:'+location.pathname;
    var KEY_BASE='hr_scroll_base';
    function save(){try{sessionStorage.setItem(KEY,String(window.scrollY));}catch(e){}}
    function restore(){
      try{
        // 1) per-path key
        var v=sessionStorage.getItem(KEY);
        // 2) fallback z lokal\u011b switche \u2014 pos\u00edl\u00e1 se p\u0159es base key (path bez locale)
        if(v===null){
          var base=location.pathname.replace(/^\\/(cs|en)/,'');
          var bv=sessionStorage.getItem(KEY_BASE+':'+base);
          if(bv){v=bv;sessionStorage.removeItem(KEY_BASE+':'+base);}
        }
        if(v!==null){
          var y=parseInt(v,10)||0;
          // Pou\u017eij rAF aby se rozlo\u017een\u00ed stihlo dopo\u010d\u00edtat
          requestAnimationFrame(function(){window.scrollTo(0,y);
            requestAnimationFrame(function(){window.scrollTo(0,y);});
          });
        }
      }catch(e){}
    }
    // P\u0159ed nav/reload ulo\u017e pozici i pod base key (pro p\u0159e\u017eit\u00ed zm\u011bny locale)
    function saveBoth(){
      save();
      try{
        var base=location.pathname.replace(/^\\/(cs|en)/,'');
        sessionStorage.setItem(KEY_BASE+':'+base,String(window.scrollY));
      }catch(e){}
    }
    window.addEventListener('beforeunload',saveBoth);
    window.addEventListener('pagehide',saveBoth);
    if(document.readyState==='complete'||document.readyState==='interactive'){restore();}
    else{document.addEventListener('DOMContentLoaded',restore);}
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
