import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SchedulingSection from '@/components/scheduling-section';

export default function ObrigadoPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center text-center">
                <SchedulingSection />
            </main>
            <Footer />
        </div>
    );
}
