import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SimulatedLocation() {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4 flex items-center gap-3">
        <MapPin className="h-6 w-6 text-primary" />
        <div>
          <p className="font-semibold">Localização detectada: São Paulo</p>
          <p className="text-xs text-muted-foreground">(simulação para aumentar imersão)</p>
        </div>
      </CardContent>
    </Card>
  );
}
