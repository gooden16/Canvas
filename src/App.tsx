import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/layout';
import { PartnerPortalProvider } from '@/context/partner-portal-context';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <PartnerPortalProvider>
        <Layout>
          <AppRoutes />
        </Layout>
        <Toaster />
      </PartnerPortalProvider>
    </ThemeProvider>
  );
}

export default App;