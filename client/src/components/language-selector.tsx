import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Languages } from "lucide-react";

interface LanguageSelectorProps {
  onLanguageChange?: (locale: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange
}) => {
  const [currentLocale, setCurrentLocale] = useState<string>('en');

  useEffect(() => {
    // Detect browser language on mount
    const browserLocale = navigator.language || navigator.languages?.[0] || 'en';
    const detectedLocale = browserLocale.startsWith('es') ? 'es' : 'en';
    setCurrentLocale(detectedLocale);
  }, []);

  const changeLanguage = (locale: string) => {
    try {
      setCurrentLocale(locale);
      
      // Update document language
      document.documentElement.lang = locale;
      
      // Update browser locale for testing
      if (locale === 'es') {
        // Set Spanish locale context
        document.documentElement.setAttribute('data-locale', 'es-ES');
      } else {
        // Set English locale context
        document.documentElement.setAttribute('data-locale', 'en-US');
      }
      
      onLanguageChange?.(locale);
      
      // Log for debugging
      console.log(`Language changed to: ${locale}`, {
        documentLang: document.documentElement.lang,
        navigatorLanguage: navigator.language,
        dataLocale: document.documentElement.getAttribute('data-locale')
      });
      
    } catch (error) {
      console.warn('Language change error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5" />
          Language / Idioma
        </CardTitle>
        <p className="text-sm text-slate-600">
          {currentLocale === 'es' 
            ? 'Selecciona el idioma para probar la funcionalidad' 
            : 'Select language to test functionality'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={currentLocale === 'en' ? 'default' : 'outline'}
            onClick={() => changeLanguage('en')}
            className="flex-1 gap-2"
            data-testid="language-en"
          >
            <Languages className="h-4 w-4" />
            English
          </Button>
          <Button
            variant={currentLocale === 'es' ? 'default' : 'outline'}
            onClick={() => changeLanguage('es')}
            className="flex-1 gap-2"
            data-testid="language-es"
          >
            <Languages className="h-4 w-4" />
            Español
          </Button>
        </div>
        
        <div className="p-3 bg-slate-50 rounded-lg text-sm">
          <div className="font-medium mb-1">
            {currentLocale === 'es' ? 'Estado actual:' : 'Current status:'}
          </div>
          <div className="space-y-1 text-slate-600">
            <div>
              {currentLocale === 'es' ? 'Idioma:' : 'Language:'} {currentLocale.toUpperCase()}
            </div>
            <div>
              {currentLocale === 'es' ? 'Navegador:' : 'Browser:'} {navigator.language}
            </div>
            <div>
              {currentLocale === 'es' ? 'Documento:' : 'Document:'} {document.documentElement.lang}
            </div>
          </div>
        </div>

        {currentLocale === 'es' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <div className="font-medium text-yellow-800 mb-1">⚠️ Modo de prueba</div>
            <div className="text-yellow-700">
              Ahora puedes probar la selección manual de números para reproducir el error DOM.
            </div>
          </div>
        )}

        {currentLocale === 'en' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <div className="font-medium text-blue-800 mb-1">ℹ️ Test Mode</div>
            <div className="text-blue-700">
              You can now test manual number selection to check for DOM errors.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;